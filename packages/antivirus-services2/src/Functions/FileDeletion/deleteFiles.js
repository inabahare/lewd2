import fs            from "fs";
import { promisify } from "util";
import { query } from "../database";
import path from "path";

require("dotenv").config();

const unlink = promisify(fs.unlink);


async function deleteFileByName(fileName, folderLocation) {
    if (!fileName) {
        throw new Error("To delete file by hash and return a filename you need to set the filehash");
    }

    await query(`DELETE FROM "Uploads"
                  WHERE filename = $1`, [ fileName ]);

    await unlink(path.join(folderLocation, fileName));
    
    return true;
}


export { deleteFileByName };