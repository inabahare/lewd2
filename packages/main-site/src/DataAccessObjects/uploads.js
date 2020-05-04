import { query } from "/Functions/database";
import { stringSetAndNotEmpty } from "/helpers/string-set-and-not-empty";
import { promisify } from "util";
import { unlink as fsUnlink } from "fs";
import { join } from "path";
import { v1 as uuid } from "uuid";


const unlink = promisify(fsUnlink);
const { UPLOAD_DESTINATION } = process.env;

export class Uploads {
  /**
   * 
   * @param {file} file - Multer file object
   * @param {number} userId - Users ID 
   */
  static async AddFile(file, userId) {
    const deletionKey = uuid();

    const data = [
      file.filename,
      file.originalname,
      file.hash,
      userid,
      file.duplicate.toString(),
      deletionKey,
      file.size
    ];

    const sql =
      `INSERT INTO "Uploads" (filename, originalName, filesha, userid, duplicate, uploaddate, deletionkey, size) 
       VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7);`;

    await query(sql, data);
  }

  /**
   * Uses the deletion key to fetch details about the file
   * @param {string} deletionKey
   * @returns { { id, filename, filesha, duplicate } } uploadData 
   */
  static async GetFromDeletionKey(deletionKey) {
    if (!stringSetAndNotEmpty(deletionKey)) {
      throw Error("Deletionkey needs to be provided to get files");
    }

    const sql =
      `SELECT id, filename, filesha, duplicate 
       FROM "Uploads"
       WHERE deletionkey = $1;`;

    const getFileData = await query(sql, [deletionKey]);

    return getFileData[0];
  }

  /**!
   * Takes a filename and deletes that file from the database and disk.
   * Does not remove duplicates
   * @param { string } fileName 
   */
  static async DeleteFile(fileName) {
    if (!stringSetAndNotEmpty(fileName)) {
      throw Error("Filename needs to be provided to delete file");
    }

    const fullPath = join(UPLOAD_DESTINATION, fileName);

    const sql =
      `DELETE FROM "Uploads" 
       WHERE filename = $1 
       RETURNING filesha, duplicate;`;

    const resultData = query(sql, [fileName]);
    await unlink(fullPath);

    return await resultData;
  }

  /**
   * Takes a list of filenames and removes them
   * @param { array } files 
   */
  static async DeleteFiles(fileNames) {
    if (!Array.isArray(fileNames)) {
      throw Error("You need to provide an array of filenames");
    }

    for (const fileName of fileNames) {
      await this.DeleteFile(fileName);
    }
  }

  static GetFullPath(fileName) {
    return join(UPLOAD_DESTINATION, fileName);
  }

  static async GetAllByUserId(userId) {
    const sql =
      `SELECT filename, size, originalname, uploaddate, duplicate, virus, passworded, deletionkey  
      FROM "Uploads" 
      WHERE userid = $1
      ORDER BY id DESC;`;

    return await query(sql, [userId]);
  }

  static async GetAllGroupedByUser() {
    const sql =
      `SELECT filename, size, originalname, uploaddate, duplicate, virus, passworded, deletionkey, "Users".username  
      FROM "Uploads", "Users"
      WHERE "Uploads".userid = "Users".id
      ORDER BY uploaddate DESC`;

    return await query(sql);
  }
}