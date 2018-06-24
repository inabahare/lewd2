import express                                from "express";
import { constants, registerTokenCalculator } from "../config";
import db                                     from "../helpers/database";
import bcrypt                                 from "bcrypt";
import validator                              from "express-validator";
import { check, validationResult }            from 'express-validator/check';

const router = express.Router();

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
    if (res.locals.user.roleid !== constants.ADMIN_ID)
        return res.render("login");
    
    next();
});

router.use(async (req, res, next) => {
    const client     = await db.connect();
    const getRoles   = await db.query("SELECT id, name FROM \"Roles\";");
    res.locals.roles = getRoles.rows
    await client.release();
    next();
});

router.get("/token", async (req, res) => {
    const registerToken = registerTokenCalculator();
    const client        = await db.connect();
    await db.query("INSERT INTO \"Tokens\" (token) VALUES ($1);", [registerToken]);
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