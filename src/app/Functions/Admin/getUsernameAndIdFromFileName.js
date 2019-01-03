import { DbClient } from "../../helpers/database";

async function getUsernameAndIdFromFileName(fileName) {
    // In case nothing provided
    if (!fileName) {
        return null;
    }

    const client = DbClient();
    await client.connect();
    const user = await client.query(`SELECT userid, username 
                                     FROM "Uploads", "Users" 
                                     WHERE "Uploads".userid = "Users".id 
                                     AND "filename" = $1 `, [ 
        fileName 
    ]);
    await client.end();

    // In case nothing found
    if (user.rows.length === 0) {
        return null;
    }

    return user.rows;
}

export { getUsernameAndIdFromFileName };