import crypto from "crypto";

/**
 * Takes the filename and returns a new name 
 * @param {*} fileName 
 */
const renameFile = fileName => crypto.randomBytes(6)
                                     .toString("hex") + "_" + fileName;
export default renameFile;