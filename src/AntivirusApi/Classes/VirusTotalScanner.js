import { VirusTotal } from "./AntiVirus/VirusTotal";
import { deleteFilesByFileHash } from "../Functions/FileDeletion/deleteFiles";
import { db } from "../../app/helpers/database";
import { logToTransparency } from "../Functions/Transparency/logToTransparency";

const uploadDestination   = process.env.UPLOAD_DESTINATION;
const minAllowedPositives = parseInt(process.env.VIRUSTOTAL_MIN_ALLOWED_POSITIVES);
const apiKey              = process.env.VIRUSTOTAL_KEY;
const maxScansPrDay       = parseInt(process.env.VIRUSTOTAL_MAX_SCANS_PR_DAY);

const virusTotal = new VirusTotal(apiKey);

class VirusTotalScanner {
//#region PUBLIC

    constructor() {
        this.virusTotal = virusTotal;
        virusTotal._onScanCallback = this._onScanDone;
        this._scans = 0;
    }
    
    
    scan({fileHash = null} = {}) {
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
    async _onScanDone(virusTotalData) {
        if (virusTotalData.positives >= minAllowedPositives) {
            await VirusTotalScanner._handleVirus(virusTotalData);
            return;
        }
    }

    static async _handleVirus(virusTotalData) {
        const fileName = await VirusTotalScanner._getFilenameByHash(virusTotalData.sha256);
        await deleteFilesByFileHash(virusTotalData.sha256, uploadDestination);
        await logToTransparency(fileName, virusTotalData.sha256, virusTotalData.permalink, "VirusTotal");
    }

    static async _getFilenameByHash(fileHash) {
        const client = await db.connect();
        const result = await client.query(`SELECT filename FROM "Uploads" WHERE filesha = $1`, [fileHash]);
        await client.release();

        if(result.rows.length === 0) 
            return null;
        
        return result.rows[0];
    }
//#endregion
}

export { VirusTotalScanner };