import https         from "https";
import queryString   from "querystring";
import async         from "async";
import { promisify } from "util";
import fs            from "fs";
import db            from "../helpers/database";

const unlink   = promisify(fs.unlink);

class VirusTotalScanner {
    constructor(APIKey, uploadDir, waitTime, scansPrMinute, maximumPositives) {
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

        this.queue = async.queue(this._scannerFunction, 1);
    }

    _getFileReport(hash) {
        return new Promise((resolve, reject) => {
            const postData = queryString.stringify({
                "resource": hash,
                "apikey": this.APIKey
            });
        
            const req = https.request(this.options, res => {
                let end = "";
                res.on("data", d => {
                    end += d;
                });
    
                res.on("end", () => {
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

    async _scannerFunction(task) {
        this.amountOfScans++;
        if (this.amountOfScans == this.scansPrMinute) {
            await sleep(this.waitTime);
            this.amountOfScans = 0;
        }
    
        const report = await this._getFileReport(task.fileHash, this.APIKey);
    
        // Should I wait and try again?
        if (report === null) 
            return;
    
        // If there are too few positives
        if (report.positives < parseInt(process.env.VIRUSTOTAL_MIN_ALLOWED_POSITIVES))
            return;

        // Remove the file
        
    }

    scan(filehash, filename, scanNumber) {
        this.queue.push({
            filehash: filehash,
            filename: filename,
            scanNumber: scanNumber
        })
    }
}

export default VirusTotalScanner;