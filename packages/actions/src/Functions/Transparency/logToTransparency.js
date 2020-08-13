import { query } from "/Functions/database";

/**
 * In case the antivirus catches something, use this to log the caught stuff
 * @param {string} fileName - The (original) name of the file removed
 * @param {string} fileHash - The hash of the file removed
 * @param {string} type     - The given reason behind the removal (or VirusTotal link)
 * @param {string} origin   - Weather the block reason comes from Google, VirusTotal, or Sophos
 */
const logToTransparency = async (fileName, fileHash, reason, origin) => {
  const data = [
    fileName, 
    fileHash, 
    reason, 
    origin
  ];

  await query(`INSERT INTO "Transparency" ("Date", "FileName", "FileHash", "Type", "Origin")
                 VALUES (NOW(), $1, $2, $3, $4);`, data);
};

export { logToTransparency};