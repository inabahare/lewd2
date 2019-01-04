import { DbClient }       from "../../helpers/database";

/**
 * Custom express validator to check if a username exists
 * @param {string} value The username to check 
 */
const checkIfUsernameNotExists = value => {
    const client = DbClient();
    client.connect();
    return client.query(`SELECT username FROM "Users" WHERE username = $1;`, [value])
             .then(result => {
                client.end();
                 // User not found
                 if (result.rows.length === 0)
                    return Promise.resolve();
                 
                 // User found
                 return Promise.reject(" ");
             });
};

/**
 * Custom express validator to check if a username exists because express-validator is a bastich and broke when not().custom() was usedasdfas kjfhasfjhg
 * @param {string} value The username to check 
 */
const checkIfUsernameExists = value => {
    const client = DbClient();
    client.connect();
    return client.query(`SELECT username FROM "Users" WHERE username = $1;`, [value])
             .then(result => {
                client.end();
                 if (result.rows.length === 0)
                    return Promise.reject("aaaaaaa");
                 
                 return Promise.resolve();
             });
};

export { checkIfUsernameNotExists as checkIfUsernameNotExists };
export { checkIfUsernameExists as checkIfUsernameExists };