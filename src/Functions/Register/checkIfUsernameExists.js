import db       from "../../helpers/database";

/**
 * Custom express validator to check if a username exists
 * @param {string} value The username to check 
 */
const checkIfUsernameExists = value => {
    return db.query(`SELECT username FROM "Users" WHERE username = $1;`, [value])
             .then(result => {
                 if (result.rows.length === 0)
                    return Promise.resolve();
                 
                 return Promise.reject("");
             });
};

export default checkIfUsernameExists;