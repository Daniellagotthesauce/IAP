const con = require('./connection');


const newUser= (userData, callback)=>{
const {UserID, FullName, UserName, Password, Email, Contact, UserTypeID}= userData;



const regUser= 'INSERT INTO users (UserID, FullName, UserName, Password, Email, Contact, UserTypeID) VALUES (?,?,?,?,?,?,?)';
const values =[UserID, FullName, UserName, Password, Email, Contact, UserTypeID];

con.query(regUser,values, (err, result)=>{
    if(err){
        console.error("Error inserting data: ", err);
            return callback(err, null);
    }
    console.log("User registered:", result.insertId);
        return callback(null, result.insertId);
    });
};

module.exports = {newUser};