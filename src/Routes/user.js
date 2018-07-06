import express                      from "express";
import db                           from "../helpers/database";
import { check, validationResult }  from 'express-validator/check';
import crypto                       from "crypto";

const router = express.Router();

// Check if user is logged in
router.use((req, res, next) => {
    if (res.locals.user === null)
        return res.render("login");
    
    next();
});

router.get("/", async (req, res) => {
    res.render("user", {
        menuItem: "viewuploads"
    })
});


/**
 * By now the user needs to be admin
 */
router.use((req, res, next) => {
    if (res.locals.user.roleid !== parseInt(process.env.ADMIN_ID))
        return res.render("login");
    
    next();
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
    check("roleid").isNumeric().withMessage("Role id must be a number")
], async (req, res) => {
    const registerToken = crypto.createHash("sha1")
                                .update("You can register now" + Date.now().toString())
                                .digest("hex");

    const client        = await db.connect();
    await db.query("INSERT INTO \"Tokens\" (token, roleid) VALUES ($1, $2);", [registerToken, req.body.roleid]);
    await client.release();

    res.render("user", {
        menuItem: "token",
        token: registerToken
    })
});

router.get("/view-users", (req, res) => res.render("user", {
                                        menuItem: "viewusers"
                                    }));



export default router;