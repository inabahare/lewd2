import { schedule }         from 'node-cron';
import dnode from "dnode";
import async from "async"; 
import fs    from "fs";
import scanAndRemoveFile    from "./Functions/Upload/scanAndRemoveFile";
import getFilesToDelete     from "./Functions/FileDeletion/getFilesToDelete";
import deleteFiles          from "./Functions/FileDeletion/deleteFiles";
import updateDatabase       from "./Functions/FileDeletion/updateDeletedFiles";

import dotenv from "dotenv";
dotenv.config();

/**
 * Limits the AV scans
 */
const queue = async.queue(async task => {
    await scanAndRemoveFile(task.fileName);
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

// process.env.FILE_DELETION_CRON

schedule(process.env.FILE_DELETION_CRON, async () => {
    const files = await getFilesToDelete();
    console.log("Removing files");
    if (files.length == 0)
        return;

    console.log(`Removing ${files.length} files!`);

    const unique = [...new Set(files.map(file => file.filename))];

    deleteFiles(unique);
});



messageServer.listen(parseInt(process.env.MESSAGE_SERVER_PORT));