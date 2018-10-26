import crypto                      from "crypto";
import { check, validationResult } from 'express-validator/check';
import db                          from "../../helpers/database";
import formatUploadSize            from "../../Functions/Token/formatUploadSize";

function get(req, res) {
    res.render("user", {
        menuItem: "token"
    });
}

async function post(req, res) {
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
}

const validate = [
    check("size").exists()   .withMessage("You need to set an upload size")
                 .isNumeric().withMessage("Upload size must be a number")
                 .isInt()    .withMessage("Upload size needs to be a number")
                 .isLength({
                     min: 1,
                     max: 999999999999
                 }).withMessage("Upload size can't be less than 1 byte or greater than 1TB (0.91TiB)"),

    check("unit").isLength({ min: 1, max: 3 }).withMessage("Upload unit needs to be a valid unit")
                 .isIn([ "B", "kB", "MB", "GB", "KiB", "MiB", "GiB" ]).withMessage("Upload unit needs to be a valid unit")
]

export { get, post, validate }