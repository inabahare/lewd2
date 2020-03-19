import { query } from "/Functions/database";
import { stringSetAndNotEmpty } from "/helpers/string-set-and-not-empty";
import { promisify } from "util";
import { unlink as fsUnlink } from "fs";
import { join } from "path";

const unlink = promisify(fsUnlink);
const { UPLOAD_DESTINATION } = process.env;

export class Uploads {
  /**
   * Uses the deletion key to fetch details about the file
   * @param {string} deletionKey
   * @returns { { id, filename, filesha, duplicate } } uploadData 
   */
  static async GetFromDeletionKey (deletionKey) {
    if (!stringSetAndNotEmpty(deletionKey)) {
      throw Error ("Deletionkey needs to be provided to get files");
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
   static async DeleteFile (fileName) {
     if (!stringSetAndNotEmpty(fileName)) {
       throw Error ("Filename needs to be provided to delete file");
     }

     const fullPath = join(UPLOAD_DESTINATION, fileName);

     const sql = 
      `DELETE FROM "Uploads" 
       WHERE filename = $1 
       RETURNING filesha, duplicate;`;

     await query(sql, [fileName]);
     await unlink(fullPath); // TODO: This might be a good idea to have as its own file
   }
   static async DeleteFiles (files) {
     if (!Array.isArray(files)) {
       throw Error ("You need to provide an array of filenames");
     }

     for (const file of files) {
      await this.DeleteFile(file);
     }
   }
}