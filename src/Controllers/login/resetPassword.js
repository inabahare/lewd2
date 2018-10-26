import db                          from "../../helpers/database";
import { check, validationResult } from "express-validator/check"
import bcrypt                      from "bcrypt";

// /forgot-password/:token
async function get(req, res) {
    // Get user info
    const client      = await db.connect();
    const getUserInfo = await client.query(`SELECT "userId", "UpdatePasswordKeys"."token", username
                                            FROM "UpdatePasswordKeys", "Users"
                                            WHERE "UpdatePasswordKeys"."token" = $1
                                            AND registered > NOW() - '${process.env.HOW_OLD_PASSWORD_RESET_TOKENS_CAN_BE}'::INTERVAL
                                            AND "userId" = id;`, 
                                            [ req.params.token ]);
    
    await client.release();
    res.render("change-password", {
        user: getUserInfo.rows.length === 0 ? null
                                            : getUserInfo.rows[0]
    });
}

const passwordCheck = (value, { req }) => {
    if (req.body["new-password"] !== req.body["password-check"]) {
        throw new Error("Passwords does not match");
    } else {
        return true;
    }
}

// /reset-password
async function post(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/login/forgot-password/" + req.body.token);
    }

    const client      = await db.connect();
    const getUserInfo = await client.query(`SELECT id, username
                                            FROM "UpdatePasswordKeys", "Users"
                                            WHERE "UpdatePasswordKeys"."token" = $1
                                            AND registered > NOW() - '${process.env.HOW_OLD_PASSWORD_RESET_TOKENS_CAN_BE}'::INTERVAL
                                            AND "userId" = id;`, 
                                            [ req.body.token ]);

    // If this is all bullshit
    if (getUserInfo.rows.length === 0) {
        await client.release();
        res.send("Congratulations on finding the secret message. You have the honour of telling the developer that a proper error needs to be implemented.");
        return;
    }
    const user = getUserInfo.rows[0];
    const newPassword = await bcrypt.hash(req.body["new-password"], parseInt(process.env.BCRYPT_SALT_ROUNDS));

    await client.query(`UPDATE "Users" 
                        SET password = $1
                        WHERE id = $2`,  [newPassword, user.id]);
    // Clear login tokens
    await client.query(`DELETE FROM "LoginTokens"        WHERE  userid  = $1;
                        DELETE FROM "UpdatePasswordKeys" WHERE "userId" = $1;`, [user.id]);
    await client.release();

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

]

export { get, post, validate }