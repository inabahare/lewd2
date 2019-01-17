import { db } from "../../../app/helpers/database";

const getFilesForSecondaryScan = async () => {
    const client   = await db.connect();
    const getFiles = await client.query(`SELECT DISTINCT ON(filesha) filename, filesha 
                                         FROM "Uploads" 
                                         WHERE "scannedTwice" = FALSE;`);
                     await client.release();

    return getFiles.rows;
};

export default getFilesForSecondaryScan;