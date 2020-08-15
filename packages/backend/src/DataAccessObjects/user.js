import { query } from "/Functions/database";
import { v1 as uuidv1 } from "uuid";
import bcrypt from "bcrypt";
import { Uploads } from "./uploads";
import { stringSetAndNotEmpty } from "/helpers/string-set-and-not-empty";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);

export class User {
  static async GetPaswordAndId(username) {
    const sql =
      `SELECT id, password 
       FROM "Users" 
       WHERE username = $1;`;

    const user = await query(sql, [username]);
    return user;
  }

  static async GetUser(id) {
    const sql =
      `SELECT "Users".id, "Users".username, "Users".token, "Users".roleid, "Users".uploadsize, "Users".isadmin, "Users"."TokenGenerated"
       FROM "Users"
       WHERE "Users".id = $1`;

    const user = await query(sql, [id]);

    return user ? user[0] : null;
  }

  /**
   * Returns true if a user is found with the same username
   * @param {string} username 
   * @returns {boolean} existence
   */
  static async CheckIfUserExists(username) {
    if (!stringSetAndNotEmpty(username)) {
      throw Error("Username needs to be set");
    }

    const user = await query(`SELECT username FROM "Users" WHERE username = $1;`, [username]);

    if (!user) {
      return false;
    }

    return user.length === 1;
  }

  /**
   * Creates a user with the supplied arguments
   * @param {{ username, password, uploadSize, isAdmin}} args 
   */
  static async Create(args) {
    const { username, password, uploadSize, isAdmin } = args;

    if (!username || !password || !uploadSize) {
      throw Error("The user's username, password, and upload size cannot be blank");
    }

    const passwordHashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
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

  /**
   * @returns { Object } - All users
   */
  static async GetAllUsers() {
    const sql = `
      SELECT "Users".id, username, uploadsize, isadmin, COUNT("Uploads".filesha) "amountOfUploads"
      FROM "Users"
      LEFT JOIN "Uploads" ON "Users".id = "Uploads".userid
      GROUP BY "Users".id, username, uploadsize, isadmin
      ORDER BY "Users".id;
    `;

    const allUsers = await query(sql);

    return allUsers;
  }

  static async DeleteUser(userId, deleteFiles = false) {
    if (!Number.isInteger(userId)) {
      throw Error("userId needs to be a number");
    }

    const data = [userId];

    if (deleteFiles) { // TODO: Extract to it's own DAO
      const getFiles = await query(`SELECT DISTINCT ON (filename) filename
                                    FROM "Uploads" 
                                    WHERE userid = $1 
                                    AND filename NOT IN (SELECT filename FROM "Uploads" WHERE userid != $1);`, data);

      if (!getFiles) {
        const files = getFiles.map(f => f.filename);
        Uploads.DeleteFiles(files);
      }
    }

    await query(`DELETE FROM "Users" WHERE id = $1;`, data);
    await query(`DELETE FROM "LoginTokens" WHERE userid = $1;`, data);
  }

  /**
   * Gets userid and username
   * @param { string } fileName - The full name of the file saved on disk
   * @returns { {userid, username} } - Simple user object
   */
  static async FindUser(fileName) { // TODO: Should probably be under Uploads
    if (!stringSetAndNotEmpty(fileName)) {
      throw Error("Can not find user with empty file name");
    }

    const sql = `SELECT userid, username 
                 FROM "Uploads", "Users" 
                 WHERE "Uploads".userid = "Users".id 
                 AND "filename" = $1 `;

    const user = await query(sql, [fileName]);

    return user;
  }

  static async CheckIfUsernameNotExists() {
    const result = await this.CheckIfUserExists(username);

    if (!result)
      return Promise.resolve();

    return Promise.reject();
  }

  /**
   * Can be used to update some details about users
   * @param { { userId, uploadSize, isAdmin }} args 
   */
  static async UpdateUserDetails(args) {
    const { userId, username, uploadSize, isAdmin } = args;

    const data = [
      userId, username, uploadSize, isAdmin
    ];

    const sql =
      `UPDATE "Users" 
       SET username = $2, uploadsize = $3, isadmin = $4
       WHERE id = $1`;

    await query(sql, data);
  }

  /**
   * Checks if the tiven password is the same as the users
   * @param { number } userId 
   * @param { string } password 
   */
  static async ComparePassword(args) {
    const { userId, password } = args;
    const sql =
      `SELECT password 
       FROM "Users" 
       WHERE id = $1;`;


    const getPassword = await query(sql, [userId]);

    // They don't need to know the user wasn't found
    if (!getPassword) {
      return false;
    }

    const currentPassword = getPassword[0].password;
    const passwordCheck = await bcrypt.compare(password, currentPassword);

    return passwordCheck;
  }

  /**
   * Gives the user a new password
   * @param { { newPassword, userId} } args 
   */
  static async ChangePassword(args) {
    const { newPassword, userId } = args;

    // TODO: Check newPassword and userId maybe

    const newPasswordHashed = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    const data = [newPasswordHashed, userId];

    await query(`UPDATE "Users" 
                 SET password = $1
                 WHERE id = $2`, data);
  }

  /**
   * For an upload is done. This could possibly be moved to the token DAO
   * @param { string } token 
   * @returns { {id, uploadSize } } - A simple user oibject
   */
  static async GetIdAndUploadSize(token) {
    if (!stringSetAndNotEmpty(token)) {
      throw Error("Token not supplied");
    }

    const sql = `SELECT id, uploadsize
                 FROM "Users"
                 WHERE token = $1;`;

    const getData = await query(sql, [token]);

    return getData ? getData[0] : getData;
  }
}