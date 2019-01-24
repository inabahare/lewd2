import dotenv from "dotenv";
dotenv.config();

import { schedule }             from "node-cron";
import dnode                    from "dnode";
import async                    from "async"; 
import scanAndRemoveFile        from "./AntivirusApi/Functions/scanAndRemoveFile";
import getFilesForSecondaryScan from "./AntivirusApi/Functions/SecondaryScan/GetFilesForSecondaryScan";
import getFilesToScan           from "./AntivirusApi/Functions/VirusTotal/getFilesToScan";
import VirusTotalScanner        from "./AntivirusApi/Classes/VirusTotalScanner";

import { fileDeletion } from "./AntivirusApi/Controllers/Cron/fileDeletion";

const virusTotal = new VirusTotalScanner(process.env.VIRUSTOTAL_KEY,
                                         process.env.VIRUSTOTAL_MAX_SCAN_WAIT_MS,
                                         process.env.VIRUSTOTAL_MAX_SCANS_PR_MINUTE,
                                         process.env.VIRUSTOTAL_MIN_ALLOWED_POSITIVES,
                                         process.env.UPLOAD_DESTINATION);


/**
 * Limits the AV scans
 */
const sophosQueue = async.queue(async (task) => {
    await scanAndRemoveFile(task.fileName, task.fileSha);
}, 1);

/**
 * Functions the app can call
 */
const messageServer = dnode({
    sophosScan: (fileName, fileSha) => {
        sophosQueue.push({
            fileName: fileName,
            fileSha: fileSha
        });
    },
    virusTotalScan: (fileHash, fileName, scanNumber) => {
        virusTotal.scan(fileHash, fileName, scanNumber);
    }
});

// What?

/**
 * Remove files that are too old
 */
schedule(process.env.FILE_DELETION_CRON, fileDeletion);

/**
 * Secondary AV scan of uploaded files
 */
schedule(process.env.SECONDARY_SCAN_CRON, async () => {
    const files = await getFilesForSecondaryScan();

    if (!files) {
        return;
    }

    if (files.length === 0) {
        return;
    }

    console.log(`Performing secondary scan on ${files.length + 1} files`);

    files.forEach(file => {
        sophosQueue.push({
            fileName: file.fileName,
            fileSha: file.filesha
        });
    });
});

schedule(process.env.VIRUSTOTAL_SECOND_AND_THIRD_SCAN_CRON, async () => {
    const files = await getFilesToScan();


    if (!files) {
        return;
    }

    if (files.length === 0) {
        return;
    }
    
    console.log(`Performing tertiary scan on ${files.length + 1} files`);


    files.forEach(file => {
        virusTotal.scan(file.filehash, file.filename, ++file.virusTotalScan);
    });    
});
 
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