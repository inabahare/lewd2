import { DbClient } from "../../helpers/database";
import removeFiles from "../FileDeletion/deleteFiles";

/**
 * Purges user and the users login tokens
 * @param {Number} id - User's ID
 * @param {Boolean} deleteFiles - If the users files needs to be deleted as well
 */
const deleteUser = async (id, deleteFiles = false) => {
    const client = DbClient();
    await client.connect();
                   await client.query(`DELETE FROM "Users" WHERE id = $1;`, [id]);
                   await client.query(`DELETE FROM "LoginTokens" WHERE userid = $1;`, [id]);

    if (deleteFiles) {
        const getFiles = await client.query(`SELECT 
                                                DISTINCT ON (filename) 
                                                filename
                                            FROM 
                                                "Uploads" 
                                            WHERE 
                                                userid = $1 
                                            AND 
                                                filename NOT IN (SELECT filename FROM "Uploads" WHERE userid != $1);`, [
                                                    id
                                                ]);
        if (getFiles.rows.length != 0) {
            // Transform rows from [ { filename: '80931ac767d1_176.20.222.243.zip' }, { filename: '80931ac767d1_176.20.222.243.zip' } ]
            // To [ '80931ac767d1_176.20.222.243.zip', '80931ac767d1_176.20.222.243.zip' ]

            const files = getFiles.rows
                                  .map(f => f.filename);
            await removeFiles(files);
        }
    }
    
    await client.end();
}; 


export default deleteUser;