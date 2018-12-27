import multer                   from "multer";
import fs                       from "fs";
import { promisify }            from "util";
import getUploaderOrDefault     from "../../Functions/Upload/getUploaderOrDefault";
import getImageFilenameIfExists from "../../Functions/Upload/getImageFilenameIfExists";
import addImageToDatabase       from "../../Functions/Upload/addImageToDatabase";
import escape                   from "../../Functions/Upload/escape";
import generateDeletionKey      from "../../Functions/Upload/deletionKey";
import hashFile                 from "../../Functions/Upload/hashFile";
import symlink                  from "../../Functions/Upload/symlink";
import renameFile               from "../../Functions/Upload/renameFile";
import scan                     from "../../Functions/Upload/scan";

const unlink = promisify(fs.unlink);

// Pretty much just how shit needs to get stored
const storageOptions = multer.diskStorage({
    destination: (req, file, next) => next(null, process.env.UPLOAD_DESTINATION),
    filename:    (req, file, next) => next(null, renameFile(escape(file.originalname))) 
});

async function post(req, res) {
    const uploader   = await getUploaderOrDefault(req.headers.token);
    
    if (uploader === null) {
        return res.status(400)
                  .send("You need to be signed in to upload");
    }

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
            await unlink(process.env.UPLOAD_DESTINATION + file.filename);
            await symlink(process.env.UPLOAD_DESTINATION + existingFileName,
                          process.env.UPLOAD_DESTINATION + file.filename);
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
}

export { post }