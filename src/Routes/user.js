import express from "express";
import { constants, tokenCalculator } from "../config";
import db from "../helpers/database";
import bcrypt from "bcrypt";
import crypto from "crypto";

const router = express.Router();

router.use((req, res, next) => {
    if (res.locals.user === null)
        return res.render("login");
    
    next(null);
});

router.get("/", (req, res) => res.render("user", {
                                menuItem: "viewuploads"
                              }));


// By now the user needs to be admin
router.use((req, res, next) => {
    if (res.locals.user.roleid !== constants.ADMIN_ID)
        return res.render("login");
    
    next(null);
});

router.use(async (req, res, next) => {
    const client = await db.connect();
    const getRoles = await db.query("SELECT id, name FROM \"Roles\";");
    res.locals.roles = getRoles.rows
    next(null);
});

router.get("/add-users", (req, res) => res.render("user", {
                                          menuItem: "addusers"
                                      }));

router.get("/view-users", (req, res) => res.render("user", {
                                        menuItem: "viewusers"
                                    }));

router.post("/add-user", async (req, res) => {
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, constants.BCRYPT_SALT_ROUNDS);
    const token    = tokenCalculator(username);
    const roleid   = Number(req.body.roleid);

    const client = await db.connect();
    await client.query("INSERT INTO \"Users\" (username, password, token, roleid) VALUES ($1, $2, $3, $4);", [username, password, token, roleid]);
    await client.release();

    res.redirect("/user/add-users");
});

export default router;