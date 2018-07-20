import fs            from "fs";
import { promisify } from "util";
require('dotenv').config();

const unlink   = promisify(fs.unlink);

export default async files => {
    files.forEach(async file => {
        await unlink(process.env.UPLOAD_DESTINATION + file.filename);
    });
};