import multer          from "multer";
import { getUploader } from "../../Functions/Upload/getUploaderOrDefault";
import escape          from "../../Functions/Upload/escape";
import renameFile      from "../../Functions/Upload/renameFile";

import { HandleUpload } from "../../Classes/HandleUpload";


// Pretty much just how shit needs to get stored
const storageOptions = multer.diskStorage({
    destination: (req, file, next) => {
        console.log("destination", file);
        console.log("------------------------------");
        next(null, process.env.UPLOAD_DESTINATION);
    },
    filename:    (req, file, next) => {
        console.log("filename", file);
        console.log("------------------------------");
        next(null, renameFile(escape(file.originalname)));
    } 
});

async function post(req, res) {
    if (!req.headers.token) {
        return res.status(400)
                  .send("You need to be signed in to upload");
    }

    console.log("<file>");

    const uploader = await getUploader(req.headers.token);
    
    if (!uploader) {
        return res.status(400)
                  .send("You need to be signed in to upload");
    }
    const multerStart = process.hrtime();
    
    const upload = multer({ 
        storage: storageOptions,
        limits: {
            fileSize: uploader.uploadsize
        }
    }).single("file");

    const multerStartTime = process.hrtime(multerStart);

    const multerStartString = `It took ${multerStartTime} to start multer`;

    upload(req, res, async err => {
        if (err) {
            return HandleUpload.HandleError(uploader.uploadsize, res, err);
        }
        const time = process.hrtime();

        const uploadHandler = new HandleUpload(req, res);
        await uploadHandler.AddHash();
        await uploadHandler.HandleExistingFile();
              uploadHandler.AddDeletionKey();
        await uploadHandler.AddImageToDatabase(uploader.id);

        const resultJson = uploadHandler.GenerateResultJson(process.env.UPLOAD_LINK, process.env.SITE_LINK);
        uploadHandler.HandleSuccess(resultJson);
        
        const timeToUpload = process.hrtime(time)[1];

        console.log("<time>");
        console.log(`It took ${timeToUpload} nanoseconds to upload the file: <i>${req.file.filename}</i>`);
        console.log(multerStartString);
        console.log("</time>");
        console.log("</file>");
        // await Upload(req, res, uploader, err);
    });
}

export { post };
