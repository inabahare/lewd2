import { db } from "../../helpers/database";

const markAsScannedTwice = async files => {
    const client = await db.connect();
    
    files.forEach(async fileName => {
        await client.query(`UPDATE "Uploads"
                            SET "scannedTwice" = TRUE
                            WHERE filename = $1;`, [
                                fileName.filename
                            ]);
    });
    
    await client.release();
};

export default markAsScannedTwice;