import { query } from "../../Functions/database";
import removeFiles from "../FileDeletion/deleteFiles";

/**
 * Purges user and the users login tokens
 * @param {Number} id - User's ID
 * @param {Boolean} deleteFiles - If the users files needs to be deleted as well
 */
const deleteUser = async (id, deleteFiles = false) => {
    
    if (deleteFiles) {
        const getFiles = await query(`SELECT DISTINCT ON (filename) filename
                                      FROM "Uploads" 
                                      WHERE userid = $1 
                                      AND filename NOT IN (SELECT filename FROM "Uploads" WHERE userid != $1);`, [ id ]);
               
        if (getFiles.length != 0) {
            const files = getFiles.map(f => f.filename);
            await removeFiles(files);
        }

    }

    await query(`DELETE FROM "Users" WHERE id = $1;`, [id]);
    await query(`DELETE FROM "LoginTokens" WHERE userid = $1;`, [id]);
}; 


export default deleteUser;