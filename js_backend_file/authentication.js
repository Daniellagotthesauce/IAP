/*const jwt = require('jsonwebtoken');
require('dotenv').config();
const uniqueKey = process.env.uniqueKey;


const verification= (req,res,next)=>{
    const authenticate= req.headers['authorization'];
    const token = authenticate && authenticate.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

   jwt.verify(token, uniqueKey, (err,user)=>{
        if(err){
            return res.status(403).send('Invalid token.');
        }
        req.user = user;
        next();
    });
    
};

module.exports= {verification};
*/