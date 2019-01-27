import { db } from "../../../app/helpers/database";


async function deleteFileByHashReturningFilename(fileHash) {
    if (!fileHash) {
        throw new Error("To delete file by hash and return a filename you need to set the filehash");
    }

    let filenames = null;
    const client  = await db.connect();
    
    try {
        filenames = await client.query(`DELETE FROM "Uploads"
                                       WHERE filesha = $1
                                       RETURNING filename`, fileHash);
    }
    catch(ex) {
        console.error("deleteFileByHashReturningFilename", fileHash, ex.message);
    }
    finally {
        await client.release();
    }

    // Since the output from the query will be an array containing objects where the field will be filename. 
    // IE loads of {filename: whatever} I'll just turn them into an array of filenames instead!
    if(filenames) {
        return filenames.rows.map(f => f.filename);
    }

    return null;
}

export { deleteFileByHashReturningFilename };