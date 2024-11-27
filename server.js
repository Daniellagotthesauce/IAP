require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { addRecipe, getRecipes } = require('./js_backend_file/recipe');
const { newUser } = require('./js_backend_file/registration');
const { loginUser } = require('./js_backend_file/login');
const con = require('./js_backend_file/connection');
const routes = require('./js_backend_file/routes');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const path = require('path');
const { uniqueKey } = process.env.uniqueKey;
const app = express();
const PORT = process.env.PORT || 4000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: '*', 
        credentials: true,
    })
);
app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    console.log("Server.js: ", req.path, req.method, req.params, req.body);
    next();
});

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: 'lax', 
        },
    })
);


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
            return res.status(500).send("Error occurred while logging in");
        }

        if (result && result.accessToken) {
            req.session.user = {
                UserID: result.user.UserID,
                FullName: result.user.FullName,
                UserTypeID: result.user.UserTypeID,
            };
            console.log("Session Set:", req.session.user); // Debug log
            res.status(200).json({ message: "Login successful", redirectUrl: "C:/Users/danie/OneDrive/Desktop/IAP WEEKLY PROJECTS/RECIPE IAP/html/recipeweb.html" });
        } else {
            res.status(401).send("Incorrect email or password");
        }
    });
});



app.post('/add-recipe', (req, res) => {
    const recipeData = req.body;

    addRecipe(recipeData, (err, result) => {
        if (err) {
            return res.status(500).send('Error occurred while adding the recipe');
        }
        res.status(200).send('Recipe added successfully');
    });
});

app.get('/get-recipe', (req, res) => {
    console.log("This is the get recipe function");
    getRecipes((err, recipes) => {
        if (err) {
            return res.status(500).send('Error fetching recipes');
        }
        console.log(recipes);
        res.json(recipes);
    });
});


app.get('/get-recipe/:RecipeID', (req, res) => {
    const RecipeID = req.params.RecipeID;
    console.log(`Fetching recipe with ID: ${RecipeID}`);

    getRecipeById(RecipeID, (err, recipe) => {
        if (err) {
            console.error('Error fetching recipe:', err);
            return res.status(500).send("Error fetching recipe");
        }
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }
        console.log('Recipe fetched:', recipe);
        res.json(recipe);
    });
});


const getRecipeById = (RecipeID, callback) => {
    const retrieve = 'SELECT * FROM recipes WHERE RecipeID = ?';
    con.query(retrieve, [RecipeID], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        if (results.length === 0) {
            return callback(null, null);
        }
        callback(null, results[0]);
    });
};



const verification = (req, res, next) => {
    const authenticate = req.headers['authorization'];
    const token = authenticate && authenticate.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    jwt.verify(token, process.env.uniqueKey, (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token.');
        }
        req.user = decoded;
        next();
    });

};


app.get('/users', verification, (req, res) => {
    const query = 'SELECT FullName FROM users';

    con.query(query, (err, results) => {
        if (err) {
            return res.status(500).send("Error fetching users.");
        }

        const names = results.map(user => user.FullName);
        res.json(names);
    });
});

app.get('/user/:email', verification, (req, res) => {
    const { email } = req.params;
    const emailqr = 'SELECT * FROM users WHERE Email= ?';
    const values = [email];

    con.query(emailqr, values, (err, results) => {
        if (err) {
            return res.status(500).send("Error fetching user details.");
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send("User not found.");
        }
    });
});


app.get('/users/:gender', verification, (req, res) => {
    const { gender } = req.params;
    const genderqr = 'SELECT FullName FROM users WHERE Gender=?';
    const values = [gender];

    con.query(genderqr, values, (err, results) => {
        if (err) {
            return res.status(500).send("Error fetching users based on gender.");
        }
        if (results.length > 0) {
            const userNames = results.map(user => user.FullName);
            res.json(userNames);
        } else {
            res.status(404).send("No users found for this gender.");
        }
    });
});

app.get('/html/displayRecipe', routes.recipesRoot);

app.get('/session', (req, res) => {
    console.log("Session Cookie:", req.headers.cookie);
    console.log("Session Data:", req.session);
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).send("No active session");
    }
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
