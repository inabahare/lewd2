import { Uploads } from "/DataAccessObjects";

async function get(req, res) {
    const deletionKey = req.params.key;

    // Find the file to be deleted
    const getFileData = await Uploads.GetFromDeletionKey(deletionKey);
    
    // Do nothing if there is no file
    if (!getFileData) {
        return res.status(400)
                  .send("No file to delete, sorry");
    }

    await Uploads.DeleteFile(getFileData.filename);
    res.send(`${getFileData.filename} has just been deleted`);
}

export { get };