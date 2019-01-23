import multer          from "../../helpers/multer/index";
import { getUploader } from "../../Functions/Upload/getUploaderOrDefault";
import escape          from "../../Functions/Upload/escape";
import renameFile      from "../../Functions/Upload/renameFile";

import { HandleUpload } from "../../Classes/HandleUpload";


// Pretty much just how shit needs to get stored
const storageOptions = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, process.env.UPLOAD_DESTINATION);
    },
    filename:    (req, file, next) => {
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
        let time = process.hrtime();
        const totalTime = process.hrtime();

        console.log(`Starting upload handler`);
        const uploadHandler = new HandleUpload(req, res);
        console.log(`Uploader took ${process.hrtime(time)[1]} nanoseconds\n`);

        time = process.hrtime();

        console.log(`Checking for existing file`);
        await uploadHandler.HandleExistingFile();
        console.log(`File check took ${process.hrtime(time)[1]} nanoseconds\n`);

        time = process.hrtime();

        console.log(`Adding deletion key`);
        uploadHandler.AddDeletionKey();
        console.log(`Deletionkey took ${process.hrtime(time)[1]} nanoseconds\n`);

        time = process.hrtime();

        console.log(`Adding to database`);
        await uploadHandler.AddImageToDatabase(uploader.id);
        console.log(`Adding to database took ${process.hrtime(time)[1]} nanoseconds\n`);

        time = process.hrtime();

        console.log(`Sending result`);
        const resultJson = uploadHandler.GenerateResultJson(process.env.UPLOAD_LINK, process.env.SITE_LINK);
        uploadHandler.HandleSuccess(resultJson);
        console.log(`Result took ${process.hrtime(time)[1]} nanoseconds\n`);

        time = process.hrtime();

        const timeToUpload = process.hrtime(totalTime)[1];

        console.log("<time>");
        console.log(`It took ${timeToUpload} nanoseconds to upload the file: <i>${req.file.filename}</i>`);
        console.log(multerStartString);
        console.log("</time>");
        console.log("</file>");
        // await Upload(req, res, uploader, err);
    });
}

/*
Shitty stats

    Branch 4b3da56894cc4cf232084aa9049de4cc2488f4cd
    inaba@japan:~$ time curl -X POST -F "file=@test.file" -H "token: INSERT_TOKEN_HERE" http://localhost:3000/upload
    {"status":200,"data":{"link":"http://localhost:3000/uploads/87597688bd3a_test.file","deleteionURL":"http://localhost:3000/delete/b7ac5310-1ea2-11e9-b272-776b6b0959a3"}}
    real    1m7.124s
    user    0m0.803s
    sys     0m4.577s

    Branch newest
    inaba@japan:~$ time curl -X POST -F "file=@test.file" -H "token: INSERT_TOKEN_HERE" http://localhost:3000/upload
    {"status":200,"data":{"link":"http://localhost:3000/uploads/6fc71542c0c9_test.file","deleteionURL":"http://localhost:3000/delete/fa805380-1ea2-11e9-beeb-5d080af2f40c"}}
    real    0m53.127s
    user    0m0.920s
    sys     0m4.650s

*/

export { post };
