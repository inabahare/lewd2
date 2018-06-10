import express from "express";
import multer from "multer";
import {promisify} from 'util';
import fs from "fs";
// import readFile from "fs-readfile-promise";
import { storageConfig, constants} from "../config";
import db from "../helpers/database";
import sha from "sha1";

const router = express.Router();
const unlink = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

const getUploadersMazSize = async token => {
    const client = await db.connect();

    const getRole = await client.query("SELECT role FROM \"Users\" WHERE token = $1", [token]);
    
    // The program still needs to be able to work if no user is logged in
    const role = (getRole.rows[0] === undefined) ? token 
                                                 : getRole.rows[0].role;


    const getUploadSize = await client.query("SELECT uploadsize FROM \"Roles\" WHERE name = $1", [role]);
    await client.release();

    return getUploadSize.rows[0].uploadsize;
};

const addImageToDatabase = async req => {
    const client = await db.connect();
    let userId = 0

    // Check if the user is logged in
    if (req.headers.token !== constants.DEFAULT_TOKEN) {
        const getUserId = await client.query("SELECT id FROM \"Users\" WHERE token = $1", [req.headers.token]);
        userId = getUserId.rows[0].id;
    }

    const file = await readFile(req.file.path)
    const fileSha = sha(file);

    // Remove file if exists
    const checkFile = await client.query("SELECT filename FROM \"Uploads\" WHERE filesha = $1", [fileSha]);
    await client.query("DELETE FROM \"Uploads\" WHERE filesha = $1", [fileSha]);

    if (checkFile.rows[0]) {
        // const fileToRemove = await readFile(constants.DEST + checkFile.rows[0].filename);
        await unlink(constants.DEST + checkFile.rows[0].filename);
    }

    const insertUpload = await client.query("INSERT INTO \"Uploads\" (filename, userid, uploaddate, filesha) VALUES ($1, $2, NOW(), $3)", [req.file.filename, userId, fileSha]);
    await client.release();
}

router.post("/", async (req, res) => {
    const storage = multer.diskStorage(storageConfig);
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: Number(await getUploadersMazSize(req.headers.token))
        }, fileFilter: (req, file, next) => {
            console.log(file);
            next(null, true);
        }
    });

    const uploader = upload.single("file");
    uploader(req, res, async err => {
        if (err) 
            return res.status( 400 ).send( err.message );

        // If the person is logged in
        // if (req.headers.token !== constants.DEFAULT_TOKEN)
        
        addImageToDatabase(req);
            
        return res.status(200).send(req.file);
    });
});

export default router;