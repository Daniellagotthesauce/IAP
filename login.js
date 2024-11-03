const con = require('./connection');

const loginUser = (userData, callback) => {
    const { Email, Password } = userData;

    // Query to find the user by email
    const query = 'SELECT * FROM users WHERE Email = ?';
    const values = [Email];

    con.query(query, values, (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            return callback(err, null);
        }

        // Check if user was found
        if (results.length > 0) {
            const user = results[0]; // Get the first user found

            // Check if the password matches
            if (user.Password === Password) {
                console.log("Login successful for user:", Email);
                return callback(null, user); // User authenticated
            } else {
                console.log("Incorrect password for user:", Email);
                return callback(null, null); // Incorrect password
            }
        } else {
            console.log("No user found with email:", Email);
            return callback(null, null); // No user found
        }
    });
};

module.exports = { loginUser };
