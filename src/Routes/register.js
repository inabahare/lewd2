import express                             from "express";
import { constants, loginTokenCalculator } from "../config";
import db                                  from "../helpers/database";
import bcrypt                              from "bcrypt";
import validator                           from "express-validator";
import { check, validationResult }         from 'express-validator/check';
import moment                              from "moment";

const router = express.Router();

/*
const checkToken = async value => {
    const client   = await db.client();
    const getToken = await client.query("SELECT token FROM \"Tokens\" WHERE token = $1 AND used = FALSE AND registered > NOW() - '1 day'::INTERVAL;", [value]);
    await client.release();
    console.log("getToken.rows[0]");
    if (getToken.rows[0]) {
        return true;
    } else {
        return false;
    }
};
*/

const checkToken = (value, { req }) => {
    return db.query("SELECT token, registered, roleid, used FROM \"Tokens\" WHERE token = $1;", [value])
    .then((res) => {
        const token = res.rows[0];
        
        if (token.used === true) {
            return Promise.reject("This token has already been used");
        }

        const registered = moment(token.registered);
        const now  = moment();
        const then = moment(now).add(-1, "days");
        
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

const checkIfUsernameExists = value => db.query("SELECT username FROM \"Users\" WHERE username = $1", [value])
                                         .then(res => Promise.reject("User found"))
                                         .catch(e => {
                                            if (typeof e === "string")
                                                return Promise.reject();
                                
                                            return Promise.resolve();
                                         });


router.get("/", (req, res, next) => res.render("register"));

router.post("/", [
    check("username").isString()
                     .isLength(3).withMessage("Username needs to be at least 3 characters long")
                     .custom(checkIfUsernameExists).withMessage("That name is already taken"),
    check("password").isString()
                     .isLength({min: 5}).withMessage("Password needs to be at least 5 characters long"),
    check("token").exists()         .withMessage("Cannot be empty")
                  .isLength({min: 10}).withMessage("Needs to be at least 10 characters long")
                  .custom(checkToken)
], async (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    
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
    try {
        await client.query("INSERT INTO \"Users\" (username, password, token, roleid) VALUES ($1, $2, $3, $4);", [username, password, token, roleid]);
        await client.query("UPDATE \"Tokens\" SET used = TRUE WHERE token = $1;", [req.body.token]);
    } catch (e) {
        console.log(e);
    } finally {
        await client.release();
        res.redirect("/user/add-users");
    }
});

export default router;