import express                      from "express";
import db                           from "../helpers/database";
import { check, validationResult }  from 'express-validator/check';
import crypto                       from "crypto";
import formatUploadSize             from "../Functions/Token/formatUploadSize";
import moment                       from "moment";
import getUsers                     from "../Functions/Admin/getUsers";
import deleteUser                   from "../Functions/Admin/deleteUser";

const router = express.Router();

// Check if user is logged in
router.use((req, res, next) => {
    if (res.locals.user.username === null)
        return res.render("login");
    
    next();
});

router.get("/", async (req, res) => {
    const client     = await db.connect();
    const getUploads = await client.query(`SELECT filename, originalname, deleted, uploaddate, duplicate, virus, passworded, deletionkey  
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

/////////////////
// ADMIN STUFF //
/////////////////
/**
 * By now the user needs to be admin
 */
router.use((req, res, next) => {
    if (res.locals.user.isadmin)
        return next();

    return res.render("login");
});


router.get("/admin/token", async (req, res) => res.render("user", {
                                            menuItem: "token"
                                         }));



/**
 * Generate the tokens a user signs up with
 */
router.post("/admin/token", [
    check("size").exists().withMessage("You need to set an upload size")
                 .isNumeric().withMessage("Upload size must be a number"),

    check("unit").isLength({min: 1, max: 2}).withMessage("Upload unit needs to be a unit")

], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/user/admin/token");
    }

    const uploadSize = formatUploadSize(req.body.size, req.body.unit);

    const registerToken = crypto.createHash("sha1")
                                .update("You can register now" + Date.now().toString())
                                .digest("hex");

    const isAdmin = req.body.isadmin === "on";
    
    const client =  await db.connect();
                    await client.query(`INSERT INTO "RegisterTokens" (token, registered, used, uploadsize, isadmin)
                                        VALUES ($1, NOW(), $2, $3, $4);`, [
                                            registerToken, 
                                            false, 
                                            uploadSize, 
                                            isAdmin
                                       ]);
                    await client.release()
                   


    res.render("user", {
        menuItem: "token",
        registerUrl: process.env.SITE_NAME + "register/" + registerToken
    })
});

router.get("/admin/view-users", async (req, res) => {
    const users = await getUsers();
 
    res.render("user", {
        menuItem: "viewusers",
        users: users
    });
});

router.post("/admin/delete", [
    check("userid").isInt().withMessage("The userid must be a number")
                .not().isIn([0, 1]).withMessage("These users cannot be removed")
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/user/admin/view-users");
    }

    const userid = parseInt(req.body.userid);

    await deleteUser(userid);
    return res.redirect("/user/admin/view-users");
});

export default router;