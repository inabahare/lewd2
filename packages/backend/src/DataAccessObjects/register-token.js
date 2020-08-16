import { query } from "/Functions/database";
import { createHash } from "crypto";

export class RegisterToken {
  static CreateToken () {
    return createHash("sha1")
      .update("You can register now" + Date.now().toString())
      .digest("hex");
  }
  
  static async Add (args) {
    const { uploadSize, isAdmin } = args;
    const registerToken = this.CreateToken ();
    const data = [
      registerToken, 
      // false, 
      uploadSize, 
      isAdmin
    ];

    const sql =
      `INSERT INTO "RegisterTokens" (token, registered, uploadsize, isadmin)
      VALUES ($1, NOW(), $2, $3);`;

    await query(sql, data);
    
    return registerToken;
  } 

  /**
   * 
   * @param {string} token 
   * @returns { registered, used, roleid, uploadsize, isadmin } TokenData
   */
  static async GetTokenData (token) {
    const sql = 
      `SELECT registered, used, roleid, uploadsize, isadmin
       FROM "RegisterTokens"
       WHERE token = $1;`;
    
    const getClient = await query(sql, [token]);

    return getClient ? getClient[0] : null;
  }

  static async Remove (token) {
    await query(`DELETE FROM "RegisterTokens" WHERE token = $1;`, [token]);
  }
}