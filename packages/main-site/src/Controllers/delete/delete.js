import deleteFiles   from "/Functions/FileDeletion/deleteFiles";
import { query } from "/Functions/database";


async function get(req, res) {
    const deletionKey = req.params.key;

    // Find the file to be deleted
    const getFileData = await query(`SELECT id, filename, filesha, duplicate 
                                    FROM "Uploads"
                                    WHERE deletionkey = $1;`, [deletionKey]);
    
    const file = getFileData[0];
    // Do nothing if there is no file
    if (!file) {
        return res.status(400)
                  .send("No file to delete, sorry");
    }

    await deleteFiles([file.filename]);
    res.send(`${file.filename} has just been deleted`);
}

export { get };