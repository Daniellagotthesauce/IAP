const db = require('./connection');

// Function to add a new recipe to the database
const addRecipe = (recipeData, callback) => {
    const { Title, Description, Ingredients, Steps, UserID, Category } = recipeData;

    const newRecipeQuery = `
        INSERT INTO Recipes (Title, Description, Ingredients, Steps, UserID, Category) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [Title, Description, Ingredients, Steps, UserID, Category];

    db.query(newRecipeQuery, values, (err, result) => {
        if (err) {
            console.error('Error inserting recipe:', err);
            return callback(err, null);
        }
        console.log("Recipe added successfully. Recipe ID:", result.insertId);
        callback(null, result.insertId);
    });
};

const getRecipes = (callback) => {
    const retrieveRecipeQuery = `SELECT * FROM Recipes`; // Query to fetch all recipes

    db.query(retrieveRecipeQuery, (err, results) => {
        if (err) {
            console.error('Error fetching recipes:', err);
            return callback(err, null);
        }
        console.log("All recipes retrieved:", results);
        callback(null, results);
    });
};



// Export the functions for use in other parts of the application
module.exports = { addRecipe, getRecipes };
