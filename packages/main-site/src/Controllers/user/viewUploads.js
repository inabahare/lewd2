import moment from "moment";
import { convertNumberToBestByteUnit } from "/Functions/convertNumberToBestByteUnit";
import { Uploads } from "/DataAccessObjects";

async function get(req, res) {
    const uploads = await Uploads.GetAllByUserId(res.locals.user.id); // TODO: Uploads
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
