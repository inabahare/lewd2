import { query } from "/Functions/database";

export class Transparency {
  /**
   * Logs stuff to transparency
   * @param { {fileName, fileHash, reason, origin} } args 
   */
  static async Add (args) {
    // TODO: Check these things
    const { fileName, fileHash, reason, origin } = args;

    const data = [
      fileName, fileHash, reason, origin
    ];

    const sql = 
      `INSERT INTO "Transparency" ("Date", "FileName", "FileHash", "Type", "Origin")
       VALUES (NOW(), $1, $2, $3, $4);`;

    await query(sql, data);
  }

  static async GetAll () {
    const sql = 
      `SELECT "Date", "FileName", "FileHash", "Type", "Origin"
       FROM "Transparency"`;

    return await query(sql);
  }
}