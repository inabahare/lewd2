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
}