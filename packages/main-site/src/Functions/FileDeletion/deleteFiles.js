import fs            from "fs";
import { promisify } from "util";
import path          from "path";
import { query } from "../../Functions/database";


const unlink = promisify(fs.unlink);

/**
 * 
 * @param {Array} fileNames - List of filenames to delete 
 * @returns {boolean} gotRemoved - Due to a race condition between the AV scanners this is needed
 */
const deleteFiles = async (fileNames) => {
    for (let fileName of fileNames) {
        const fullFileName = path.join(process.env.UPLOAD_DESTINATION, fileName);
    
        const getFile = await query(`DELETE FROM "Uploads" 
                                     WHERE filename = $1 
                                     RETURNING filesha, duplicate;`, [fileName]);
        
        // If the file has already been deleted
        if (!getFile) {
            return false;
        }

        if (fileName !== "robots.txt") {
            await unlink(fullFileName);
        } 
    }

    return true;
};

export default deleteFiles;