import https         from "https";
import queryString   from "querystring";
import async         from "async";
import { promisify } from "util";
import fs            from "fs";
import sleep         from "../Functions/sleep";
import db            from "../helpers/database";
import deleteFiles   from "../Functions/FileDeletion/deleteFiles";

const unlink   = promisify(fs.unlink);

class VirusTotalScanner {
    /**
     * 
     * @param {String} APIKey 
     * @param {Number} waitTime 
     * @param {Number} scansPrMinute 
     * @param {Number} maximumPositives 
     * @param {String} uploadDir 
     */
    constructor(APIKey, waitTime, scansPrMinute, maximumPositives, uploadDir) {
        this.APIKey           = APIKey;
        this.uploadDir        = uploadDir;
        this.waitTime         = parseInt(waitTime);
        this.scansPrMinute    = parseInt(scansPrMinute);
        this.maximumPositives = parseInt(maximumPositives);
        this.amountOfScans    = 0;

        this.options = {
            hostname: "virustotal.com",
            port: "443",
            path: "/vtapi/v2/file/report",
            method: "POST",
            headers: {
                "Accept-Encoding": "gzip deflate",
                "User-Agent": "gzip inabaa"
            }
        }

        this.queue = async.queue(async task => {
            if (this.amountOfScans == this.scansPrMinute) {
                console.log("Sleeping");
                await sleep(this.waitTime);
                this.amountOfScans = 0;
            }
            this.amountOfScans++;

            await this._onScan(task);
        }, 1);
    }

    _getFileReport(fileHash) {
        return new Promise((resolve, reject) => {
            const postData = queryString.stringify({
                "resource": fileHash,
                "apikey": this.APIKey
            });
        
            const req = https.request(this.options, res => {
                let end = "";
                res.on("data", d => {
                    end += d;
                });
    
                res.on("end", () => {
                    // If for whatever reason VirusTotal doesn't approve of your request it will give you empty string
                    // JSON.parse doesn't like empty string
                    //...
                    const result = end.length === 0 ? null 
                                                    : JSON.parse(end);
    
                    resolve(result);
                });
    
                res.on("error", e => {
                    reject(e);
                });
            });
        
            req.on("error", e => {
                reject(e);
            })
            
            req.write(postData);
            req.end();
        });
    } 

    async _onScan(task) {
        console.log(`${this.amountOfScans}: Scanning`);
        const report = await this._getFileReport(task.fileHash);
        console.log(report === null);
        // Should I wait and try again?
        if (report === null)  {
            return;
        }
        
        // If there are too few positives
        if (report.positives < parseInt(process.env.VIRUSTOTAL_MIN_ALLOWED_POSITIVES) || report.response_code === 0) {
            console.log(`${task.fileName} is clean :3`)
            await this._updateFileVirustotalScanCountInDb(task.fileName, task.scanNumber);
            return;
        }

        // Remove the file if there are too many positives
        deleteFiles([task.fileName]);
    }

    /**
     * 
     * @param {*} fileName 
     * @param {*} scanNumber 
     */
    async _updateFileVirustotalScanCountInDb(fileName, scanNumber) {
        console.log(fileName, scanNumber);
        const client = await db.connect();
                       await client.query(`UPDATE "Uploads" SET "virustotalScan" = $1 WHERE filename = $2;`, [scanNumber, fileName]);
                       await client.release();
    }

    /**
     * 
     * @param {String} filehash - The files hash 
     * @param {String} filename - The name of the file on disk
     * @param {Number} scanNumber - The scan that has been performed
     */
    scan(filehash, filename, scanNumber) {
        this.queue.push({
            fileHash: filehash,
            fileName: filename,
            scanNumber: scanNumber
        })
    }
}

export default VirusTotalScanner;