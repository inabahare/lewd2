import multer from "multer";
import renameFile from "/Functions/Upload/renameFile";
import { HandleUpload } from "/Classes/HandleUpload";
import { User } from "/DataAccessObjects";


// Pretty much just how shit needs to get stored
const storageOptions = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, process.env.UPLOAD_DESTINATION);
    },
    filename: (req, file, next) => {
        const useShortUrl = req.headers.shorturl == "true";
        const newName = renameFile(file.originalname, useShortUrl);
        next(null, newName);
    }
});

async function post(req, res) {
    if (!req.headers.token) {
        return res.status(400)
            .send("You need to be signed in to upload");
    }

    const uploader = await User.GetIdAndUploadSize(req.headers.token);

    if (!uploader) {
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
            return HandleUpload.HandleError(uploader.uploadsize, res, err);
        }

        const uploadHandler = new HandleUpload(req, res);
        await uploadHandler.HandleExistingFile();
        uploadHandler.AddDeletionKey();
        await uploadHandler.AddImageToDatabase(uploader.id);

        const resultJson = uploadHandler.GenerateResultJson(process.env.UPLOAD_LINK, process.env.SITE_LINK);
        uploadHandler.HandleSuccess(resultJson);

    });
}

export { post };
