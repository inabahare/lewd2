import { query } from "/Functions/database";
import path from "path";
import { unlink, exists } from "/helpers/fs";

/**
 * Remove a file both from disk and database
 * @param {*} folder 
 * @param {*} fileName 
 */
export async function removeFile(folder, fileName) {
  const fullFilePath = path.join(folder, fileName);

  const fileFoundOnDisk = await exists(fullFilePath);

  if (!fileFoundOnDisk)
    return false;

  const sql = `DELETE FROM "Uploads" WHERE filename = $1;`;
  query(sql, [fileName]);

  unlink(fullFilePath);

  return true;
}