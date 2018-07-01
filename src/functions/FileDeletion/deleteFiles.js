import fs            from "fs";
import { promisify } from "util";
import { constants } from "../../config";

const unlink   = promisify(fs.unlink);

export default async files => {
    files.forEach(async file => {
        await unlink(constants.DEST + file.filename);
    });
};