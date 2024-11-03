const db = require('./connection'); // Import your MySQL connection

// Function to add a new recipe to the database
const addRecipe = (recipeData, callback) => {
    const { Title, Description, Ingredients, Steps, UserID } = recipeData;

    const query = `
        INSERT INTO Recipes (Title, Description, Ingredients, Steps, UserID) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [Title, Description, Ingredients, Steps, UserID];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting recipe:', err);
            return callback(err, null);
        }
        console.log("Recipe added:", result.insertId);
        callback(null, result.insertId);
    });
};

module.exports = { addRecipe };