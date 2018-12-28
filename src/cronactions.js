import { schedule }             from "node-cron";
import dnode                    from "dnode";
import async                    from "async"; 
import debugge                  from "debug";
import scanAndRemoveFile        from "./Functions/Upload/scanAndRemoveFile";
import getFilesToDelete         from "./Functions/FileDeletion/getFilesToDelete";
import deleteFiles              from "./Functions/FileDeletion/deleteFiles";
import getFilesForSecondaryScan from "./Functions/SecondaryScan/GetFilesForSecondaryScan";
import getFilesToScan            from "./Functions/VirusTotal/getFilesToScan";
import VirusTotalScanner        from "./Classes/VirusTotalScanner";

import dotenv from "dotenv";
dotenv.config();

const virusTotal = new VirusTotalScanner(process.env.VIRUSTOTAL_KEY,
                                         process.env.VIRUSTOTAL_MAX_SCAN_WAIT_MS,
                                         process.env.VIRUSTOTAL_MAX_SCANS_PR_MINUTE,
                                         process.env.VIRUSTOTAL_MIN_ALLOWED_POSITIVES,
                                         process.env.UPLOAD_DESTINATION);


/**
 * Limits the AV scans
 */
const sophosQueue = async.queue(async (task) => {
    debugge("sophos-call")(task);
    
    // This is a hack that makes it possible to develop without having Sophos installed. Don't tell anyone :v
    if (process.env.NODE_ENV === "production")
        await scanAndRemoveFile(task.fileName, task.fileSha);
}, 1);

/**
 * Functions the app can call
 */
const messageServer = dnode({
    sophosScan: (fileName, fileSha) => {
        debugge("scan")("Scanning with sophos");
        sophosQueue.push({
            fileName: fileName,
            fileSha: fileSha
        });
    },
    virusTotalScan: (fileHash, fileName, scanNumber) => {
        debugge("scan")("Scanning with virustotal");
        virusTotal.scan(fileHash, fileName, scanNumber);
    }
});



/**
 * Remove files that are too old
 */
schedule(process.env.FILE_DELETION_CRON, async () => {
    const files = await getFilesToDelete();
    
    // Prevent additional files from being scanned
    if (files.length === 0)
        return;

    // Removes duplicates
    const unique = [...new Set(files.map(file => file.filename))];

    deleteFiles(unique);
});

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

    debugge("scanner-schedule")(files);
 
    files.forEach(file => {
        sophosQueue.push({
            fileName: file.fileName,
            fileSha: file.filesha
        });
    });
});


// eslint-disable-next-line no-unused-vars
let num = 0;
schedule(process.env.VIRUSTOTAL_SECOND_AND_THIRD_SCAN_CRON, async () => {
    const files = await getFilesToScan();

    num++;

    if (!files) {
        return;
    }

    if (files.length === 0) {
        return;
    }
    
    files.forEach(file => {
        virusTotal.scan(file.filehash, file.filename, ++file.virusTotalScan);
    });    
});
 
messageServer.listen(parseInt(process.env.MESSAGE_SERVER_PORT));