import fs                       from "fs";
import { promisify }            from "util";
import path                     from "path";
import { getFilenameAndAmount } from "/Functions/Upload/getImageFilenameIfExists";
import addImageToDatabase       from "/Functions/Upload/addImageToDatabase";
import generateDeletionKey      from "/Functions/Upload/deletionKey";
import symlink                  from "/Functions/Upload/symlink";
import scan                     from "/Functions/Upload/scan";

const unlink = promisify(fs.unlink);

function FormatFileName(fileName) {
    return encodeURI(fileName);
           // .replace(/'/g, "%27");
}

class HandleUpload {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.file = req.file;
    }

    static FormatFileName(fileName) {
        return FormatFileName(fileName);
    }

    // async AddHash() {
    //     // this.file.hash = await hashFile(this.file.path);
    // }

    AddDeletionKey() {
        this.file.deletionKey = generateDeletionKey(10);
    }

    async HandleExistingFile() {
        const existingFile = await getFilenameAndAmount(this.file.hash);

        if (existingFile) { 
            const file = existingFile[0];

            // If file has been uploaded and not deleted
            // This is to prevent too many hardlinks
            // The ++ is because existingFile.amount contains the amount in the database
            if ((parseInt(file.amount) + 1) > parseInt(process.env.UPLOAD_MAX_HARDLINKS)) {
                this.res.status(500)
                     .send("Too many duplicates");
                return;
            }

            await this.fileExists(file.filename, this.file.destination);
        } 
        else { // If file doesn't exist or has been deleted
            this.newFile(this.file);
        }
    }

    async AddImageToDatabase(userId) {
        await addImageToDatabase(this.file, userId);
    }


    GenerateResultJson(uploadLink, siteLink) {
        return {
            "status": 200,
            "data": {
                "link": uploadLink + FormatFileName(this.file.filename),
                "deleteionURL": siteLink + "delete/" + this.file.deletionKey
            }
        };
    }

    HandleSuccess(resultJson) {
        if (this.req.body.js === "false") {
            this.req.flash("uploadData", JSON.stringify(resultJson));
            this.res.redirect("/");
        } else {
            this.res.send(resultJson);
        }
    }

    /**
     * If the file already exists then remove the upload and add a symbolic link to the existing file
     * @param {*} file 
     * @param {*} existingFileName 
     */
    async fileExists(existingFileName) {
        const currentFilePath  = path.join(this.file.destination, this.file.filename);
        const existingFilePath = path.join(this.file.destination, existingFileName);

        await unlink(currentFilePath);
        await symlink(existingFilePath, currentFilePath);
        
        this.file.duplicate = true;
    }

    /**
     * If the file doesn't exit then just scan it
     * @param {*} file 
     */
    newFile(file) {
        file.duplicate = false;
        scan(file.filename, file.hash);
    }


    static HandleError(uploadSize, err) {
        if (err.message === "File too large") {
            return this.res.status(400)
                           .send(`You can't upload more than ${uploadSize / 1000} kB`);
        }
        return err;
    }
}

export { HandleUpload };