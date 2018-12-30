import moment                      from "moment";
import db                          from "../../helpers/database";

async function get(req, res) {
    const client     = await db.connect();
    const getUploads = await client.query(`SELECT filename, originalname, uploaddate, duplicate, virus, passworded, deletionkey  
                                           FROM "Uploads" 
                                           WHERE userid = $1
                                           ORDER BY id ASC;`, [res.locals.user.id]);
                       await client.release();

    // If there are dates then format them
    if (getUploads.rows[0]) {
        getUploads.rows.forEach(upload => {
            upload.uploaddate = moment(upload.uploaddate).format("LL");
        });
    }

    res.render("user", {
        menuItem: "view-uploads",
        uploads: getUploads.rows
    });
}

export { get };