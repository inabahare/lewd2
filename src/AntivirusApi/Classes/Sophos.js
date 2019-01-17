import { spawn }  from "child_process";
import path from "path";

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
    constructor(location = "/opt/sophos-av/bin/savscan") {
        this._scanData = "";
        this.sophosPath = location;
    }

    scan(filePath) {
        return new Promise((resolve, reject) => {
            const scanner = spawn(this.sophosPath, ["-nc", 
                                                    "-nb", 
                                                    "-ss",
                                                    "-archive", 
                                                    "-suspicious", 
                                                    filePath]);

            scanner.stdout.on("data", data => this._onData(data));

            scanner.on("close", code => {
                const result = new SophosReturnObject(code, this._scanData);
                this._clear();
                resolve(result);
            })

            scanner.on("error", err => reject);
        });
    }

    _clear() {
        this._scanData = "";
    }

    _onData(data) {
        this._scanData += data;
    }
}

Sophos.returnCodes = returnCodes;

module.exports = Sophos;