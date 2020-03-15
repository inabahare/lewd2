import { query } from "/Functions/database";

async function getUsernameAndIdFromFileName(fileName) {
    // In case nothing provided
    if (!fileName) {
        return null;
    }

    const user = await query(`SELECT userid, username 
                              FROM "Uploads", "Users" 
                              WHERE "Uploads".userid = "Users".id 
                              AND "filename" = $1 `, [ fileName ]);

    return user;
}

export { getUsernameAndIdFromFileName };