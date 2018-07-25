import db from "../../helpers/database";

/**
 * Purges user and the users login tokens
 * @param {*} id 
 */
const deleteUser = async id => {
    const client = await db.connect();
                   await client.query(`DELETE FROM "Users" WHERE id = $1;`, [id]);
                   await client.query(`DELETE FROM "LoginTokens" WHERE userid = $1;`, [id])
                   await client.release();
} 

export default deleteUser;