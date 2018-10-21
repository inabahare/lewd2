import fs            from "fs";
import { promisify } from "util";
import symlink       from "../Upload/symlink";
import db            from "../../helpers/database";
import debugge       from "debug";

require('dotenv').config();

const unlink = promisify(fs.unlink);
const move   = promisify(fs.rename);

const handleSymlink = async (client, fileName, fileSha) => {
    const getFiles = await client.query(`SELECT filename 
                                         FROM "Uploads" 
                                         WHERE filesha = $1;`, [fileSha]);
    const files    = getFiles.rows;
    
    // The original has been marked for deletion by AV
    if (files.length === 0) {
        await unlink(process.env.UPLOAD_DESTINATION + fileName);
        return;
    }

    // Move the "deleted" file to the first duplicate and set it as not duplicate in db
    await unlink(process.env.UPLOAD_DESTINATION + files[0].filename);
    await move(process.env.UPLOAD_DESTINATION   + fileName, 
               process.env.UPLOAD_DESTINATION   + files[0].filename);

    await client.query(`UPDATE "Uploads" 
                        SET duplicate = FALSE 
                        WHERE filename = $1;`, [files[0].filename]);
    
    // Now change all links to the "new" original file
    for (let i = 1; i < files.length; i++) {
        const file = files[i];
        await unlink(process.env.UPLOAD_DESTINATION  + file.filename);
        await symlink(process.env.UPLOAD_DESTINATION + files[0].filename,
                      process.env.UPLOAD_DESTINATION + file.filename);
        
    }
}

/**
 * 
 * @param {Array} fileNames - List of filenames to delete 
 * @returns {boolean} gotRemoved - Due to a race condition between the AV scanners this is needed
 */
const deleteFiles = async (fileNames, location = "null") => {
    const debug = debugge(location);
    const client = await db.connect();

    for (let fileName of fileNames) {
        debug(fileName);
        const fullFileName = process.env.UPLOAD_DESTINATION + fileName;
    
        const getFile = await client.query(`DELETE FROM "Uploads" 
                                            WHERE filename = $1 
                                            RETURNING filesha, duplicate;`, [fileName]);
        
        // If the file has already been deleted
        if (getFile.rows.length === 0) {
            await client.release();
            return false;
        }
        

        const file    = getFile.rows[0];
                                    
        ////////////////////
        // HANDLE SYMLINK //
        ///////////////////
        if (fs.existsSync(fullFileName) && fileName !== "robots.txt") {
            if (file.duplicate) {
                // If this is the original file
                await handleSymlink(client, fileName, file.filesha);
            } else {
                // Just remove it
                await unlink(fullFileName);
            }
        } 
    }

    return true;
};

export default deleteFiles;