import { getUploads } from "../../Functions/Admin/getAllTheFiles";
import { convertNumberToBestByteUnit } from "../../Functions/convertNumberToBestByteUnit";
import moment from "moment";


async function get(req, res) {
    const uploads = await getUploads();
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
        menuItem: "view-all-uploads",
        uploads: uploads,
        count: count,
        js: ["viewUploads"]
    });
}

export { get };