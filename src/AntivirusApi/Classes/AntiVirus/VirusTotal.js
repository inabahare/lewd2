import axios from "axios";
import queue from "async/queue";

const url    = "https://www.virustotal.com/vtapi/v2/file/report"; 

class VirusTotal {
    constructor(apikey, scansPrMinute = 4) {
        this.apikey = apikey;

        this.headers = {
            "Accept-Encoding": "gzip deflate",
            "User-Agent": "gzip"
        };

        this.amountOfScans = 0;
        this.scansPrMinute = parseInt(scansPrMinute);

        // So get around the fact that virustotal's API limits the amount of requests pr minutes
        this.waitTime = 60001; 

        this.queue = queue((task, callback) => {
            this._worker(task)
                .then(() => {
                    callback();
                });
        }, 1);

        this._onScanCallback = null;
    }

    /**
     * This will get called 4 times every minute
     * @param {object} task - An object that looks like this { fileHash: fileHash }
     */
    async _worker(task) {
        if (!task.fileHash) {
            throw new Error("A hash of the scanned file needs to be provided");
        }

        await this._checkPause();
        const report = await this._getFileReport(task.fileHash);
        await this._onScanCallback(report.data);

    }       


    async _getFileReport(fileSha) {
        const config     = this._createConfig(fileSha);
        const fileReport = await axios.get(url, config);

        return fileReport;
    }

    _createConfig(fileSha) {
        return {
            headers: this.headers,
            params: {
                "apikey": this.apikey,
                "resource": fileSha
            }
        };
    }

    async _checkPause() {
        if (this.amountOfScans === this.scansPrMinute) {
            console.log("Waiting a minute");
            await this._sleep(this.waitTime);
            this.amountOfScans = 0;
        }

        this.amountOfScans++;
    }

    /**
     *  Call this to start a scan
     * @param {string} fileHash 
     */
    scan(fileHash) {
        this.queue.push({
            fileHash: fileHash
        });
    }

    /**
     * Set a function to call every time a scan has finished
     * @param {function} whenScanIsDone
     */
    set onScanDoneCallback(whenScanIsDone) {
        if (typeof whenScanIsDone !== "function") {
            throw new Error("The input to onScanDone needs to be a function");
        }

        this._onScanCallback = whenScanIsDone;
    }

    /**
     * Helper function to wait the minute the API requires
     * @param {number} ms 
     */
    _sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
}

export { VirusTotal };