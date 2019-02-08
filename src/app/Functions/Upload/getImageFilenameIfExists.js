import { db } from "../../helpers/database";

const sql = `
SELECT 
  filename, 
  (SELECT COUNT(filesha) FROM "Uploads" WHERE filesha = $1) amount  
FROM "Uploads" 
WHERE filesha = $1 
  AND deleted = FALSE 
  AND duplicate = false;
`;


/**
 * Does your laundry
 * @param {string} fileSha sha representation of the file
 * @returns {string} Your laundry if it exists, or null if it doesn't
 */
const getFilenameAndAmount = async fileSha => {
    const client = await db.connect();
    const checkFile = await client.query(sql, [fileSha]);
    await client.release();

    return (checkFile.rows[0]) ? checkFile.rows[0] 
                               : null;
};

export { getFilenameAndAmount };