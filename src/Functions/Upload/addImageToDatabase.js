import db from "../../helpers/database";

/**
 * 
 * @param {object} file 
 * @param {number} userid 
 */
const addImageToDatabase = async (file, userid) => {

    const client       = await db.connect();
    const insertUpload = await client.query(`INSERT INTO "Uploads" (filename, originalName, filesha, userid, duplicate, uploaddate) 
                                             VALUES ($1, $2, $3, $4, $5, NOW());`, [
                                                 file.name,
                                                 file.originalName, 
                                                 file.hash, 
                                                 userid, 
                                                 file.duplicate
                                                ]);
                         await client.release();
};

export default addImageToDatabase;