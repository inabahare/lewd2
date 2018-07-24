import db       from "../../helpers/database";

/**
 * Custom express validator to check if a username exists
 * @param {string} value The username to check 
 */
const checkIfUsernameExists = value => {
    return db.query(`SELECT username FROM "Users" WHERE username = $1;`, [value])
             .then(res => {
                 if (req.body[0])
                    return Promise.resolve();

                return Promise.reject("Username already in use");
             })
             .catch(e => {
                if (typeof e === "string")
                    return Promise.reject();

                return Promise.resolve();
            });
};

export default checkIfUsernameExists;