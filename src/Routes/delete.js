import express       from "express";
import fs            from "fs";
import { promisify } from "util";
import db            from "../helpers/database";
import deleteFiles   from "../Functions/FileDeletion/deleteFiles";

const router = express.Router();
const unlink   = promisify(fs.unlink);


router.get("/:key", async (req, res) => {
    const deletionKey = req.params.key;
    const client = await db.connect();

    // Find the file to be deleted
    const getFileData = await client.query(`SELECT id, filename, filesha, duplicate 
                                            FROM "Uploads"
                                            WHERE deletionkey = $1;`, [deletionKey]);

    const file = getFileData.rows[0];
    // Do nothing if there is no file
    if (file === undefined) {
        return res.redirect("/");
    }

    await deleteFiles([file.filename]);
    res.redirect("/");
});

export default router;