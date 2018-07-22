import express                             from "express";
import db                                  from "../helpers/database";
import bcrypt                              from "bcrypt";
import { check, validationResult }         from 'express-validator/check';
import moment                              from "moment";
import crypto                              from "crypto";

const router = express.Router();

const tokenError = error => [{
    "param": "token",
    "msg": error
}];

router.get("/", async (req, res) => {
    res.render("notoken");
});

/**
 * Get token data from database
 * @param {string} token 
 */
const getTokenData = async token => {
    const client    = await db.connect();
    const getClient = await client.query(`SELECT registered, used, roleid, uploadsize
                                          FROM "RegisterTokens"
                                          WHERE token = $1;`, [token]);
                      await client.release();

    return getClient.rows[0];   
}

/**
 * 
 * @param {object} tokenData data from the getTokenData function
 * @returns {object} An error object if there are errors, and null if there aren't 
 */
const checkTokenDataForErrors = tokenData => {
    // Token not found
    if (!tokenData) 
        return tokenError("The token wasn't found");

    // Token used
    if (tokenData.used) 
        return tokenError("The token has already been used");

    const registered = moment(tokenData.registered);
    const now        = moment();
    const then       = moment(now).add(-1, "days");
    
    // Check if token is more than a day old
    if (!(then < registered && registered < now)) 
        return tokenError("The token is more than a day old");

    // The token is valid :)
    return null;
};

router.get("/:token", async (req, res) => {
    // Get token data
    const tokenData      = await getTokenData(req.params.token);
    const tokenIsInvalid =  checkTokenDataForErrors(tokenData);
    
    // Report errors
    if (tokenIsInvalid) {
        req.session.err = tokenIsInvalid;
        return res.redirect("/");
    }

    // No errors, show the register page
    res.render("register", {
        token: req.params.token
    });
});

const checkIfUsernameExists = value => {
    return db.query(`SELECT username FROM "Users" WHERE username = $1;`, [value])
             .then(res => {
                 if (req.body[0])
                    return Promise.resolve();

                return Promise.reject("Username already in use");
             })
             .catch(e => {
                if (typeof e === "string")
                    return Promise.reject();

                return Promise.resolve();
            });
};

router.post("/", [
    check("token").isString().withMessage("Invalid token")
                  .isLength({min: 10}).withMessage("Token too short"),

    check("username").isLength({min: 2}).withMessage("Username needs to be at least 2 characters long")
                    .custom(checkIfUsernameExists).withMessage("Username taken"),

    check("password").exists().withMessage("Please select a username")
                     .isLength({min: 2}).withMessage("Password needs to be 2 characters long")
] , async (req, res) => {
    ////////////////////////
    // Catch token errors //
    ////////////////////////
    // Get token data
    const tokenData      = await getTokenData(req.body.token);
    const tokenIsInvalid =  checkTokenDataForErrors(tokenData);
    console.log(req.body);
    // Report errors
    if (tokenIsInvalid) {
        req.session.err = tokenIsInvalid;
        return res.redirect("/");
    }
    
    ////////////////////////
    // Catch input errors //
    ////////////////////////
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/register/" + req.body.token);
    }

    //////////////
    // Add user //
    //////////////
    
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const token    = crypto.createHash("sha1")
                            .update(username + Date.now().toString())
                            .digest("hex");;
    const roleid = req.body.roleid;
    const uploadSize = tokenData.uploadsize;


    const client = await db.connect();
    await client.query(`INSERT INTO "Users" (username, password, token, roleid, uploadsize)
                        VALUES ($1, $2, $3, $4, $5);`, [username, password, token, roleid, uploadSize]);

    await client.query(`UPDATE "RegisterTokens" SET used = TRUE WHERE token = $1;`, [req.body.token]);
    await client.release();

    req.flash('userAdded', 'You have now signed up');
    res.redirect("/");
});

export default router;