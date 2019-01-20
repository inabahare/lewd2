
import { db } from "../../helpers/database";
/**
 * Take a token and get the 
 * @param {string} token 
 */
const getUploader = async token => { 
    const client = await db.connect();

    let uploader = null;
    
    try {
        const getUploader = await client.query(`SELECT id, uploadsize
                                                FROM "Users"
                                                WHERE token = $1;`, [ token ]);
        uploader = getUploader.rows[0];
    }
    catch(ex) {
        console.error(`Failed to find uploader with message: ${ex.message}`);
    }
    finally {
        await client.release();
    }


    return uploader;
};

export { getUploader }; // asflkhjasf