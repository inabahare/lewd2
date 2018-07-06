import express                     from "express";
import multer                      from "multer";
import {promisify}                 from 'util';
import fs                          from "fs";
import crypto                      from "crypto";
import { storageConfig           } from "../config";
import db                          from "../helpers/database";
import { spawn                   } from "child_process";

const router = express.Router();

const unlink   = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

const hashFile = async filename =>  new Promise((resolve, reject) => {
    let hash = crypto.createHash("sha1");
    try {
        let s = fs.ReadStream(filename);
        s.on("data", data => hash.update(data));
        s.on("end", () => {
            const result = hash.digest("hex");
            return resolve(result);
        });
    } catch (error) {
        return reject(error.message);
    }
});

const getUploadersMazSize = async token => {
    const client = await db.connect();

    const getRoleId = await client.query("SELECT roleid FROM \"Users\" WHERE token = $1", [token]);
    
    // The program still needs to be able to work if no user is logged in
    const roleId = (getRoleId.rows[0] === undefined) ? parseInt(process.env.DEFAULT_ROLE_ID) 
                                                     : getRoleId.rows[0].roleid;


    const getUploadSize = await client.query("SELECT uploadsize FROM \"Roles\" WHERE id = $1", [roleId]);
    await client.release();

    return getUploadSize.rows[0].uploadsize;
};

/**
 * Does your laundry
 * @param {object} req The request object
 * @param {string} fileSha sha representation of the file
 * @returns {object} Your laundry if it exists, or null if it doesn't
 */
const getImageIfExists = async fileSha => {
    const client    = await db.connect();
    const checkFile = await client.query("SELECT filename FROM \"Uploads\" WHERE filesha = $1 AND deleted = FALSE;", [fileSha]);
    client.release();

    return (checkFile.rows[0]) ? checkFile.rows[0] 
                               : null;
}

const addImageToDatabase = async (req, fileSha) => {
    const client = await db.connect();
    let userId = 0

    // Check if the user is logged in and get the ID
    if (req.headers.token !== undefined && req.headers.token !== process.env.DEFAULT_ROLE_NAME) {
        const getUserId = await client.query("SELECT id FROM \"Users\" WHERE token = $1", [req.headers.token]);

        if (getUserId.rows[0]){
            userId = getUserId.rows[0].id;
        } else {
            userId = process.env.DEFAULT_ROLE_ID;
        }
    }

    const insertUpload = await client.query("INSERT INTO \"Uploads\" (filename, userid, uploaddate, filesha) VALUES ($1, $2, NOW(), $3)", [req.file.filename, userId, fileSha]);
    await client.release();
};

const updateFile = async (req, fileSha) => {
    const client = await db.connect();
    // Update the upload date for the already existing file
    await client.query(`UPDATE "Uploads" SET uploaddate = NOW() WHERE filesha = $1`, [fileSha]);
    await client.release();
    // Delete the currently uploaded file
    await unlink(req.file.path);
}

const scanAndRemoveFile = async (file, fileSha) => {
    const scanner = spawn("/opt/sophos-av/bin/savscan", ["-nc", "-nb", "-ss", "-remove", "-archive", "-suspicious", file.path]);

    scanner.stderr.on("data", data => {
        console.log("error", data);
    });

    scanner.on("close", async code => {
        if (code === 0) {
            // The file is clean
            // Do nothing I guess
        } else if (code === 3) {
            // The file got removed
            console.log("Virus");
            const client = await db.connect();
            await client.query(`UPDATE "Uploads" SET deleted = TRUE WHERE filesha = $1`, [fileSha]);
            await client.release();

        } else if (code === 2) {
            // Password protected file and probably some other things
            console.log("Error");
            const client = await db.connect();
            await client.query(`UPDATE "Uploads" SET deleted = TRUE WHERE filesha = $1`, [fileSha]);
            await client.release();
        } else {
            // God knows what
        }
    });
};

const filenamePattern = file => crypto.randomBytes(6)
                                      .toString("hex") + file.originalname;


// UPLOAD
router.post("/", async (req, res) => {
    const storage = multer.diskStorage({
        destination: (req, file, next) => next(null, process.env.UPLOAD_DESTINATION),
        filename:    (req, file, next) => next(null, filenamePattern(file))
    });
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: Number(await getUploadersMazSize(req.headers.token))
        }
    });
    const uploader = upload.single("file");
    
    uploader(req, res, async err => {
        if (err) 
            return res.status( 400 ).send(err.message);

        // To check for uniqueness
        const fileSha = await hashFile(req.file.path);

        const fileExists = await getImageIfExists(fileSha);
        
        let fileName = req.file.filename;

        if (fileExists !== null) {
            fileName = fileExists.filename;
            await updateFile(req, fileSha)
        } else {
            await addImageToDatabase(req, fileSha);
            scanAndRemoveFile(req.file, fileSha);
        }
        
        return res.status(200).send(process.env.UPLOAD_LINK + fileName);
    });
});
export default router;