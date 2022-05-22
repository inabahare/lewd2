import crypto from "crypto";
import { extname } from "path";


/**
 * Takes the filename and returns a new name 
 * @param {string} fileName 
 * @param {boolean} useShortName 
 */
function renameFile (fileName, useShortName) {
  const randomData = crypto.randomBytes(6).toString("hex");
    
  if (useShortName) {
    const extension = extname(fileName);
    return `${randomData}${extension}`;
  } else {
    return `${randomData}_${fileName}`;
  }
}

export default renameFile;