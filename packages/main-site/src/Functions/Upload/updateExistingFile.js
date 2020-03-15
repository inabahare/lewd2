import { query } from "/Functions/database";
import { promisify } from "util";
import fs            from "fs";

const unlink = promisify(fs.unlink);

/**
 * Update the 
 * @param {object} file The formidable file object 
 */
const updateExistingFile = async (file) => {
    await query(`UPDATE "Uploads" SET uploaddate = NOW() 
                 WHERE filesha = $1`, [file.hash]);

    unlink(file.path);
};

export default updateExistingFile;