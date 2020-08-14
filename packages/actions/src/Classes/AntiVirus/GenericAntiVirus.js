import { spawn } from "child_process";
import path from "path";


// * @param {
//   *     uploadDestination: string, 
//   *     removeFile: function,
//   *     antiVirusCommand: string,
//   *     returnCodeVirus: number,
//   *     returnCodeClean: number,
//   *     returnCodeError: number,
// * } args 

export class GenericAntiVirus {
  /**
   * Generic anti virus
   * @param { Object } args - Input object
   * @param { string } args.uploadDestination - Where files to be scanned are stored
   * @param { function } args.removeFile - When the scanner needs to remove a file
   * @param { string } args.antiVirusCommand - Command that needs to be run for scanning files
   * @param { number } args.returnCodeVirus - Return code from the commandline tool
   * @param { number } args.returnCodeClean - Return code from the commandline tool
   * @param { number } args.returnCodeError - Return code from the commandline tool
   */
  constructor(args) {
    Object.assign(this, args);
    console.log(this.uploadDestination);
  }

  _scan(fullPath) {
    return new Promise((resolve, reject) => {
      const scanner = spawn(this.antiVirusCommand, [fullPath]);

      scanner.on("close", code => {
        if (code == this.returnCodeError)
          reject(`Problem running antivirus command ${this.antiVirusCommand} on the file ${fullPath}`);

        resolve(code);
      });
    });
  }

  /**
   * 
   * @param { Object } args
   * @param { string } args.fileName - Name of the file (on disk) to scan
   */
  async scan(args) {
    const {
      fileName,
    } = args;

    const fullPath = path.join(this.uploadDestination, fileName);

    const returnCode = await this._scan(fullPath);

    if (returnCode == this.returnCodeClean)
      return;

    await this.removeFile(this.uploadDestination, fileName);
  }
}