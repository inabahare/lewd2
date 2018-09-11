import express                     from "express";
import {promisify}                 from 'util';
import fs                          from "fs";
import crypto                      from "crypto";
import formidable                  from "formidable";
import path                        from "path";
import escape                      from "../Functions/Upload/escape";
import multer                      from "multer";
import async                       from "async"; 
import dnode                       from "dnode";
// import formidable from "express-formidable"
import getUploaderOrDefault        from "../Functions/Upload/getUploaderOrDefault";
import getImageFilenameIfExists    from "../Functions/Upload/getImageFilenameIfExists";
import scanAndRemoveFile           from "../Functions/Upload/scanAndRemoveFile";
import addImageToDatabase          from "../Functions/Upload/addImageToDatabase";
import updateExistingFile          from "../Functions/Upload/updateExistingFile";
import deletionKey                 from "../Functions/Upload/deletionKey";
import hashFile                    from "../Functions/Upload/hashFile";

const router = express.Router();

const unlink   = promisify(fs.unlink);
const rename   = promisify(fs.rename);
const fileSizeError = /maxFileSize exceeded, received (\d*) bytes of file data/;

/**
 * Takes the filename and returns a new name 
 * @param {*} fileName 
 */
const renameFile = fileName => crypto.randomBytes(6)
                                     .toString("hex") + "_" + fileName;


const externalFunctions = dnode.connect(parseInt(process.env.MESSAGE_SERVER_PORT));
const scanFile = fileName => {
    externalFunctions.on("remote", remote => {
        remote.scan(fileName);
        externalFunctions.end();
    });
}

const storageOptions = multer.diskStorage({
    destination: (req, file, next) => next(null, process.env.UPLOAD_DESTINATION),
    filename:    (req, file, next) => next(null, renameFile(escape(file.originalname))) 
});

router.post("/", async (req, res) => {
    const uploader   = await getUploaderOrDefault(req.headers.token);
    
    const upload = multer({ 
        storage: storageOptions,
        limits: {
            fileSize: uploader.uploadsize
        }
    }).single("file");

    upload(req, res, async err => {
        if (err) {
            if (err.message === "File too large") {
                return res.status(400)
                          .send(`You can't upload more than ${uploader.uploadsize / 1000} kB`);
            }
        }

        const file = req.file;
        file.hash = await hashFile(file.path);

        const existingFileName = await getImageFilenameIfExists(file.hash);
        
        if (existingFileName) { // If file has been uploaded and not deleted
            updateExistingFile(file);
            file.filename = existingFileName;
            file.duplicate = true;
        } 
        else { // If file doesn't exist or has been deleted
            file.duplicate = false;
            scanFile(file.path);
        }
    
        console.log(file);
        file.deletionKey = deletionKey(10);

        await addImageToDatabase(file, uploader.id);

        const resultJson = {
            "status": 200,
            "data": {
                "link": process.env.UPLOAD_LINK + file.filename,
                "deleteionURL": process.env.SITE_LINK + "delete/" + file.deletionKey
            }
        };

        res.send(resultJson);
    });
});

/**
 * UPLOADn n
 */
// router.post("/", async (req, res) => {
//     const uploader   = await getUploaderOrDefault(req.headers.token);
//     console.log(res.locals);

//     const form       = new formidable.IncomingForm({
//         uploadDir  :process.env.UPLOAD_DESTINATION,
//         encoding   :"utf-8",
//         hash       :"sha1",
//         maxFileSize: uploader.uploadsize
//     });

//     form.parse(req, async (err, fields, file) => {
//         if (err) {
//             return res.status(400)
//                       .send(err);
//         }

//         file.name = escape(file.name);

//         // Check if filename is too long
//         if (file.name.length > 200) {
//             unlink(file.path);
//             return res.status(400)
//                       .send("The filename is too long");
//         }

//         file.originalName = file.name;
//         file.deletionKey = deletionKey(10);

//         // Check if the file exists
//         const existingFileName = await getImageFilenameIfExists(file.hash);
//         if (existingFileName) { // If file has been uploaded and not deleted
//             updateExistingFile(file);
//             file.name = existingFileName;
//             file.duplicate = true;
//         } 
//         else { // If file doesn't exist or has been deleted
//             file.duplicate = false;
//             file.name = await renameFile(file.name);
//             await rename(file.path, path.join(form.uploadDir, file.name));
//             scanFile(file.name);
//         }

//         await addImageToDatabase(file, uploader.id);

//         const resultJson = {
//             "status": 200,
//             "data": {
//                 "link": process.env.UPLOAD_LINK + file.name,
//                 "deleteionURL": process.env.SITE_LINK + "delete/" + file.deletionKey
//             }
//         };

//         res.send(resultJson);
//     });
// });

export default router;