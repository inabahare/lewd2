import dotenv from "dotenv";
dotenv.config();

import { schedule }             from "node-cron";
import dnode                    from "dnode";
import VirusTotalScanner        from "./AntivirusApi/Classes/VirusTotalScanner";

import { fileDeletion } from "./AntivirusApi/Controllers/Cron/fileDeletion";

const virusTotal = new VirusTotalScanner(process.env.VIRUSTOTAL_KEY,
                                         process.env.VIRUSTOTAL_MAX_SCAN_WAIT_MS,
                                         process.env.VIRUSTOTAL_MAX_SCANS_PR_MINUTE,
                                         process.env.VIRUSTOTAL_MIN_ALLOWED_POSITIVES,
                                         process.env.UPLOAD_DESTINATION);


/**
 * Functions the app can call
 */
const messageServer = dnode({
    virusTotalScan: (fileHash, fileName, scanNumber) => {
        virusTotal.scan(fileHash, fileName, scanNumber);
    }
});

// What?

/**
 * Remove files that are too old
 */
schedule(process.env.FILE_DELETION_CRON, fileDeletion);


 
// Catch all exceptions in production mode
if (process.env.NODE_ENV === "production") {
    process.on("uncaughtException", err => {
        console.error("cronactions.js", err);
        process.exit(1);
    });

    process.on("unhandledRejection", (reason, p) => {
        console.error("cronactions.js", `Promise: ${p}`, `Reason: ${reason}`);
        process.exit(1);
    });
}

messageServer.listen(parseInt(process.env.MESSAGE_SERVER_PORT));

console.log("Now doing cron operations :3");