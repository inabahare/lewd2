import { check, validationResult } from "express-validator/check";
import { updateUser }              from "../../Functions/Admin/updateUser";


async function post(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.err = errors.array();
        return res.redirect("/user/admin/view-users");
    }

    const userId     = parseInt(req.body.id);
    const uploadSize = parseInt(req.body.uploadsize);
    const isAdmin    = req.body.isadmin === "on";

    // This is just so no one fucks with the default admin user :p
    if (req.body.username == process.env.ADMIN_DEFAULT_USERNAME && !isAdmin) {
        req.flash("AdminRightsRemovedFromAdmin", "This dude needs to be admin");
        return res.redirect("/user/admin/view-users");
    } 

    await updateUser(userId, uploadSize, isAdmin);

    req.flash("UserUpdated", `The user <i>${req.body.username}</i> has been updated`);
    res.redirect("/user/admin/view-users");
}

const validate = [
    check("id").isNumeric().withMessage("UserId needs to be a number"),
    check("uploadsize").isNumeric().withMessage("Upload size needs to be a number")
];

export { post, validate };