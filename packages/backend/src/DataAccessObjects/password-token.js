import crypto from "crypto";
import { query } from "/Functions/database";

const { HOW_OLD_PASSWORD_RESET_TOKENS_CAN_BE } = process.env;

export class PasswordToken {
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

  static async GetUserInfo (token) {
    const sql = 
      `SELECT "userId", "UpdatePasswordKeys"."key", username
       FROM "UpdatePasswordKeys", "Users"
       WHERE "UpdatePasswordKeys"."key" = $1
       AND registered > NOW() - '${HOW_OLD_PASSWORD_RESET_TOKENS_CAN_BE}'::INTERVAL
       AND "userId" = id;`;

    const userInfo = await query(sql, [ token ]);
    return userInfo ? userInfo[0] : null;
  }

  static async Remove () {
    
  }
}