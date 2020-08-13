import fs            from "fs";
import { promisify } from "util";
import { query } from "/Functions/database";
import path from "path";

require("dotenv").config();

const unlink = promisify(fs.unlink);

// TODO: Change to removeFile`
async function deleteFileByName(fileName, folderLocation) {
  await query(`DELETE FROM "Uploads"
                  WHERE filename = $1`, [ fileName ]);

  await unlink(path.join(folderLocation, fileName));
    
  return true;
}


export { deleteFileByName };