import { query } from "/Functions/database";
import { convertNumberToBestByteUnit } from "/Functions/convertNumberToBestByteUnit";

export class Statistics {
  static async GetStatistics(daysFilesAreStored) {
    const totalUploads =
      `COUNT("filesha")::INTEGER "totalUploads"`;

    const filesUploadedPrDay =
      `ROUND(COUNT(fileSha) / '${daysFilesAreStored}'::DECIMAL, 2)::TEXT "averageFileCountPrDay"`;

    const uploadsToday =
      `(SELECT COUNT(fileSha) FROM "Uploads" WHERE "uploaddate" > CURRENT_DATE + interval '1h')::TEXT "uploadsFromToday"`;

    const amountUploaded =
      `(SELECT COALESCE(SUM("size"), 0) FROM "Uploads" WHERE duplicate = FALSE)::TEXT "totalUploadSize"`;

    const sql =
      `SELECT ${totalUploads}, ${filesUploadedPrDay}, ${uploadsToday}, ${amountUploaded} 
       FROM "Uploads";`;

    const result = await query(sql);
    const stats = result[0];

    // Nothing has been uploaded
    if (result.totalUploads === 0)
      return null;

    const uploadUnit = convertNumberToBestByteUnit(stats.totalUploadSize);
    stats.uploadSize = uploadUnit.value;
    stats.uploadUnit = uploadUnit.unit;

    return stats;
  }
}