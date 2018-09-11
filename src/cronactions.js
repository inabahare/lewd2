import { schedule }             from 'node-cron';
import dnode                    from "dnode";
import async                    from "async"; 
import scanAndRemoveFile        from "./Functions/Upload/scanAndRemoveFile";
import getFilesToDelete         from "./Functions/FileDeletion/getFilesToDelete";
import deleteFiles              from "./Functions/FileDeletion/deleteFiles";
import getFilesForSecondaryScan from "./Functions/SecondaryScan/GetFilesForSecondaryScan";
import getFileReport            from "./Functions/VirusTotal/getFileReport";
import sleep                    from "./Functions/sleep";

import dotenv from "dotenv";
import markAsScannedTwice from './Functions/SecondaryScan/markAsScannedTwice';
dotenv.config();

/**
 * Limits the AV scans
 */
const sophosQueue = async.queue(async (task) => {
    // Gets the filename if scan is positive fpr secondarlsy scan
    const filename = await scanAndRemoveFile(task.fileName);
}, 1);

/**
 * Virutotal scans
 */
let amountOfScans = 0;
const virustotalQueue = async.queue(async task => {
    amountOfScans++;


    console.log(task.fileHash + amountOfScans);

    if (amountOfScans == parseInt(process.env.VIRUSTOTAL_MAX_SCANS_PR_MINUTE)) {
        console.log("Waiting");
        await sleep(parseInt(60000));
        amountOfScans = 0;
    }
}, 1);

/**
 * Functions the app can call
 */
const messageServer = dnode({
    scan: fileName => {
        console.log(1);
        sophosQueue.push({
            fileName: fileName,
        });
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