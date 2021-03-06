import { query } from "/Functions/database";
import { v1 as uuidv1 } from "uuid";
import moment from "moment";


export class LoginToken {
  static async Add(args) {
    const { userId, token } = args;
    const data = [
      token, userId
    ];
    const sql =
      `INSERT INTO "LoginTokens" (token, registered, userid)
       VALUES ($1, NOW(), $2);`;

    await query(sql, data);
  }

  /**
   * Checks weather a token is valid or not
   * @param { number } userId 
   * @param { string } token 
   * @returns { number } validCode - 0 if the token is valid. 1 if it doesn't exist. 2 if the token can't be regenerated due to time
   */
  static async CheckTokenValid(userId, token) {
    const sql =
      `SELECT token, "TokenGenerated" 
       FROM "Users" 
       WHERE id = $1 AND token = $2;`;

    const dbData = await query(sql, [userId, token]);

    if (dbData.length !== 1) {
      return 1;
    }

    const { TokenGenerated } = dbData[0];
    const now = moment();

    // If the time the token got generate is later than now
    const tokeCantRegenerate = moment(TokenGenerated).isAfter(now);

    if (tokeCantRegenerate) {
      return 2;
    }

    return 0;
  }

  static async GetUserId(token) {
    const sql =
      `SELECT userid FROM "LoginTokens" WHERE token = $1 LIMIT 1;`;
    const userId = await query(sql, [token]);
    return userId ? userId[0].userid : 0;
  }

  static async UpdateTokenToNew(previousToken) {
    const newToken = uuidv1();

    const sql =
      `UPDATE "Users" 
       SET token = $1, "TokenGenerated" = NOW() + '1 days'::INTERVAL 
       WHERE token = $2`;

    await query(sql, [newToken, previousToken]);
  }

  static async DeleteUserTokens(userId) {
    await query(`DELETE FROM "LoginTokens" WHERE userid = $1;`, [userId]);
  }
}