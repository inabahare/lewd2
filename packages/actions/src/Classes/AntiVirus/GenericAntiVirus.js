import { spawn } from "child_process";
import path from "path";
import queue from "async/queue";

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
   * @param { number } args.amountOfSimultaniousScanners - How many scanners running at once
   */
  constructor(args) {
    Object.assign(this, args);

    this._scanningQueue = queue(async (args, next) => {
      await this._worker(args);
      next();
    }, this.amountOfSimultaniousScanners)
  }

  async _worker(args) {
    const {
      fileName,
    } = args;

    const fullPath = path.join(this.uploadDestination, fileName);

    const returnCode = await this._scan(fullPath);
    if (returnCode == this.returnCodeClean)
      return;

    this.removeFile(this.uploadDestination, fileName);
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
    if (!args.fileName)
      throw Error("Filename not provided for scanner")

    this._scanningQueue.push(args);
  }

  toString() {
    return this.antiVirusCommand;
  }
}