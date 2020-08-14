import { GenericAntiVirus } from "/Classes/AntiVirus";
import { query } from "/Functions/database";
import { removeFile } from "/Functions/FileDeletion/removeFile";

const {
  UPLOAD_DESTINATION,
  ANTI_VIRUS_COMMAND,
  RETURN_CODE_NO_VIRUS,
  RETURN_CODE_VIRUS,
  RETURN_CODE_ERROR
} = process.env;

const scannerArgs = {
  query,
  removeFile,
  uploadDestination: UPLOAD_DESTINATION,
  antiVirusCommand: ANTI_VIRUS_COMMAND,
  returnCodeVirus: parseInt(RETURN_CODE_VIRUS),
  returnCodeError: parseInt(RETURN_CODE_ERROR),
  returnCodeClean: parseInt(RETURN_CODE_NO_VIRUS)
};

const scanners = [
  new GenericAntiVirus(scannerArgs)
];

export { scanners };