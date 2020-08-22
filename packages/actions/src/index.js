import path from "path";

require("dotenv").config({
  path: path.join(__dirname, "../../../.env")
});

import { fileDeletion } from "./Controllers/Cron/fileDeletion";
import { ScannerService } from "./Services/ScannerService";
import { Express } from "express";
import BodyParse from "body-parse";

const scanners = new ScannerService();
scanners.Start();

const {
  WHEN_TO_CHECK_FOR_FILES_TO_DELETE,
  MESSAGE_SERVER_PORT
} = process.env;

const app = new Express();

app.use(BodyParse.urlencoded({ extended: true }));
app.use(BodyParse.json());

app.post("/scan", (req, res) => {
  const {
    fileName, fileHash
  } = req.body;

  scanners.Scan(fileName, fileHash)
})

app.listen(parseInt(MESSAGE_SERVER_PORT), () => console.log(`Message server listening on ${MESSAGE_SERVER_PORT}`))


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