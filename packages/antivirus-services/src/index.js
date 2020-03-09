import dotenv from "dotenv";
dotenv.config();

import { schedule } from "node-cron";
import dnode        from "dnode";

import { fileDeletion }   from "./Controllers/Cron/fileDeletion";
import { ScannerService } from "./Services/ScannerService";

const scanners = new ScannerService();
scanners.Start();

/**
 * Functions the app can call
 */
const messageServer = dnode({
    scan: (fileName, fileHash) => {
        scanners.Scan(fileName, fileHash);
    }
});


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