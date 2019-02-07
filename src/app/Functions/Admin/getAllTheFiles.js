import { db } from "../../helpers/database";

async function getUploads() {
    const client = await db.connect();

    const uploads = await client.query(`SELECT filename, size, originalname, uploaddate, duplicate, virus, passworded, deletionkey, "Users".username  
                                        FROM "Uploads", "Users"
                                        WHERE "Uploads".userid = "Users".id
                                        ORDER BY uploaddate DESC`);
    await client.release();

    return uploads.rows;
}

export { getUploads };
