import fs            from "fs";
import { promisify } from "util"
import { spawn }     from "child_process";
import db            from "../../helpers/database";
import logToTransparency from "../Transparency/logToTransparency";

const unlink = promisify(fs.unlink);

/**
 * 
 * @param {string} filename The name of the file to scan
 * @param {string} fileSha The sha hash of the file to scan
 */
const scanAndRemoveFile = (filename, fileSha) => {
    return new Promise((resolve, reject) => {
        const filePath = process.env.UPLOAD_DESTINATION + filename;
        const scanner = spawn("/opt/sophos-av/bin/savscan", ["-nc", 
                                                            "-nb", 
                                                            "-ss",
                                                            "-archive", 
                                                            "-suspicious", 
                                                            filePath]);


        scanner.stderr.on("data", data => {
            // console.log("error", data);
            reject();
        });

        let info = "";

        scanner.stdout.on("data", async (data) => {
            info += data;
        });

        scanner.on("close", async (code) => {
            // Not having this here will cause savscan to report an error. 
            // This is in case VirusTotal removes the file first
            if (!fs.existsSync(filePath))
                return resolve();
            
            if (code === 0) {
                // The file is clean
                resolve(filename);
            } else if (code === 3 || code === 2) {
                // The file contains a virus and/or is password protected
                const client = await db.connect();                
                await client.query(`DELETE FROM "Uploads" WHERE filename = $1`, [filename]);
                await client.release();

                await unlink(filePath);
                
                // By now info will be
                //     1. Useful life of Scan has been exceeded
                //     2. >>> Virus 'EICAR-AV-Test' found in file /home/inaba/Programming/Lewd/build/Public/Uploads/ec3d3e115547_NOT_A_VIRUS.exe 
                //     3. Removal successful
                // So only take the second line and remove the >>>
                const reason = info.split("\n")[1]
                                   .split(">>> ")[1];

                                   
                await logToTransparency(filename, fileSha, reason, "Sophos")

                resolve(null);
            } else {
                console.log("??");
            }

        });
    });
};

export default scanAndRemoveFile;