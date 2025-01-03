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
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    console.log("Server.js: ", req.path, req.method, req.headers, req.body);
    next();
});



/*app.use(session({
    secret: 'daniella',   // Replace with a more secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }   // Set to true if using HTTPS
}));
*/

app.post('/login', (req, res) => {
    const userData = req.body;
    loginUser(userData, (err, result) => {
        if (err) {
            return res.status(500).send("Error occurred while logging in");
        }

        if (result && result.accessToken) {

            //req.session.token = result.accessToken;

            res.status(200).json({
                message: "Login successful",
                accessToken: result.accessToken,
                UserTypeID: result.user.UserTypeID,
                UserID: result.user.UserID,
            });
        } else {
            res.status(401).send("Incorrect email or password");
        }
    });
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


app.post('/add-recipe', (req, res) => {
    const recipeData = req.body;

    // Validate if all required fields are provided, including UserID
    if (!recipeData.UserID) {
        return res.status(400).send('UserID is required.');
    }

    addRecipe(recipeData, (err, result) => {
        if (err) {
            return res.status(500).send('Error occurred while adding the recipe.');
        }
        res.status(200).send('Recipe added successfully.');
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

app.get('/get-recipes/:Category', (req, res) => {
    const Category = req.params.Category;
    console.log(`Fetching recipes in category: ${Category}`);

    getRecipesByCategory(Category, (err, re) => {  // re is the result of the query
        if (err) {
            console.error('Error fetching recipes:', err);
            return res.status(500).send("Error fetching recipes");
        }
        if (re.length === 0) {  // Use re instead of results
            return res.status(404).send('No recipes found in this category');
        }
        console.log('Recipes fetched:', re);  // Use re instead of results
        res.json(re);  // Send the results as JSON
    });
});

const getRecipesByCategory = (Category, callback) => {
    const retrieve = 'SELECT * FROM recipes WHERE Category = ?';
    con.query(retrieve, [Category], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        if (results.length === 0) {
            return callback(null, null); // No recipes found in the category
        }
        callback(null, results); // Return all recipes in the specified category
    });
};

app.get('/get-user-recipes', (req, res) => {
    const userID = req.query.userID;

    if (!userID) {
        return res.status(400).send('UserID is required.');
    }

    const query = 'SELECT * FROM recipes WHERE UserID = ?'; // Query to fetch recipes for the user
    con.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Error fetching user recipes:', err);
            return res.status(500).send('Error fetching user recipes.');
        }
        console.log(results);
        res.json(results); // Send back the user's recipes
    });
});

app.delete('/delete-recipe/:RecipeID', (req, res) => {
    const RecipeID = req.params.RecipeID;

    if (!RecipeID) {
        return res.status(400).send('RecipeID is required.');
    }

    const deleteQuery = 'DELETE FROM recipes WHERE RecipeID = ?';

    con.query(deleteQuery, [RecipeID], (err, result) => {
        if (err) {
            console.error('Error deleting recipe:', err);
            return res.status(500).send('Error deleting recipe.');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Recipe not found.');
        }

        console.log(`Recipe with ID ${RecipeID} deleted successfully.`);
        res.status(200).send('Recipe deleted successfully.');
    });
});


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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
