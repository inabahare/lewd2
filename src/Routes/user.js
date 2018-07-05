import express                                from "express";
import { registerTokenCalculator }            from "../config";
import db                                     from "../helpers/database";
import { check, validationResult }            from 'express-validator/check';

const router = express.Router();

// Check if user is logged in
router.use((req, res, next) => {
    if (res.locals.user === null)
        return res.render("login");
    
    next();
});

router.get("/", (req, res) => res.render("user", {
                                menuItem: "viewuploads"
                              }));


// By now the user needs to be admin
router.use((req, res, next) => {
    if (res.locals.user.roleid !== process.env.ADMIN_ID)
        return res.render("login");
    
    next();
});

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

router.post("/token", [
    check("roleid").isNumeric().withMessage("Invalid role id")
], async (req, res) => {
    const registerToken = registerTokenCalculator();
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