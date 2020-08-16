import crypto from "crypto";

/**
 * Takes the filename and returns a new name 
 * @param {string} fileName 
 * @param {boolean} useShortName 
 */
function renameFile (fileName, useShortName) {
  const randomData = crypto.randomBytes(6).toString("hex");
    
  if (useShortName) {
    const extension = fileName.match(/\.(.)+$/g);
    return `${randomData}${extension}`;
  } else {
    return `${randomData}_${fileName}`;
  }
}

export default renameFile;