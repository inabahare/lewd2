import express                        from "express";
import { constants, tokenCalculator } from "../config";
import db                             from "../helpers/database";
import bcrypt                         from "bcrypt";
import validator                      from "express-validator";
import { check, validationResult }    from 'express-validator/check';

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
    const client = await db.connect();
    const getRoles = await db.query("SELECT id, name FROM \"Roles\";");
    res.locals.roles = getRoles.rows
    await client.release();
    next();
});

router.use(async (req, res, next) => {
    console.log(res.locals.errors);
    next();
});

router.get("/add-users", (req, res) => res.render("user", {
                                          menuItem: "addusers"
                                      }));

router.get("/view-users", (req, res) => res.render("user", {
                                        menuItem: "viewusers"
                                    }));

router.post("/add-user", [
    check("username").isString()
                     .isLength(3).withMessage("Username needs to be at least 3 characters long"),
    check("password").isString()
                     .isLength({min: 5}).withMessage("Password needs to be at least 5 characters long"),
    check("roleid").isNumeric().withMessage("Invalid role")
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorArray = [];
        errors.array().forEach(error => {
            errorArray[error.param] = error.msg;
        });
        req.session.err = errorArray;
        return res.redirect("/user/add-users");
    }

    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, constants.BCRYPT_SALT_ROUNDS);
    const token    = tokenCalculator(username);
    const roleid   = req.body.roleid;

    const client = await db.connect();
    try {
        await client.query("INSERT INTO \"Users\" (username, password, token, roleid) VALUES ($1, $2, $3, $4);", [username, password, token, roleid]);
    } catch (e) {
        // console.log(e);
    } finally {
        await client.release();
        res.redirect("/user/add-users");
    }
});

export default router;