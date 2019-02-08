import { db }          from "../../helpers/database";
import deletionKey from "./deletionKey";

/**
 * 
 * @param {object} file 
 * @param {number} userid 
 */
const addImageToDatabase = async (file, userid) => {
    const client = await db.connect();

    // Check for unique deletion key
    file.deletionKey = deletionKey();

    try {
        await client.query(`INSERT INTO "Uploads" (filename, originalName, filesha, userid, duplicate, uploaddate, deletionkey, size) 
                            VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7);`, [
                                file.filename,
                                file.originalname, 
                                file.hash, 
                                userid, 
                                file.duplicate.toString(),
                                file.deletionKey,
                                file.size
                            ]);
    }
    catch(ex) {
        console.error(`Failed to insert file to database with error: ${ex.message}`);
    }
    finally {
        await client.release();
    }

};

export default addImageToDatabase;