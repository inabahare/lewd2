import { query } from "../Functions/database";

const getFilesToScan = async () => {
    const files  = await query(`SELECT DISTINCT filename, filesha, "virustotalScan"
                                FROM "Uploads"
                                WHERE (uploaddate < NOW() - '${process.env.VIRUSTOTAL_SECOND_SCAN_DELAY}'::INTERVAL AND "virustotalScan" = 1)
                                OR    (uploaddate < NOW() - '${process.env.VIRUSTOTAL_THIRD_SCAN_DELAY}'::INTERVAL AND "virustotalScan" = 2);`);

    return files;
};

export default getFilesToScan;