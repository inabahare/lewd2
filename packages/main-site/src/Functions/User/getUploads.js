import { query } from "/Functions/database";

async function getUploads(userId) {
    if (!userId) {
        return null;
    }

    const uploads = await query(`SELECT filename, size, originalname, uploaddate, duplicate, virus, passworded, deletionkey  
                                 FROM "Uploads" 
                                 WHERE userid = $1
                                 ORDER BY id DESC;`, [ userId ]);
    return uploads;
}

export { getUploads };
