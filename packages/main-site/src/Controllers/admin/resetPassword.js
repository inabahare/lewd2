import { check, validationResult } from "express-validator/check";
import { PasswordToken } from "/DataAccessObjects";
import { User } from "/DataAccessObjects";

function get(req, res) {
    res.render("user", {
        menuItem: "reset-password"
    });
}

async function post(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/user/admin/reset-password");
    }

    const key = await PasswordToken.GenerateKey(req.body.username);

    req.flash("link", `${process.env.SITE_LINK}login/forgot-password/${key}`);
    res.redirect("/user/admin/reset-password");
}

const validate = [
    check("username")
        .isLength({ min: 3 }).withMessage("Username too short")
        .custom(async userName => {
            const userExists = await User.CheckIfUserExists(userName);
            if (userExists)
                return Promise.resolve();

            return Promise.reject();
        }).withMessage("This user does not exist")
];

export { get, post, validate };