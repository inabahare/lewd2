import fs            from "fs";
import { promisify } from "util";
import symlink       from "../Upload/symlink";
import db from "../../helpers/database";
require('dotenv').config();

const unlink = promisify(fs.unlink);
const move   = promisify(fs.rename);

const handleSymlink = async (client, fileName, fileSha) => {
    const getFiles = await client.query(`SELECT filename from "Uploads" WHERE filesha = $1;`, [fileSha]);
    const files = getFiles.rows;
    
    // Move the "deleted" file to the first duplicate and set it as not duplicate in db
    await unlink(process.env.UPLOAD_DESTINATION + files[0].filename);
    await move(process.env.UPLOAD_DESTINATION + fileName, 
               process.env.UPLOAD_DESTINATION + files[0].filename);
    await client.query(`UPDATE "Uploads" SET duplicate = FALSE WHERE filename = $1;`, [files[0].filename]);
    
    // Now change all links to the "new" original file
    for (let i = 1; i < files.length; i++) {
        const file = files[i];
        await unlink(process.env.UPLOAD_DESTINATION + file.filename);
        await symlink(process.env.UPLOAD_DESTINATION + files[0].filename,
                      process.env.UPLOAD_DESTINATION + file.filename);
        
    }
}

export default async fileNames => {
    const client = await db.connect();
    
    fileNames.forEach(async fileName => {
        const fullFileName = process.env.UPLOAD_DESTINATION + fileName;
    
        const getFile = await client.query(`DELETE FROM "Uploads" WHERE filename = $1 RETURNING filesha, duplicate;`, [fileName]);
        const file   = getFile.rows[0];
                                    
        ////////////////////
        // HANDLE SYMLINK //
        ///////////////////
        if (fs.existsSync(fullFileName) && fileName !== "robots.txt") {
            if (!file.duplicate) {
                // If this is the original file
                await handleSymlink(client, fileName, file.filesha);
            } else {
                // Just remove it
                await unlink(fullFileName);
            }
        } 
    });

    await client.release();
};