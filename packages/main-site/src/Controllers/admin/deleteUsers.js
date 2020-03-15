import { check, validationResult } from "express-validator/check";
import getUsers                    from "/Functions/Admin/getUsers";
import deleteUser                  from "/Functions/Admin/deleteUser";


async function get(req, res) {
    const users = await getUsers();

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
    const userid      = parseInt(req.body.userid);
    const deleteFiles = req.body.deleteFiles === "on";

    await deleteUser(userid, deleteFiles);
    req.flash("UserDeleted", `<i>${req.body.username}</i> has now been purged`);
    return res.redirect("/user/admin/view-users");
}

const validate = [
    check("userid").isInt()           .withMessage("The userid must be a number")
                   .not().isIn([0, 1]).withMessage("These users cannot be removed")

];

export { get, post, validate };