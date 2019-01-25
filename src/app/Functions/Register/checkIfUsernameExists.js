import { db } from "../../helpers/database";

/**
 * Custom express validator to check if a username exists
 * @param {string} value The username to check 
 */
const checkIfUsernameNotExists = value => {
    return db.connect()
    .then(client => {
       return client.query(`SELECT username FROM "Users" WHERE username = $1;`, [value])
      .then(result => {
         client.release();
         // User not found
         if (result.rows.length === 0)
            return Promise.resolve();
         
         // User found
         return Promise.reject(" ");
      });
    });
};

/**
 * Custom express validator to check if a username exists because express-validator is a bitch and broke when not().custom() was <keyboard mashing>
 * @param {string} value The username to check 
 */
const checkIfUsernameExists = value => {
   return db.connect()
   .then(client => {
      return client.query(`SELECT username FROM "Users" WHERE username = $1;`, [value])
      .then(result => {
         client.release();
         if (result.rows.length === 0)
            return Promise.reject("aaaaaaa");
         
         return Promise.resolve();
      });
   });
};

export { checkIfUsernameNotExists as checkIfUsernameNotExists };
export { checkIfUsernameExists as checkIfUsernameExists };