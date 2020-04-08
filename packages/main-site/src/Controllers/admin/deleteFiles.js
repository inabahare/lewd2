import fs from "fs";
import { logToTransparency } from "/Functions/Transparency/logToTransparency";
import { Uploads } from "/DataAccessObjects";


function get(req, res) {
    res.render("user", {
        menuItem: "remove-files"
    });
}

async function post(req, res) {
    const linkArray = req.body.theLinks.split("\r\n");

    if (!linkArray[0]) {
        return;
    }

    // Get array of filenames from link array
    const fileNames = linkArray.map(l => l.replace(process.env.UPLOAD_LINK, ""));

    for (const fileName of fileNames) {
        const fullPath = Uploads.GetFullPath(fileName);
        if (fs.existsSync(fullPath)) {
            const deleteData = await Uploads.DeleteFile (fileName);
            await logToTransparency(fileName, deleteData[0].filesha, "Google/Katt does not approve", "Google/Katt"); // TODO: Something about htis
        }
    }

    res.redirect("/user/admin/remove-files");
}

const validate = [

];

export { get, post, validate };