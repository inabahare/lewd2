import { check, validationResult } from "express-validator";
import { User } from "/DataAccessObjects";

// Are the password and password checker identical?
const isPasswordsIdentical = (value, { req }) => {
    if (req.body["new-password"] !== req.body["password-check"]) {
        throw new Error("Passwords does not match");
    } else {
        return true;
    }
};

async function post(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/user");
    }

    const checkData = {
        userId: res.locals.user.id,
        password: req.body["old-password"]
    };
    // Check for invalid password
    const passwordCheck = await User.ComparePassword(checkData);

    if (!passwordCheck) {
        req.flash("incorrectOldPassword", "Your old password is incorrect");
        return res.redirect("/user");
    }

    const data = {
        newPassword: req.body["new-password"],
        userId: res.locals.user.id
    };

    await User.ChangePassword(data);

    // Return
    req.flash("passwordChanged", "Your password has now been updated");
    return res.redirect("/user");
}

const validate = [
    check("old-password")
        .exists().withMessage("Your old password is incorrect")
        .isLength({ min: 3, max: 72 }).withMessage("Must be more than 3 characters long"),
    check("new-password")
        .exists().withMessage("Please supply a password")
        .isLength({ min: 3, max: 72 }).withMessage("Password needs to be 2 characters long")
        .custom(isPasswordsIdentical).withMessage("The provided passwords must be the same"),
    check("password-check")
        .exists().withMessage("Password checker is incorrect")
        .isLength({ min: 3, max: 72 }).withMessage("Must be more than 3 characters long"),

];

export { post, validate };