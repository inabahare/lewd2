import { DbClient } from "../../helpers/database";

const getFilesForSecondaryScan = async () => {
    const client = DbClient();
    await client.connect();
    const getFiles = await client.query(`SELECT DISTINCT ON(filesha) filename, filesha 
                                         FROM "Uploads" 
                                         WHERE "scannedTwice" = FALSE;`);
                     await client.end();

    return getFiles.rows;
};

export default getFilesForSecondaryScan;