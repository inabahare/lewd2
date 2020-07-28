import { query } from "/functions/query";

export class User {
  static async FindByDiscordId(discordId) {
    const sql = `SELECT id, username  FROM "Users" WHERE "discordId" = $1`;
    const data = [ discordId ];

    return query(sql, data);
  }
}