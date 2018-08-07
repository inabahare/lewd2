import fs            from "fs";
import db from "../../helpers/database";
import { promisify } from "util";
require('dotenv').config();

const unlink   = promisify(fs.unlink);

export default async fileNames => {
    const client = await db.connect();
    fileNames.forEach(async fileName => {
        const fullFileName = process.env.UPLOAD_DESTINATION + fileName;
        
        if (fs.existsSync(fullFileName))
            await unlink(fullFileName);

        await client.query(`DELETE FROM "Uploads" WHERE filename = $1;`, [fileName]);
        
    });

    await client.release();
};