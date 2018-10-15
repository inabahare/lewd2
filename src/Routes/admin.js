import express                     from "express";
import db                          from "../helpers/database";
import { check, validationResult } from 'express-validator/check';
import crypto                      from "crypto";
import formatUploadSize            from "../Functions/Token/formatUploadSize";
import getUsers                    from "../Functions/Admin/getUsers";
import deleteUser                  from "../Functions/Admin/deleteUser";
import { promisify }               from 'util';
import fs                          from "fs";
import logToTransparency           from "../Functions/Transparency/logToTransparency";

const router = express.Router();
const unlink = promisify(fs.unlink);

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

router.get("/token", async (req, res) => res.render("user", {
    menuItem: "token"
}));

/**
 * Generate the tokens a user signs up with
 */
router.post("/token", [
    check("size").exists()   .withMessage("You need to set an upload size")
                 .isNumeric().withMessage("Upload size must be a number")
                 .isInt()    .withMessage("Upload size needs to be a number")
                 .isLength({
                     min: 1,
                     max: 999999999999
                 }).withMessage("Upload size can't be less than 1 byte or greater than 1TB (0.91TiB)"),

    check("unit").isLength({ min: 1, max: 3 }).withMessage("Upload unit needs to be a valid unit")
                 .isIn([ "B", "kB", "MB", "GB", "KiB", "MiB", "GiB" ]).withMessage("Upload unit needs to be a valid unit")
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/user/admin/token");
    }

    // Generate user information
    const uploadSize    = formatUploadSize(req.body.size, req.body.unit);
    const isAdmin       = req.body.isadmin === "on";
    const registerToken = crypto.createHash("sha1")
                                .update("You can register now" + Date.now().toString())
                                .digest("hex");

    
    // Insert said user
    const client = await db.connect();
    await client.query(`INSERT INTO "RegisterTokens" (token, registered, used, uploadsize, isadmin)
                        VALUES ($1, NOW(), $2, $3, $4);`, [registerToken,
                                                           false,
                                                           uploadSize,
                                                           isAdmin]);
    await client.release();

    res.render("user", {
        menuItem: "token",
        registerUrl: process.env.SITE_LINK + "register/" + registerToken
    });
});

router.get("/view-users", async (req, res) => {
    const users = await getUsers();

    res.render("user", {
        menuItem: "viewusers",
        users: users
    });
});

router.post("/delete", [
    check("userid").isInt()           .withMessage("The userid must be a number")
                   .not().isIn([0, 1]).withMessage("These users cannot be removed")
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/user/admin/view-users");
    }

    // Get information about deletion
    const userid      = parseInt(req.body.userid);
    const deleteFiles = req.body.deleteFiles === "on";

    await deleteUser(userid, deleteFiles);
    return res.redirect("/user/admin/view-users");
});

router.get("/remove-files", (req, res) => {
    res.render("user", {
        menuItem: "removefiles"
    });
});

router.post("/remove-files", async (req, res) => {
    const linkArray = req.body.theLinks.split("\r\n");

    if (!linkArray[0]) {
        return;
    }

    const fileNames = linkArray.map(l => l.replace(process.env.UPLOAD_LINK, ""));

    console.log(fileNames);

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
});

export default router;