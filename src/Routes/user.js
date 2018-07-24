import express                      from "express";
import db                           from "../helpers/database";
import { check, validationResult }  from 'express-validator/check';
import crypto                       from "crypto";
import formatUploadSize             from "../Functions/Token/formatUploadSize";
import moment                       from "moment";

const router = express.Router();

// Check if user is logged in
router.use((req, res, next) => {
    if (res.locals.user.username === null)
        return res.render("login");
    
    next();
});

router.get("/", async (req, res) => {
    const client     = await db.connect();
    const getUploads = await client.query(`SELECT filename, originalname, deleted, uploaddate FROM "Uploads" WHERE userid = $1;`, [res.locals.user.id])
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


/**
 * By now the user needs to be admin
 */
router.use((req, res, next) => {
    if (res.locals.user.isadmin)
        return next();

    return res.render("login");
});

/**
 * Select the roles possible for a user ot be
 */
router.use("/token", async (req, res, next) => {
    // Get role ID's
    const client     = await db.connect();
    const getRoles   = await db.query("SELECT id, name FROM \"Roles\";");
    await client.release();

    res.locals.roles = getRoles.rows;
    next();
});

router.get("/token", async (req, res) => res.render("user", {
                                            menuItem: "token"
                                         }));



/**
 * Generate the tokens a user signs up with
 */
router.post("/token", [
    check("size").exists().withMessage("You need to set an upload size")
                 .isNumeric().withMessage("Upload size must be a number"),

    check("unit").isLength({min: 1, max: 2}).withMessage("Upload unit needs to be a unit"),

    check("roleid").isNumeric().withMessage("Invalid role")
                   .exists().withMessage("Role id needs to be set")

], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/user/token");
    }

    const roleId = parseInt(req.body.roleid);
    const uploadSize = formatUploadSize(req.body.size, req.body.unit);

    const registerToken = crypto.createHash("sha1")
                                .update("You can register now" + Date.now().toString())
                                .digest("hex");

    const isAdmin = req.body.isadmin === "on";
    
    const client =  await db.connect();
                    await client.query(`INSERT INTO "RegisterTokens" (token, registered, used, roleid, uploadsize, isadmin)
                                        VALUES ($1, NOW(), $2, $3, $4, $5);`, [
                                            registerToken, 
                                            false, 
                                            roleId, 
                                            uploadSize, 
                                            isAdmin
                                       ]);
                    await client.release()
                   


    res.render("user", {
        menuItem: "token",
        registerUrl: process.env.SITE_NAME + "register/" + registerToken
    })
});

router.get("/view-users", (req, res) => res.render("user", {
                                        menuItem: "viewusers"
                                    }));



export default router;