import { query } from "/functions/query";

export class User {
  static async FindByDiscordId(discordId) {
    const sql = `SELECT id, username  FROM "Users" WHERE "discordId" = $1`;
    const data = [ discordId ];

    return query(sql, data);
  }

  static async AddDiscordIdByUploadToken(discordId, uploadToken) {
    const sql = 
      `UPDATE "Users" SET "discordId" = $1 
       WHERE token = $2`;

    const data = [
      discordId, uploadToken
    ];

    return query(sql, data);
  }
}