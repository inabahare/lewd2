import { query } from "../../Functions/database";

async function getUsernameAndIdFromFileName(fileName) {
    // In case nothing provided
    if (!fileName) {
        return null;
    }

    const user = await query(`SELECT userid, username 
                              FROM "Uploads", "Users" 
                              WHERE "Uploads".userid = "Users".id 
                              AND "filename" = $1 `, [ fileName ]);

    // In case nothing found
    if (user.length === 0) {
        return null;
    }

    return user.rows;
}

export { getUsernameAndIdFromFileName };