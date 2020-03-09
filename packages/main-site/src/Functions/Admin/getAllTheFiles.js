import { query } from "../../Functions/database";

async function getUploads() {
    const uploads = await query(`SELECT filename, size, originalname, uploaddate, duplicate, virus, passworded, deletionkey, "Users".username  
                                 FROM "Uploads", "Users"
                                 WHERE "Uploads".userid = "Users".id
                                 ORDER BY uploaddate DESC`);

    return uploads;
}

export { getUploads };
