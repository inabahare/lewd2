import { query } from "/Functions/database";
import { check, validationResult } from "express-validator/check";
import { User } from "/DataAccessObjects";

// /forgot-password/:token
async function get(req, res) {
    // Get user info
    const getUserInfo = await query(`SELECT "userId", "UpdatePasswordKeys"."key", username
                                    FROM "UpdatePasswordKeys", "Users"
                                    WHERE "UpdatePasswordKeys"."key" = $1
                                    AND registered > NOW() - '${process.env.HOW_OLD_PASSWORD_RESET_TOKENS_CAN_BE}'::INTERVAL
                                    AND "userId" = id;`, 
                                    [ req.params.token ]);
    
    res.render("change-password", {
        user: getUserInfo.length === 0 ? null
                                       : getUserInfo[0]
    });
}

const passwordCheck = (value, { req }) => {
    if (req.body["new-password"] !== req.body["password-check"]) {
        throw new Error("Passwords does not match");
    } else {
        return true;
    }
};

// /reset-password
async function post(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/login/forgot-password/" + req.body.token);
    }

    // TODO: No need to select username. It is not used
    const getUserInfo = await query(`SELECT id, username
                                    FROM "UpdatePasswordKeys", "Users"
                                    WHERE "UpdatePasswordKeys"."key" = $1
                                    AND registered > NOW() - '${process.env.HOW_OLD_PASSWORD_RESET_TOKENS_CAN_BE}'::INTERVAL
                                    AND "userId" = id;`, 
                                    [ req.body.token ]);

    // If this is all bullshit
    if (getUserInfo.length === 0) {
        res.send("Congratulations on finding the secret message. You have the honour of telling the developer that a proper error needs to be implemented.");
        return;
    }
    const user = getUserInfo[0];

    const data = {
        newPassword: req.body["new-password"],
        userId: user.id
    };

    await User.ChangePassword(data);
    
    // Clear login tokens
    await query(`DELETE FROM "LoginTokens"        WHERE  userid  = $1;`, [user.id]);
    await query(`DELETE FROM "UpdatePasswordKeys" WHERE "userId" = $1;`, [user.id]);

    req.flash("userAdded", "Your password has been updated");
    res.redirect("/");
}

const validate = [
    check("new-password").exists().withMessage("Please select a password")
                         .isLength({min: 2, max: 72}).withMessage("Password needs to be 2 characters long")
                         .custom(passwordCheck).withMessage("The two passwords must be the same"),
    check("password-check").exists().withMessage("Please select a password")
                           .isLength({min: 2, max: 72}).withMessage("Password needs to be 2 characters long")
                           .custom(passwordCheck).withMessage("The two passwords must be the same"),
    check("token").exists().withMessage("You need to supply a valid token")                              

];

export { get, post, validate };