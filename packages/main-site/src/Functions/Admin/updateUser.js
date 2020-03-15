import { query } from "/Functions/database";

async function updateUser(userId, uploadSize, isAdmin) {
    await query(`UPDATE "Users" 
                 SET uploadsize = $2, isadmin = $3
                 WHERE id = $1`, [userId, uploadSize, isAdmin]);
}

export { updateUser };