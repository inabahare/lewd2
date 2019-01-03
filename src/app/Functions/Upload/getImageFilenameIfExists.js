import { DbClient } from "../../helpers/database";

/**
 * Does your laundry
 * @param {string} fileSha sha representation of the file
 * @returns {string} Your laundry if it exists, or null if it doesn't
 */
const getImageFilenameIfExists = async fileSha => {
    const client = DbClient();
    await client.connect();
    const checkFile = await client.query(`SELECT filename FROM "Uploads" 
                                          WHERE filesha = $1 
                                            AND deleted = FALSE 
                                            AND duplicate = false;`, [fileSha]);
                      await client.end();

    return (checkFile.rows[0]) ? checkFile.rows[0].filename 
                               : null;
};

export default getImageFilenameIfExists;