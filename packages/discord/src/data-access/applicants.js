import { query } from "/functions/query";

export class Applicants {
  /**
   * 
   * @param { number } discordId 
   */
  static async Add(discordId) {
    const sql = 
      `INSERT INTO "Applicants" ("DiscordId", "AppliedAt")
      VALUES ($1, NOW());`;
      
    const data = [
      discordId
    ];

    await query(sql, data);
  }

  /**
   * 
   * @param { number } discordId
   * @returns { boolean } exists 
   */
  static async Exists(discordId) {
    const sql = 
      `SELECT "DiscordId" FROM "Applicants" WHERE "DiscordId" = $1`;

    const data = [
      discordId
    ];
    
    const user = await query(sql, data);

    return user !== null;
  }
}