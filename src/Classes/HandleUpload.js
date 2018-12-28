import fs                       from "fs";
import { promisify }            from "util";
import getImageFilenameIfExists from "../Functions/Upload/getImageFilenameIfExists";
import addImageToDatabase       from "../Functions/Upload/addImageToDatabase";
import generateDeletionKey      from "../Functions/Upload/deletionKey";
import hashFile                 from "../Functions/Upload/hashFile";
import symlink                  from "../Functions/Upload/symlink";
import scan                     from "../Functions/Upload/scan";
 
const unlink = promisify(fs.unlink);

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

    async AddHash() {
        this.file.hash = await hashFile(this.file.path);
    }

    AddDeletionKey() {
        this.file.deletionKey = generateDeletionKey(10);
    }

    async HandleExistingFile() {
        const existingFileName = await getImageFilenameIfExists(this.file.hash);
        if (existingFileName) { // If file has been uploaded and not deleted
            await this.fileExists(this.file, existingFileName);
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
                "link": uploadLink + this.file.filename,
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
    async fileExists(existingFileName, destination) {
        await unlink(destination + this.file.filename);
        await symlink(destination + existingFileName,
                      destination + this.file.file.filename);
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