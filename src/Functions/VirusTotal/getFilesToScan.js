
import db from "../../helpers/database";

const getFilesToScan = async () => {
    const client = await db.connect();
    const files = client.query(`SELECT filename, filehash, "virustotalScan"
                                FROM "Uploads"
                                WHERE (uploaddate < NOW - ${process.env.VIRUSTOTAL_SECOND_SCAN_DELAY} AND "virustotalScan" = 1)
                                OR    (uploaddate < NOW - ${process.env.VIRUSTOTAL_THIRD_SCAN_DELAY} AND "virustotalScan" = 2);`);


    await client.release();

    if (!files.rows[0]) {
        return null;
    }

    return files.rows;
}

export default getFilesToScan;