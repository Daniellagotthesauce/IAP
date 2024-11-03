// server.js
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { addRecipe } = require('./recipe');
const { newUser } = require('./registration'); // Import registerUser function
const { loginUser } = require('./login');
const con = require('./connection'); // Import your MySQL connection

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from "public" folder

app.use((req, res, next) => {
    console.log( "Server.js: ", req.path, req.method, req.params, req.body);
    next();
});

// Handle the form submission
app.post('/register', (req, res) => {
    const userData = req.body; // Capture user data from the request
    newUser(userData, (err, result) => {
        if (err) {
            res.status(500).send("Error occurred while registering");
        } else {
            res.status(200).send("Registration successful!");
        }
    });
});

app.post('/login', (req, res) => {
    const userData = req.body; // Capture user data from the request
    loginUser(userData, (err, result) => {
        if (err) {
            res.status(500).send("Error occurred while logging in");
        } else if(result){
            res.status(200).send("Login successful!");
        }else { // result is null (incorrect password or user not found)
            res.status(401).send("Incorrect email or password"); // Unauthorized
        }
    });
});

app.post('/recipe', (req, res) => {
    const recipeData = req.body;

    addRecipe(recipeData, (err, result) => {
        if (err) {
            return res.status(500).send('Error occurred while adding the recipe');
        }
        res.status(200).send('Recipe added successfully');
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
