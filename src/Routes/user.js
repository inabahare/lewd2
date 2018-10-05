import express                     from "express";
import db                          from "../helpers/database";
import moment                      from "moment";
import bcrypt                      from "bcrypt";

const router = express.Router();

// Check if user is logged in
router.use((req, res, next) => {
    if (res.locals.user.username === null)
        return res.render("login");
    
    next();
});

router.get("/", (req, res) => res.render("user", { menuItem: "index"}));

router.get("/view-uploads", async (req, res) => {
    const client     = await db.connect();
    const getUploads = await client.query(`SELECT filename, originalname, uploaddate, duplicate, virus, passworded, deletionkey  
                                           FROM "Uploads" 
                                           WHERE userid = $1
                                           ORDER BY id ASC;`, [res.locals.user.id])
                       await client.release();

    // If there are dates then format them
    if (getUploads.rows[0]) {
        getUploads.rows.forEach(upload => {
            upload.uploaddate = moment(upload.uploaddate).format("LL");
        });
    }


    res.render("user", {
        menuItem: "viewuploads",
        uploads: getUploads.rows
    })
});

router.post("/change-password", async (req, res) => {
    // Get password
    const client          = await db.connect();
    const getPassword     = await client.query(`SELECT password FROM "Users" WHERE id = $1;`, [res.locals.user.id]);
    const currentPassword = getPassword.rows[0].password;

    // Check password
    const passwordCheck = await bcrypt.compare(req.body["old-password"], currentPassword)
    
    if (!passwordCheck) {
        req.flash("incorrectOldPassword", "Your old password is incorrect");
        return res.redirect("/user");
    }
    
    // Change password
    const newPassword = await bcrypt.hash(req.body["new-password"], parseInt(process.env.BCRYT_SALT_ROUNDS));

    await client.query(`UPDATE "Users" SET password = $1 WHERE id = $2;`, [newPassword, res.locals.user.id]);
    await client.release();
    
    // Return
    req.flash("passwordChanged", "Your password has now been updated");
    res.redirect("/user");
});


export default router;