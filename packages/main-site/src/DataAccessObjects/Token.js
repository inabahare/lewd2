import { query } from "/Functions/database";
import { v1 as uuidv1 } from "uuid";
import moment from "moment";


export class Token {
  /**
   * Checks weather a token is valid or not
   * @param { number } userId 
   * @param { string } token 
   * @returns { number } validCode - 0 if the token is valid. 1 if it doesn't exist. 2 if the token can't be regenerated due to time
   */
  static async CheckTokenValid (userId, token) {
    const sql = 
      `SELECT token, "TokenGenerated" 
       FROM "Users" 
       WHERE id = $1 AND token = $2;`;

    const dbData = await query(sql, [ userId, token ]);
    
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

  static async UpdateToken (userToken) {
    const newToken = uuidv1();

    const sql = 
      `UPDATE "Users" 
       SET token = $1, "TokenGenerated" = NOW() + '1 days'::INTERVAL 
       WHERE token = $2`;

    await query(sql, [ newToken, userToken ]);
  }
}