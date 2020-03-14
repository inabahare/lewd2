import { query } from "../../Functions/database";
import deletionKey from "./deletionKey";

/**
 * 
 * @param {object} file 
 * @param {number} userid 
 */
const addImageToDatabase = async (file, userid) => {
    // Check for unique deletion key
    file.deletionKey = deletionKey();

    const data = [
        file.filename,
        file.originalname, 
        file.hash, 
        userid, 
        file.duplicate.toString(),
        file.deletionKey,
        file.size
    ];

    try {
        await query(`INSERT INTO "Uploads" (filename, originalName, filesha, userid, duplicate, uploaddate, deletionkey, size) 
                     VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7);`, data);
    }
    catch(ex) {
        console.error(`Failed to insert file to database with error: ${ex.message}`);
    }
};

export default addImageToDatabase;