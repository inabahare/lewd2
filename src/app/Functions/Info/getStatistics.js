import { db } from "../../helpers/database";

/**
 * 
 * @param {Number} daysFilesAreStored - To get the average uploads pr day
 * @returns {object} {totalUploads, 
 *                    averageFileCountPrDay, 
 *                    uploadsFromToday,
 *                    totalUploadSize}
 */
async function getStatistics(daysFilesAreStored) {
    const client = await db.connect();
    const query = await client.query(`SELECT 
                                            COUNT("filesha") "totalUploads",
                                            ROUND(COUNT(fileSha) / '${daysFilesAreStored}'::DECIMAL, 2) "averageFileCountPrDay",
                                            (SELECT COUNT(fileSha) FROM "Uploads" WHERE "uploaddate" > CURRENT_DATE + interval '1h') "uploadsFromToday",
                                            (SELECT SUM("size") FROM "Uploads" WHERE duplicate = FALSE) "totalUploadSize"
                                        FROM "Uploads";`);
    await client.release();

    return query.rows[0];
}

export { getStatistics };