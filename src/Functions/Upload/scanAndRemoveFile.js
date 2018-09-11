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
const scanAndRemoveFile = filename => {
    return new Promise((resolve, reject) => {
        const scanner = spawn("/opt/sophos-av/bin/savscan", ["-nc", 
                                                            "-nb", 
                                                            "-ss", 
                                                            "-remove", 
                                                            "-archive", 
                                                            "-suspicious", 
                                                            process.env.UPLOAD_DESTINATION + filename]);

        scanner.stderr.on("data", data => {
            console.log("error", data);
            reject();
        });

        scanner.on("close", async code => {
            if (code === 0) {
                // The file is clean
                resolve(filename);
            } else if (code === 3 || code === 2) {
                // The file contains a virus and/or is password protected
                const client = await db.connect();
    
                await client.query(`DELETE FROM "Uploads" WHERE filename = $1`, [filename]);
                await client.release();

                resolve(null);
            }

        });
    });
};

export default scanAndRemoveFile;