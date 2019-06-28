import fs            from "fs";
import { promisify } from "util";
import { db }        from "../../../app/helpers/database";
import path from "path";

require("dotenv").config();

const unlink = promisify(fs.unlink);


async function deleteFileByName(fileName, folderLocation) {
    if (!fileName) {
        throw new Error("To delete file by hash and return a filename you need to set the filehash");
    }

    const client  = await db.connect();
    
    await client.query(`DELETE FROM "Uploads"
                        WHERE filename = $1`, [ fileName ]);

    await client.release();
    await unlink(path.join(folderLocation, fileName));
    
    return true;
}


export { deleteFileByName };