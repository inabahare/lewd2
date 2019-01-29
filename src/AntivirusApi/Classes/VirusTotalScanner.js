import { VirusTotal } from "./AntiVirus/VirusTotal";
import { deleteFilesByFileHash } from "../Functions/FileDeletion/deleteFiles";
import { db } from "../../app/helpers/database";
import { logToTransparency } from "../Functions/Transparency/logToTransparency";
import cron from "node-cron";

const uploadDestination   = process.env.UPLOAD_DESTINATION;
const minAllowedPositives = parseInt(process.env.VIRUSTOTAL_MIN_ALLOWED_POSITIVES);
const apiKey              = process.env.VIRUSTOTAL_KEY;
const cronString          = process.env.VIRUSTOTAL_SECOND_AND_THIRD_SCAN_CRON;
// const maxScansPrDay       = parseInt(process.env.VIRUSTOTAL_MAX_SCANS_PR_DAY);

const virusTotal = new VirusTotal(apiKey);

class VirusTotalScanner {
//#region PUBLIC

    constructor() {
        virusTotal._onScanCallback = this._onScanDone;
        
        this.virusTotal = virusTotal;
        this._scans = 0;
        
        this.cron = cron.schedule(cronString, async () => {
            this._findFilesToScanAndScanThem();
        });
    }
    
    scan({fileHash}) {
        if (!fileHash) {
            throw new Error("Filehash not provided for virustotal scanner");
        }

        virusTotal.scan(fileHash);
    }
    
    toString() {
        return "VirusTotal";
    }

//#endregion

//#region PRIVATE
    async _findFilesToScanAndScanThem() {
        console.log(`Finding files to scan`);

        const client = await db.connect();
        const files  = await client.query(`SELECT DISTINCT filesha
                                           FROM "Uploads"
                                           WHERE (uploaddate < NOW() - '${process.env.VIRUSTOTAL_SECOND_SCAN_DELAY}'::INTERVAL AND "virustotalScan" = 1)
                                           OR    (uploaddate < NOW() - '${process.env.VIRUSTOTAL_THIRD_SCAN_DELAY}'::INTERVAL AND "virustotalScan" = 2);`);
        await client.release();

        console.log(`Found ${files.rows.length} files`);

        if(files.rows.length === 0) {
            // No files to scan
            console.log(`Skipping this scan`);
            return;
        }

        console.log(`Queueing files to scan`);
        files.rows.forEach(file => this.scan({fileHash: file.filesha}));
    }



    async _onScanDone(virusTotalData) {
        if (virusTotalData.positives >= minAllowedPositives) {
            await VirusTotalScanner._handleVirus(virusTotalData);
        }
        else {
            await VirusTotalScanner._handleClean(virusTotalData);
        }
    }

    static async _handleClean(virusTotalData) {
        const client = await db.connect();
        await client.query(`UPDATE "Uploads"
                            SET "virustotalScan" = "virustotalScan" + 1
                            WHERE filesha = $1;`, [ virusTotalData.resource ]);
        await client.release();
    }

    static async _handleVirus(virusTotalData) {
        const fileName = await VirusTotalScanner._getFilenameByHash(virusTotalData.resource);
        await deleteFilesByFileHash(virusTotalData.resource, uploadDestination);
        await logToTransparency(fileName, virusTotalData.resource, virusTotalData.permalink, "VirusTotal");
    }



    static async _getFilenameByHash(fileHash) {
        const client = await db.connect();
        const result = await client.query(`SELECT filename FROM "Uploads" WHERE filesha = $1`, [fileHash]);
        await client.release();

        if(result.rows.length === 0) 
            return null;
        
        return result.rows[0].filename;
    }
//#endregion
}

export { VirusTotalScanner };