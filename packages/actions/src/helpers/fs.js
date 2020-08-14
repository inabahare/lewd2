import fs from "fs";

export const unlink = fs.promises.unlink;

/**
 * 
 * @param { string } filePath - Location of the file
 * @returns { Promise<boolean> } Weather or not the file exists
 */
export const exists =
  async filePath => {
    try {
      fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }