import crypto from "crypto";
import { query } from "/Functions/database";

export class ResetPasswordToken {
  static _GenerateKey () {
    return crypto.randomBytes(20)
                      .toString("hex")
                      .slice(0, 20);
  }

  static async GenerateKey (userName) {
    const key = this._GenerateKey();
    
    const sql = 
      `INSERT INTO "UpdatePasswordKeys" ("key", "registered", "userId")
       VALUES ($1, NOW(), (SELECT id FROM "Users" WHERE username = $2));`;
    
    await query(sql, [key, userName]);
    
    return key;
  }
}