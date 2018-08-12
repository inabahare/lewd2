import express                     from "express";
import {promisify}                 from 'util';
import fs                          from "fs";
import crypto                      from "crypto";
import formidable                  from "formidable";
import path                        from "path";
import escape                      from "../Functions/Upload/escape";
import async from "async"; 
import dnode from "dnode";
import getUploaderOrDefault        from "../Functions/Upload/getUploaderOrDefault";
import getImageFilenameIfExists    from "../Functions/Upload/getImageFilenameIfExists";
import scanAndRemoveFile           from "../Functions/Upload/scanAndRemoveFile";
import addImageToDatabase          from "../Functions/Upload/addImageToDatabase";
import updateExistingFile          from "../Functions/Upload/updateExistingFile";
import deletionKey                 from "../Functions/Upload/deletionKey";

const router = express.Router();

const unlink   = promisify(fs.unlink);
const readFile = promisify(fs.readFile);
const rename   = promisify(fs.rename);
const fileSizeError = /maxFileSize exceeded, received (\d*) bytes of file data/;


const queue = async.queue(async task => {
    await scanAndRemoveFile(process.env.UPLOAD_DESTINATION + task.name, task.hash);
}, 1);


/**
 * Takes the filename and returns a new name 
 * @param {*} fileName 
 */
const renameFile = fileName => crypto.randomBytes(6)
                                     .toString("hex") + "_" + fileName;

const scanFile = fileName => {
    const externalFunctions = dnode.connect(parseInt(process.env.MESSAGE_SERVER_PORT));
    externalFunctions.on("remote", remote => {
        remote.scan(fileName);
        externalFunctions.end();
    });
}

/**
 * UPLOAD
 */
router.post("/", async (req, res) => {
    const uploader   = await getUploaderOrDefault(req.headers.token);
    
    const form       = new formidable.IncomingForm();
    form.uploadDir   = process.env.UPLOAD_DESTINATION;
    form.encoding    = "utf-8";
    form.hash        = "sha1";
    form.maxFileSize = uploader.uploadsize;

    form.on("error", err => {
        if (fileSizeError.test(err.message)) {
            return res.status(400)
                      .send("The uploaded file is too big");
        }

        return res.status(400)
                  .send("Something went wrong on upload");
    });

    // When file has been uploaded
    form.on("file", async (fields, file) => {
        file.name = escape(file.name);

        // Check if filename is too long
        if (file.name.length > 200) {
            unlink(file.path);
            return res.status(400)
                      .send("The filename is too long");
        }

        file.originalName = file.name;
        file.deletionKey = deletionKey(10);

        // Check if the file exists
        const existingFileName = await getImageFilenameIfExists(file.hash);
        if (existingFileName) { // If file has been uploaded and not deleted
            updateExistingFile(file);
            file.name = existingFileName;
            file.duplicate = true;
        } 
        else { // If file doesn't exist or has been deleted
            file.duplicate = false;
            file.name = await renameFile(file.name);
            await rename(file.path, path.join(form.uploadDir, file.name));
            scanFile(file.name);
        }

        await addImageToDatabase(file, uploader.id);

        const resultJson = {
            "status": 200,
            "data": {
                "link": process.env.UPLOAD_LINK + file.name,
                "deleteionURL": process.env.SITE_NAME + "delete/" + file.deletionKey
            }
        };

        res.send(resultJson);
    });

    form.parse(req);
});

export default router;