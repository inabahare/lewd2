import { check, validationResult } from "express-validator/check";
import crypto                      from "crypto";
import db                          from "../../helpers/database";
import { checkIfUsernameExists }   from "../../Functions/Register/checkIfUsernameExists";

function get(req, res) {
    res.render("user", {
        menuItem: "reset-password"
    });
}

async function post(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/user/admin/reset-password");
    }

    const key = crypto.randomBytes(20)
                      .toString("hex")
                      .slice(0, 20);

    const client = await db.connect();
    await client.query(`INSERT INTO "UpdatePasswordKeys" ("token", "registered", "userId")
                        VALUES ($1, NOW(), (SELECT id FROM "Users" WHERE username = $2));`, 
                        [key, req.body.username]);
    await client.release();
    req.flash("link", `${process.env.SITE_LINK}login/forgot-password/${key}`);

    res.redirect("/user/admin/reset-password");
}

const validate = [
    check("username").isLength({ min: 3 })         .withMessage("Username too short")
                     .custom(checkIfUsernameExists).withMessage("This user does not exist")

];

export { get, post, validate };