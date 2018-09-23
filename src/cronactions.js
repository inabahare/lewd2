import { schedule }             from 'node-cron';
import dnode                    from "dnode";
import async                    from "async"; 
import scanAndRemoveFile        from "./Functions/Upload/scanAndRemoveFile";
import getFilesToDelete         from "./Functions/FileDeletion/getFilesToDelete";
import deleteFiles              from "./Functions/FileDeletion/deleteFiles";
import getFilesForSecondaryScan from "./Functions/SecondaryScan/GetFilesForSecondaryScan";
import getFileReport            from "./Functions/VirusTotal/getFileReport";
import sleep                    from "./Functions/sleep";
import VirusTotalScanner        from "./Classes/VirusTotalScanner";

import dotenv from "dotenv";
import markAsScannedTwice from './Functions/SecondaryScan/markAsScannedTwice';
dotenv.config();

const virusTotal = new VirusTotalScanner(process.env.VIRUSTOTAL_KEY,
                                         process.env.VIRUSTOTAL_MAX_SCAN_WAIT_MS,
                                         process.env.VIRUSTOTAL_MAX_SCANS_PR_MINUTE,
                                         process.env.VIRUSTOTAL_MIN_ALLOWED_POSITIVES,
                                         process.env.UPLOAD_DESTINATION)

/**
 * Limits the AV scans
 */
const sophosQueue = async.queue(async (task) => {
     await scanAndRemoveFile(task.fileName);
}, 1);

/**
 * Functions the app can call
 */
const messageServer = dnode({
    sophosScan: fileName => {
        sophosQueue.push({
            fileName: fileName,
        });
    },
    virusTotalScan: (fileHash, fileName, scanNumber) => {
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

    if (files.length === 0)
        return;

    const uniqueFilenames = [...new Set(files.map(file => file.filename))];

    await markAsScannedTwice(files);


    uniqueFilenames.forEach(fileName => {
        sophosQueue.push({
            fileName: fileName
        });
    })
});
 
messageServer.listen(parseInt(process.env.MESSAGE_SERVER_PORT));