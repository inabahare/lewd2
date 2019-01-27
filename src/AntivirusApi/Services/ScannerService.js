import { scanners } from "./scanners";

class ScannerService {
    constructor() {

    }

    Start() {

    }


    /**
     * Run a customly called scan
     * @param {string} filename - The name of the file on disc
     * @param {string} fileHash - The hash of the file
     */
    Scan(filename, fileHash) {
        const inputObject = {
            filename: filename,
            fileHash: fileHash,
        };

        scanners.forEach(scanner => {
            scanner.scan(inputObject);
        });
    }
}

export { ScannerService };