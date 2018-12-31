import db from "../../helpers/database";

async function updateUser(userId, uploadSize, isAdmin) {
    const client = await db.connect();
    await client.query(`UPDATE "Users" 
                        SET uploadsize = $2, isadmin = $3
                        WHERE id = $1`, [userId, uploadSize, isAdmin]);
    await client.release();
}

export { updateUser };