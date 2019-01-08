import moment         from "moment";
import { getUploads } from "../../Functions/User/getUploads";

async function get(req, res) {
    const uploads = await getUploads(res.locals.user.id);
    let count = 0;

    // If there are dates then format them
    if (uploads) {
        count = uploads.length;
        uploads.forEach(upload => {
            upload.uploaddate = moment(upload.uploaddate)
                               .format("DD-MM-YYYY HH:mm:xss");
        });
    }

    res.render("user", {
        menuItem: "view-uploads",
        uploads: uploads,
        count: count
    });
}

export { get };
