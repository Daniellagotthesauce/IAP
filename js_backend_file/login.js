const loginUser = (userData, callback) => {
    const { Email, Password } = userData;

    const generateToken = (userID, email) => {
        const accessToken = jwt.sign({ UserID: userID, Email: email }, uniqueKey);
        return accessToken;
    };

    const query = 'SELECT * FROM users WHERE Email = ?';
    const values = [Email];

    con.query(query, values, (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            return callback(err, null);
        }

        if (results.length > 0) {
            const user = results[0];

            if (user.Password === Password) {
                console.log("Login successful for user:", Email);

                const accessToken = generateToken(user.UserID, user.Email);
                return callback(null, {
                    user: {
                        UserID: user.UserID,
                        FullName: user.FullName,
                        UserTypeID: user.UserTypeID,
                    },
                    accessToken,
                });
            } else {
                console.log("Incorrect password for user:", Email);
                return callback(null, null);
            }
        } else {
            console.log("No user found with email:", Email);
            return callback(null, null);
        }
    });
};

module.exports = { loginUser };
