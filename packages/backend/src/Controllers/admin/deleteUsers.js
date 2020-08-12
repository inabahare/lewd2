import { check, validationResult } from "express-validator";
import { User } from "/DataAccessObjects";

async function get(req, res) {
    const users = await User.GetAllUsers();

    res.render("user", {
        menuItem: "view-users",
        users: users
    });
}

async function post(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/user/admin/view-users");
    }

    // Get information about deletion
    const userId = parseInt(req.body.userid);
    const deleteFiles = req.body.deleteFiles === "on";

    await User.DeleteUser(userId, deleteFiles);

    req.flash("UserDeleted", `<i>${req.body.username}</i> has now been purged`);
    return res.redirect("/user/admin/view-users");
}

const validate = [
    check("userid").isInt().withMessage("The userid must be a number")
        .not().isIn([0, 1]).withMessage("These users cannot be removed")

];

export { get, post, validate };