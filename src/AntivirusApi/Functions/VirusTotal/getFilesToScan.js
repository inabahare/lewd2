import { db } from "../../../app/helpers/database";

const getFilesToScan = async () => {
    const client = await db.connect();
    const files  = await client.query(`SELECT DISTINCT filename, filesha, "virustotalScan"
                                       FROM "Uploads"
                                       WHERE (uploaddate < NOW() - '${process.env.VIRUSTOTAL_SECOND_SCAN_DELAY}'::INTERVAL AND "virustotalScan" = 1)
                                       OR    (uploaddate < NOW() - '${process.env.VIRUSTOTAL_THIRD_SCAN_DELAY}'::INTERVAL AND "virustotalScan" = 2);`);
    await client.release();

    return files.rows;
};

export default getFilesToScan;