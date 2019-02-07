import fs            from "fs";
import { promisify } from "util";
import { db }                from "../../helpers/database";
import logToTransparency from "../../../AntivirusApi/Functions/Transparency/logToTransparency";

const unlink = promisify(fs.unlink);


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

    // Get array of filenames from linkarray
    const fileNames = linkArray.map(l => l.replace(process.env.UPLOAD_LINK, ""));

    const client = await db.connect();

    fileNames.forEach(async fileName => {
        const fullFileName = process.env.UPLOAD_DESTINATION + fileName;

        if (fs.existsSync(fullFileName)) {
            await unlink(fullFileName);
            const fileSha = await client.query(`DELETE FROM "Uploads"
                    WHERE filename = $1 
                    RETURNING filesha;`, [
                fileName
            ]);

            await logToTransparency(fileName, fileSha.rows[0].filesha, "Google/Katt does not approve", "Google/Katt");
        }
    });

    await client.release();
    res.redirect("/user/admin/remove-files");
}

const validate = [

];

export { get, post, validate };