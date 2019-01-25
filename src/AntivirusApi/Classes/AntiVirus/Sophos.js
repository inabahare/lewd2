import { spawn }  from "child_process";
import queue      from "async/queue"; 

const returnCodes = {
    CLEAN: 0,
    INTERRUPT: 1,
    ERROR: 2,
    VIRUS: 3
};

class SophosReturnObject {
    _formatSophosOutput(output) {
        if (!output) {
            return null;
        }

        return output.split(">>> ")[1]
                     .split("\n")[0];
    }


    constructor(returnCode, sophosOutput) {
        this.returnCode   = returnCode;
        this.sophosOutput = this._formatSophosOutput(sophosOutput);
    }
}

class Sophos {
//#region public:
    /**
     * 
     * @param {number} amountOfSophosProcessesRunningAtOnce - This is to limit the amount of scans that can run at the same time since sophos uses quite a lot of CPU. Defaults to 1. 
     * @param {string} fullSophosPath - This is where 
     */
    constructor(amountOfSophosProcessesRunningAtOnce = 1, fullSophosPath = "/opt/sophos-av/bin/savscan") {
        this._scanData  = "";
        this.sophosPath = fullSophosPath;

        this._onScanCallback = () => { throw new Error("The sophos onScanDone callback has not been set"); };

        this.scanQueue  = queue((task, callback) => {
            this._worker(task)
            .then(() => {
                callback();
            });
        }, amountOfSophosProcessesRunningAtOnce);
    }

    static get returnCodes() { return returnCodes; }

    /**
     * Set the function/method to be called whenever a scan has finished
     * @param {function} whenScanIsDone - 
     */
    set onScanDoneCallback(whenScanIsDone) {
        if (typeof whenScanIsDone !== "function") {
            throw new Error("The input to onScanDone needs to be a function");
        }

        this._onScanCallback = whenScanIsDone;
    }

    /**
     * Schedule a scan on a file
     * @param {string} filePath - The full path of the file to scan on disk
     */
    scan(filePath) {
        if (!filePath) {
            throw new Error("The path of the file to scan needs to be set");
        }

        this._scan(filePath);
    }

//#endregion


//#region private
    /**
     * The method to be called on every scan
     * @param {object} task - Contains the following object: {filePath: string} 
     */
    async _worker(task) {
        if (!task.filePath) {
            throw new Error("The sophos worker did not recieve a file path");
        }

        const scanResult = await this._scan(task.filePath);

        this._onScanCallback(scanResult);
    }

    /**
     * This method runs a scan with sophos and then returns an object representing the result from Sophos
     * @param {string} filePath - The full path on disk of the file to scan
     * @returns {SophosReturnObject} - An object with a code and a message from Sophos
     */
    _scan(filePath) {
        return new Promise((resolve, reject) => {
            let scanData = "";
            const scanner = spawn(this.sophosPath, ["-nc", 
                                                    "-nb", 
                                                    "-ss",
                                                    "-archive", 
                                                    "-suspicious", 
                                                    filePath]);

            scanner.stdout.on("data", data => scanData += data);

            scanner.on("close", code => {
                const result = new SophosReturnObject(code, scanData);
                resolve(result);
            });

            scanner.on("error", err => reject(err));
        });
    }
//#endregion
}

module.exports = Sophos;