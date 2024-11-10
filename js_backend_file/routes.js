const con = require('./connection');
const fs=require('fs');
const path = require('path'); 

function recipesRoot(req,res){
    if(req.url === "/html/displayRecipe"){
        const filePath = path.join(__dirname, '/../html/displayRecipe.html');

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("404 Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
            }
            res.end();
        });
    } else if (req.url === "/get-recipe" && req.method === "GET") {

        con.query('SELECT * FROM recipes', (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write("Error fetching recipes from database");
                res.end();
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write("Page not found");
        res.end();

    }
}

module.exports.recipesRoot=recipesRoot;