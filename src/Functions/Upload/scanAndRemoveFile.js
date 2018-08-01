import { promisify } from 'util';
import fs            from "fs";
import { spawn }     from "child_process";
import db            from "../../helpers/database";
const unlink   = promisify(fs.unlink);

/**
 * 
 * @param {string} fullPath The full path of the file to scan 
 * @param {string} fileSha The sha1 hash of the file to scan
 */
const scanAndRemoveFile = async (fullPath, fileSha) => {
    const scanner = spawn("/opt/sophos-av/bin/savscan", ["-nc", 
                                                         "-nb", 
                                                         "-ss", 
                                                         "-remove", 
                                                         "-archive", 
                                                         "-suspicious", 
                                                         fullPath]);

    scanner.stderr.on("data", data => {
        console.log("error", data);
    });

    scanner.on("close", async code => {
        if (code === 0) {
            // The file is clean
            // Do nothing I guess
        } else if (code === 3 || code === 2) {
            // The file contains a virus and/or is password protected
            const client = await db.connect();
            // Select file file to be removed
            // Log the file to the database with the reason
            // Remove the file


            await client.query(`DELETE FROM "Uploads" WHERE filesha = $1`, [fileSha]);
            await client.release();
        }
    });
};

export default scanAndRemoveFile;