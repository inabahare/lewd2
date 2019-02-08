import fs            from "fs";
import { promisify } from "util";
import { db }        from "../../../app/helpers/database";
import path from "path";

require("dotenv").config();

const unlink = promisify(fs.unlink);


async function deleteFilesByFileHash(fileHash, folderLocation) {
    if (!fileHash) {
        throw new Error("To delete file by hash and return a filename you need to set the filehash");
    }

    let filenames = null;
    const client  = await db.connect();
    
    try {
        filenames = await client.query(`DELETE FROM "Uploads"
                                       WHERE filesha = $1
                                       RETURNING filename`, [ fileHash ]);
    }
    catch(ex) {
        console.error("deleteFilesByFileHash", fileHash, ex.message);
    }
    finally {
        await client.release();
    }

    if (filenames.rows.length === 0) {
        return false;
    }

    // Since the output from the query will be an array containing objects where the field will be filename. 
    // IE loads of {filename: whatever} I'll just turn them into an array of filenames instead!
    const files = filenames.rows.map(f => f.filename);

    for(const filename of files) {
        await unlink(path.join(folderLocation, filename));
    }

    return true;
}


export { deleteFilesByFileHash };