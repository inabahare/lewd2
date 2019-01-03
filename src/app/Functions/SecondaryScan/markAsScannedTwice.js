import { DbClient } from "../../helpers/database";

const markAsScannedTwice = async files => {
    const client = DbClient();
    await client.connect();
    files.forEach(async fileName => {
        await client.query(`UPDATE "Uploads"
                            SET "scannedTwice" = TRUE
                            WHERE filename = $1;`, [
                                fileName.filename
                            ]);
                         
    });
    await client.end();
};

export default markAsScannedTwice;