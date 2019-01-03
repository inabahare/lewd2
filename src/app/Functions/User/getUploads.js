import { DbClient } from "../../helpers/database";

async function getUploads(userId) {
    if (!userId) {
        return null;
    }
    const client = DbClient();

    await client.connect();
    const uploads = await client.query(`SELECT filename, originalname, uploaddate, duplicate, virus, passworded, deletionkey  
                                           FROM "Uploads" 
                                           WHERE userid = $1
                                           ORDER BY id DESC;`, [ userId ]);
                    await client.end();

    return uploads.rows;
}

export { getUploads };
