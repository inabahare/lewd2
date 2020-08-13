import { spawn } from "child_process";
import path from "path";

export class GenericAntiVirus {
  constructor(args) {
    // const {
    //   uploadDestination, 
    //   removeFile,
    //   antiVirusCommand,
    //   returnCodeVirus,
    //   returnCodeClean,
    //   returnCodeError,
    // } = args;

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

  async scan(fileObject) {
    const { 
      fileName,
    } = fileObject;

    const fullPath = path.join(this.uploadDestination, fileName);

    const returnCode = await this._scan(fullPath);

    if (returnCode == this.returnCodeClean)
      return;

    await this.removeFile(fileName, this.uploadDestination);
  }
}