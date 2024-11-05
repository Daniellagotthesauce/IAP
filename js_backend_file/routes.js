/*const con = require('./connection');
const fs=require('fs');

function recipesRoot(req,res){
    if(req.url === "/html/displayRecipe"){
        fs.readFile('./html/displayRecipe.html', (err, data) => { // Serve HTML file
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("404 Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
            }
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write("Page not found");
        res.end();

    }
}

module.exports.recipesRoot=recipesRoot;
*/