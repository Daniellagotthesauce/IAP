con = require('./connection');

//Logging in user
const  loginUser=(userData, callback)=>{
    const {Email, Password} =  userData;


//Query to find the user by their email
const logUser= 'SELECT * FROM users where Email = ?';
const value =[Email];

con.query(logUser,value, (err, result)=>{
    if(err){
        console.error("Error logging in: ", err);
            return callback(err, null);
    }
    console.log("User logged in:", result.insertId);
        return callback(null, result.insertId);
    });
};

module.exports = {loginUser};
