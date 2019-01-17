import { db } from "../../helpers/database";

async function getUploads(userId) {
    if (!userId) {
        return null;
    }
    const client = await db.connect();

    const uploads = await client.query(`SELECT filename, originalname, uploaddate, duplicate, virus, passworded, deletionkey  
                                        FROM "Uploads" 
                                        WHERE userid = $1
                                        ORDER BY id DESC;`, [ userId ]);
    await client.release();

    return uploads.rows;
}

export { getUploads };
