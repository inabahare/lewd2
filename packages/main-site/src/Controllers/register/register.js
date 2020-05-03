import { check, validationResult } from "express-validator/check";
import { checkTokenDataForErrors } from "/Functions/Register/tokenData";
import { User, RegisterToken } from "/DataAccessObjects";

// Are the password and password checker identical?
const isPasswordsIdentical = (value, { req }) => { // TODO: Make it's own function
    if (req.body["password"] !== req.body["password-check"]) {
        throw new Error("Passwords do not match");
    } else {
        return true;
    }
};

// /:token
async function get(req, res) {
    // Get token data
    const tokenData = await RegisterToken.GetTokenData(req.params.token);
    const tokenIsInvalid = checkTokenDataForErrors(tokenData);

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
    const tokenData = await RegisterToken.GetTokenData(req.body.token);
    const tokenIsInvalid = checkTokenDataForErrors(tokenData);

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
    const userExists = await User.CheckIfUserExists(req.body.username);

    if (userExists) {
        return res.redirect("/register/" + req.body.token);
    }

    //////////////
    // Add user //
    //////////////
    const data = {
        username: req.body.username,
        password: req.body.password,
        uploadSize: tokenData.uploadsize,
        isAdmin: tokenData.isadmin
    };

    await User.Create(data);

    RegisterToken.Remove(req.body.token);

    req.flash("userAdded", "You are now ready to sign in");
    res.redirect("/");
}

const validate = [
    check("token").isString().withMessage("Invalid token")
        .isLength({ min: 10 }).withMessage("Token too short"),

    check("username")
        .isLength({ min: 3, max: 30 }).withMessage("Username needs to be between 3 and 30 characters long")
        .custom(async userName => {
            const result = await User.CheckIfUserExists(userName);
            if (result)
                return Promise.reject()
            return Promise.resolve();
        }).withMessage("Username already in use"),

    check("password").exists().withMessage("Please select a password")
        .isLength({ min: 3, max: 72 }).withMessage("Password needs to be between 3 and 72 characters long")
        .custom(isPasswordsIdentical),

    check("password-check").exists().withMessage("Please write the password once again")
        .isLength({ min: 3, max: 72 }).withMessage("The secondary password check also needs to be between 3 and 72 characters")
        .custom(isPasswordsIdentical)
];

export { get, post, validate };