import moment         from "moment";
import { getUploads } from "../../Functions/User/getUploads";

async function get(req, res) {
    const uploads = await getUploads(res.locals.user.id);

    // If there are dates then format them
    if (uploads) {
        uploads.forEach(upload => {
            upload.uploaddate = moment(upload.uploaddate).format("LL");
        });
    }

    res.render("user", {
        menuItem: "view-uploads",
        uploads: uploads
    });
}

export { get };
