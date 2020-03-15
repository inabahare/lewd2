import { query } from "/Functions/database";
import { v1 as uuidv1 } from "uuid";
import bcrypt from "bcrypt";

export class User {
  /**
   * Returns true if a user is found with the same username
   * @param {string} username 
   * @returns {boolean} existence
   */
  static async CheckIfUserExists (username) {
    if (!username) {
      throw Error ("Username needs to be set");
    }

    const user = await query(`SELECT username FROM "Users" WHERE username = $1;`, [ username ]);

    if (!user) {
      return false;
    }

    return user.length === 1;
  }
  
  /**
   * Creates a user with the supplied arguments
   * @param {{ username, password, uploadSize, isAdmin}} args 
   */
  static async Create (args) {
    const { username, password, uploadSize, isAdmin} = args;

    if (!username || !password || !uploadSize) {
      throw Error("The user's username, password, and upload size cannot be blank");
    }

    const passwordHashed = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const token = uuidv1();

    const data = [
      username,
      passwordHashed,
      token,
      uploadSize,
      isAdmin // TODO: Should probably check for this
    ];

    await query(`INSERT INTO "Users" (username, password, token, uploadsize, isadmin)
                 VALUES ($1, $2, $3, $4, $5);`, data);
  }
}