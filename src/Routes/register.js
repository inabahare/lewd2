import express                             from "express";
import { constants, loginTokenCalculator } from "../config";
import db                                  from "../helpers/database";
import bcrypt                              from "bcrypt";
import validator                           from "express-validator";
import { check, validationResult }         from 'express-validator/check';
import moment                              from "moment";

const router = express.Router();

const checkToken = (value, { req }) => {
    return db.query("SELECT token, registered, roleid, used FROM \"Tokens\" WHERE token = $1;", [value])
    .then((res) => {
        const token = res.rows[0];
        
        if (token.used === true) {
            return Promise.reject("This token has already been used");
        }

        const registered = moment(token.registered);
        const now        = moment();
        const then       = moment(now).add(-1, "days");
        
        // Check if token is more than a day old
        if (!(then < registered && registered < now)) {
            return Promise.reject("This token is more than 1 day old");
        }

        req.body.roleid = token.roleid;
        return Promise.resolve();
    }).catch(e => {
        if (typeof e === "string")
            return Promise.reject(e);

        return Promise.reject("Token not found");
    });
};

const checkIfUsernameExists = value => {
    return db.query("SELECT username FROM \"Users\" WHERE username = $1", [value])
             .then(res => {
                Promise.reject("Username already in use");
             })
             .catch(e => {
                if (typeof e === "string")
                    return Promise.reject();

                return Promise.resolve();
            });
};


router.get("/", (req, res, next) => res.render("register"));

router.post("/", [
    check("username").exists()                     .withMessage("Please select a username")
                     .isLength({min: 3})           .withMessage("Username needs to be at least 3 characters long")
                     .custom(checkIfUsernameExists).withMessage("That name is already taken"),

    check("password").exists()          .withMessage("Please select a password")
                     .isLength({min: 4}).withMessage("Password needs to be at least 4 characters long"),

    check("token").exists()           .withMessage("Please enter a token")
                  .custom(checkToken)
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/register");
    }

    /// SELECT token FROM "Tokens" WHERE used = FALSE AND registered > NOW() - '1 day'::INTERVAL;

    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, constants.BCRYPT_SALT_ROUNDS);
    const token    = loginTokenCalculator(username);
    const roleid   = req.body.roleid;

    const client = await db.connect();

    await client.query("INSERT INTO \"Users\" (username, password, token, roleid) VALUES ($1, $2, $3, $4);", [username, password, token, roleid]);
    await client.query("UPDATE \"Tokens\" SET used = TRUE WHERE token = $1;", [req.body.token]);

    await client.release();
    res.redirect("/user/add-users");
});

export default router;