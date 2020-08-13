import path from "path";

require("dotenv").config({
  path: path.join(__dirname, "../../../.env")
});

import dnode from "dnode";

import { fileDeletion }   from "./Controllers/Cron/fileDeletion";
import { ScannerService } from "./Services/ScannerService";

const scanners = new ScannerService();
scanners.Start();
scanners.Scan( "", "he");

const { WHEN_TO_CHECK_FOR_FILES_TO_DELETE } = process.env;

/**
 * Functions the app can call
 */
const messageServer = dnode({
  scan: (fileName, fileHash) => {
    scanners.Scan(fileName, fileHash);
  }
});

messageServer.listen(parseInt(process.env.MESSAGE_SERVER_PORT));

/**
 * Remove files that are too old
 */
setInterval(fileDeletion, WHEN_TO_CHECK_FOR_FILES_TO_DELETE);

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


console.log("Now doing cron operations :3");