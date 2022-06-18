import fs from "fs";
import crypto from "crypto";

/**
 * Return the hash of a file
 * @param {string} fullPath 
 */
const hashFile = async fullPath =>  new Promise((resolve, reject) => {
  try {
    const hash = crypto.createHash("sha256");
    const stream = fs.ReadStream(fullPath);
    stream.on("data", data => hash.update(data));
    stream.on("end", () => {
      const result = hash.digest("hex");
      return resolve(result);
    });
  } catch (error) {
    return reject(error.message);
  }
});

export default hashFile;