import db                                       from "../../helpers/database";
import bcrypt                                   from "bcrypt";
import { check, validationResult }              from "express-validator/check";
import crypto                                   from "crypto";
import { getTokenData, checkTokenDataForErrors} from "../../Functions/Register/tokenData";
import { checkIfUsernameNotExists }             from "../../Functions/Register/checkIfUsernameExists";

// /:token
async function get(req, res) {
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
}

// /
async function post(req, res) {
    ////////////////////////
    // Catch token errors //
    ////////////////////////
    // Get token data
    const tokenData      = await getTokenData(req.body.token);
    const tokenIsInvalid =  checkTokenDataForErrors(tokenData);
    
    // Report errors
    if (tokenIsInvalid) {
        req.session.err = tokenIsInvalid;
        return res.redirect("/register/" + req.body.token);
    }
    
    ////////////////////////
    // Catch input errors //
    ////////////////////////
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/register/" + req.body.token);
    }

    //////////////////////////
    // Check if user exists // 
    //////////////////////////
    const client = await db.connect();

    const getUser = await client.query(`SELECT username FROM "Users" WHERE username = $1;`, [req.body.username]);
    if (getUser.rows.length === 1) {
        await client.release();

        return res.redirect("/register/" + req.body.token);
    }

    //////////////
    // Add user //
    //////////////
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const token    = crypto.createHash("sha1")
                           .update(username + Date.now().toString())
                           .digest("hex");

    const roleid     = req.body.roleid;
    const uploadSize = tokenData.uploadsize;
    const isAdmin    = tokenData.isadmin;

    await client.query(`INSERT INTO "Users" (username, password, token, roleid, uploadsize, isadmin)
                        VALUES ($1, $2, $3, $4, $5, $6);`, [
                            username, 
                            password, 
                            token, 
                            roleid, 
                            uploadSize,
                            isAdmin
                        ]);

    await client.query(`UPDATE "RegisterTokens" SET used = TRUE WHERE token = $1;`, [req.body.token]);
    await client.release();

    req.flash("userAdded", "You are now ready to sign in");
    res.redirect("/");
}

const validate = [
    check("token").isString().withMessage("Invalid token")
                  .isLength({min: 10}).withMessage("Token too short"),

    check("username").isLength({min: 2}).withMessage("Username needs to be at least 2 characters long")
                     .custom(checkIfUsernameNotExists).withMessage("Username already in use"),

    check("password").exists().withMessage("Please select a password")
                     .isLength({min: 3, max: 72}).withMessage("Password needs to be 2 characters long")

];

export { get, post, validate };