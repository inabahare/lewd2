import { DbClient }            from "../../helpers/database";
import { promisify } from "util";
import fs            from "fs";

const unlink = promisify(fs.unlink);

/**
 * Update the 
 * @param {object} file The formidable file object 
 */
const updateExistingFile = async (file) => {
    const client = DbClient();
    await client.connect();
                   await client.query(`UPDATE "Uploads" SET uploaddate = NOW() WHERE filesha = $1`, [file.hash]);
                   await client.end();

    unlink(file.path);
};

export default updateExistingFile;