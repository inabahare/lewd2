import { query } from "/Functions/database"; 
import bcrypt from "bcrypt";
import { check, validationResult } from "express-validator/check";
import { getTokenData, checkTokenDataForErrors} from "/Functions/Register/tokenData";
import { checkIfUsernameNotExists } from "/Functions/Register/checkIfUsernameExists";
import uuid from "uuid/v1";

// Are the password and password checker identical?
const isPasswordsIdentical = (value, { req }) => {
    if (req.body["password"] !== req.body["password-check"]) {
        throw new Error("Passwords do not match");
    } else {
        return true;
    }
};

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
    const getUser = await query(`SELECT username FROM "Users" WHERE username = $1;`, [req.body.username]);
    
    if (getUser) {
        return res.redirect("/register/" + req.body.token);
    }

    //////////////
    // Add user //
    //////////////
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const token    = uuid();

    const roleid     = req.body.roleid;
    const uploadSize = tokenData.uploadsize;
    const isAdmin    = tokenData.isadmin;

    const data = [
        username, 
        password, 
        token, 
        roleid, 
        uploadSize,
        isAdmin
    ];

    await query(`INSERT INTO "Users" (username, password, token, roleid, uploadsize, isadmin, "TokenGenerated")
                    VALUES ($1, $2, $3, $4, $5, $6, NOW());`, data);

    await query(`DELETE FROM "RegisterTokens" WHERE token = $1;`, [req.body.token]);
    

    req.flash("userAdded", "You are now ready to sign in");
    res.redirect("/");
}

const validate = [
    check("token").isString().withMessage("Invalid token")
                  .isLength({min: 10}).withMessage("Token too short"),

    check("username").isLength({min: 3, max: 30}).withMessage("Username needs to be between 3 and 30 characters long")
                     .custom(checkIfUsernameNotExists).withMessage("Username already in use"),

    check("password").exists().withMessage("Please select a password")
                     .isLength({min: 3, max: 72}).withMessage("Password needs to be between 3 and 72 characters long")
                     .custom(isPasswordsIdentical),

    check("password-check").exists().withMessage("Please write the password once again")
                           .isLength({min: 3, max: 72}).withMessage("The secondary password check also needs to be between 3 and 72 characters")
                           .custom(isPasswordsIdentical)
];

export { get, post, validate };