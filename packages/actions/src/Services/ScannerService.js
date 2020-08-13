import { scanners } from "./scanners";

class ScannerService {
  constructor() {

  }

  Start() {
    console.log("Scanners:");
    scanners.forEach(scanner => {
      console.log(`\t ${scanner.toString()}`);
    });

    scanners.forEach(scanner => {
      console.log(`Starting cronjob for ${scanner.toString()}`);
    });
  }


  /**
     * Run a customly called scan
     * @param {string} filename - The name of the file on disc
     * @param {string} fileHash - The hash of the file
     */
  Scan(fileName, fileHash) { 
    const inputObject = {
      fileName,
      fileHash,
    };

    scanners.forEach(scanner => {
      scanner.scan(inputObject);
    });
  }
}

export { ScannerService };