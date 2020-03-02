import { query } from "../../../app/Functions/database";

const getFilesForSecondaryScan = async () => {
    const getFiles = await query(`SELECT DISTINCT ON(filesha) filename, filesha 
                                  FROM "Uploads" 
                                  WHERE "scannedTwice" = FALSE;`);

    return getFiles;
};

export default getFilesForSecondaryScan;