import { db } from "../../helpers/database";
import { convertNumberToBestByteUnit } from "../convertNumberToBestByteUnit";


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
                                            COUNT("filesha")::INTEGER "totalUploads",
                                            ROUND(COUNT(fileSha) / '${daysFilesAreStored}'::DECIMAL, 2) "averageFileCountPrDay",
                                            (SELECT COUNT(fileSha) FROM "Uploads" WHERE "uploaddate" > CURRENT_DATE + interval '1h')::INTEGER "uploadsFromToday",
                                            (SELECT COALESCE(SUM("size"), 0) FROM "Uploads" WHERE duplicate = FALSE)::INTEGER "totalUploadSize"
                                        FROM "Uploads";`);
    await client.release();

    const result = query.rows[0];

    // when there is nothing to do statistics on
    if (result.totalUploads === 0) {
        return null;
    }

    const uploadUnit = convertNumberToBestByteUnit(result.totalUploadSize);
    result.uploadSize = uploadUnit.value.toFixed(2);
    result.uploadUnit = uploadUnit.unit;

    return result;
}

export { getStatistics };