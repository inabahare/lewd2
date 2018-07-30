import express       from "express";
import fs            from "fs";
import { promisify } from "util";
import db            from "../helpers/database";

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
        console.log("a");
        return res.redirect("/");
    }

    // Check for duplicate files
    const getDuplicateFiles = await client.query(`SELECT id, filename, filesha, duplicate
                                                  FROM "Uploads"
                                                  WHERE filesha = $1
                                                  AND id != $2;`, [file.filesha, file.id]);

    // If the file is unique then remove it
    if (getDuplicateFiles.rows.length === 0) 
        unlink(process.env.UPLOAD_DESTINATION + file.filename);
    
    await client.query(`DELETE FROM "Uploads" WHERE id = $1`, [file.id]);
    await client.release();

    res.redirect("/");
});

export default router;