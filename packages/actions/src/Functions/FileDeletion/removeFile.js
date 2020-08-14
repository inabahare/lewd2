import { query } from "/Functions/database";
import path from "path";
import { unlink, access } from "/helpers/fs";

// TODO: Change to removeFile`
export async function removeFile(folderLocation, fileName) {
  const fullFilePath = path.join(folderLocation, fileName);

  const exists = await access(fullFilePath);

  if (!exists)
    return false;

  const db = query(`DELETE FROM "Uploads"
                    WHERE filename = $1`, [fileName]);

  const file = unlink(fullFilePath);

  await Promise.all([db, file]);

  return true;
}