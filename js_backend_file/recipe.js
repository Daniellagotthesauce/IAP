const db = require('./connection'); 


const addRecipe = (recipeData, callback) => {
const { Title, Description, Ingredients, Steps, UserID } = recipeData;

    const newRecipe = `
        INSERT INTO Recipes (Title, Description, Ingredients, Steps, UserID) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [Title, Description, Ingredients, Steps, UserID];

    db.query(newRecipe, values, (err, result) => {
        if (err) {
            console.error('Error inserting recipe:', err);
            return callback(err, null);
        }
        console.log("Recipe added:", result.insertId);
        callback(null, result.insertId);
    });
};

const getRecipes = (callback)=>{
    const retrieveRecipe =`SELECT * FROM Recipes`;

    db.query(retrieveRecipe, (err, results) => {
        if(err){
            console.log('Error fetching recipes:',err);
            return callback(err, null);
        }
        console.log(results);
        callback(null,results);
    });
};

module.exports = { addRecipe, getRecipes };