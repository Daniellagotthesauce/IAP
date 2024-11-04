const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { addRecipe, getRecipes } = require('./recipe');
const { newUser } = require('./registration');
const { loginUser } = require('./login');
const con = require('./connection'); 

const app = express();
const PORT = process.env.PORT || 4000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    console.log( "Server.js: ", req.path, req.method, req.params, req.body);
    next();
});


app.post('/register', (req, res) => {
    const userData = req.body; 
    newUser(userData, (err, result) => {
        if (err) {
            res.status(500).send("Error occurred while registering");
        } else {
            res.status(200).send("Registration successful!");
        }
    });
});

app.post('/login', (req, res) => {
    const userData = req.body; 
    loginUser(userData, (err, result) => {
        if (err) {
            res.status(500).send("Error occurred while logging in");
        } else if(result){
            res.status(200).send("Login successful!");
        }else { 
            res.status(401).send("Incorrect email or password");
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

app.get('/recipe',(req, res)=>{
    getRecipe((err, recipes)=>{
        if (err) {
            return res.status(500).send('Error fetching recipes');
    }
    res.render('recipes', { recipes });
  });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
