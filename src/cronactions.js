import { schedule }             from 'node-cron';
import dnode                    from "dnode";
import async                    from "async"; 
import scanAndRemoveFile        from "./Functions/Upload/scanAndRemoveFile";
import getFilesToDelete         from "./Functions/FileDeletion/getFilesToDelete";
import deleteFiles              from "./Functions/FileDeletion/deleteFiles";
import getFilesForSecondaryScan from "./Functions/SecondaryScan/GetFilesForSecondaryScan";
import VirusTotal               from "node-virustotal";

import dotenv from "dotenv";
import markAsScannedTwice from './Functions/SecondaryScan/markAsScannedTwice';
dotenv.config();

const virusTotal = VirusTotal.MakePublicConnection();
virusTotal.setKey(process.env.VIRUSTOTAL_KEY);

virusTotal.rescanFile("2546dcffc5ad854d4ddc64fbf056871cd5a00f2471cb7a5bfd4ac23b6e9eedad", data => {
    virusTotal.getFileReport(data["scan_id"], scanData => {
        const positives = scanData["positives"];
    }, error => {
        console.log(error);
    });
}, error => {
    console.log("Error");
    console.log(error);
});

/**
 * Limits the AV scans
 */
const queue = async.queue(async (task) => {
    // Gets the filename if scan is positive fpr secondary scan
    const filename = await scanAndRemoveFile(task.fileName);
}, 1);

/**
 * Functions the app can call
 */
const messageServer = dnode({
    scan: fileName => {
        queue.push({
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
        queue.push({
            fileName: fileName
        });
    })
});
 
messageServer.listen(parseInt(process.env.MESSAGE_SERVER_PORT));