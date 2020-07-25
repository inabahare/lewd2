import { query } from "/functions/query";
import { createHash } from "crypto";

export class RegisterToken {
  static CreateToken () {
    return createHash("sha1")
            .update("You can register now" + Date.now().toString())
            .digest("hex");
  }
  
  static async Add (args) {
    const { uploadSize, isAdmin, discordId} = args;
    const registerToken = this.CreateToken();

    const data = [
      registerToken, 
      uploadSize, 
      isAdmin,
      discordId
    ];

    const sql =
      `INSERT INTO "RegisterTokens" (token, registered, uploadsize, isadmin, "discordId")
      VALUES ($1, NOW(), $2, $3, $4);`;

    await query(sql, data);
    
    return registerToken;
  }
}