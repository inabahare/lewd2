import { promisify } from 'util';
import fs            from "fs";
import { spawn }     from "child_process";
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
        } else if (code === 3) {
            // The file got removed
            console.log("Virus");
            const client = await db.connect();
            await client.query(`UPDATE "Uploads" SET deleted = TRUE WHERE filesha = $1`, [fileSha]);
            await client.release();

        } else if (code === 2) {
            // Password protected file and probably some other things
            const client = await db.connect();
            await client.query(`UPDATE "Uploads" SET deleted = TRUE WHERE filesha = $1`, [fileSha]);
            await client.release();
        }
    });
};

export default scanAndRemoveFile;