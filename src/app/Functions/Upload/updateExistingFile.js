import { db }            from "../../helpers/database";
import { promisify } from "util";
import fs            from "fs";

const unlink = promisify(fs.unlink);

/**
 * Update the 
 * @param {object} file The formidable file object 
 */
const updateExistingFile = async (file) => {
    const client = await db.connect();
    await client.query(`UPDATE "Uploads" SET uploaddate = NOW() 
                        WHERE filesha = $1`, [file.hash]);
    await client.release();

    unlink(file.path);
};

export default updateExistingFile;