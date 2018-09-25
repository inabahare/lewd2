import express                     from "express";
import crypto                      from "crypto";
import escape                      from "../Functions/Upload/escape";
import multer                      from "multer";
import dnode                       from "dnode";
import getUploaderOrDefault        from "../Functions/Upload/getUploaderOrDefault";
import getImageFilenameIfExists    from "../Functions/Upload/getImageFilenameIfExists";
import addImageToDatabase          from "../Functions/Upload/addImageToDatabase";
import updateExistingFile          from "../Functions/Upload/updateExistingFile";
import generateDeletionKey         from "../Functions/Upload/deletionKey";
import hashFile                    from "../Functions/Upload/hashFile";
import bodyParser from "body-parser";

const router = express.Router();

/**
 * Takes the filename and returns a new name 
 * @param {*} fileName 
 */
const renameFile = fileName => crypto.randomBytes(6)
                                     .toString("hex") + "_" + fileName;

                                     
/**
 * Scans a file with sophos and gets a file report from VirusTotal
 */
const scan = (fileName, fileHash) => {
    const external = dnode.connect(parseInt(process.env.MESSAGE_SERVER_PORT));
    external.on("remote", remote => {
        remote.sophosScan(fileName);
        remote.virusTotalScan(fileHash, fileName, 1);
        external.end();
    });
}



const storageOptions = multer.diskStorage({
    destination: (req, file, next) => next(null, process.env.UPLOAD_DESTINATION),
    filename:    (req, file, next) => next(null, renameFile(escape(file.originalname))) 
});

/**
 * UPLOAD
 */
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
            console.log(err);
            return;
        }

        const file = req.file;

        if (!file) {
            return res.status(400)
                      .send(`You need to select a file to upload`);
        }
        
        file.hash = await hashFile(file.path);

        const existingFileName = await getImageFilenameIfExists(file.hash);
        if (existingFileName) { // If file has been uploaded and not deleted
            updateExistingFile(file);
            file.filename  = existingFileName;
            file.duplicate = true;
        } 
        else { // If file doesn't exist or has been deleted
            file.duplicate = false;
            scan(file.filename, file.hash);
        }
    
        file.deletionKey = generateDeletionKey(10);

        await addImageToDatabase(file, uploader.id);

        const resultJson = {
            "status": 200,
            "data": {
                "link": process.env.UPLOAD_LINK + file.filename,
                "deleteionURL": process.env.SITE_LINK + "delete/" + file.deletionKey
            }
        };
        if (req.body.js === "false") {
            req.flash("uploadData", JSON.stringify(resultJson));
            res.redirect("/");
        } else {
            res.send(resultJson);
        }
    });
});

export default router;