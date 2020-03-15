import moment from "moment";
import { getUploads } from "/Functions/User/getUploads";
import { convertNumberToBestByteUnit } from "/Functions/convertNumberToBestByteUnit";

async function get(req, res) {
    const uploads = await getUploads(res.locals.user.id);
    let count = 0;

    // If there are dates then format them
    if (uploads) {
        count = uploads.length;
        uploads.forEach(upload => {
            upload.uploaddate = moment(upload.uploaddate)
                               .format("YYYY-MM-DD HH:mm:ss");

            upload.size = convertNumberToBestByteUnit(upload.size);
        });
    }

    res.render("user", {
        menuItem: "view-uploads",
        uploads: uploads,
        count: count,
        js: ["viewUploads"]
    });
}

export { get };
