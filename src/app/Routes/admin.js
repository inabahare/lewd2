import express    from "express";
import * as admin from "../Controllers/admin";

const router = express.Router();

/////////////////
// ADMIN STUFF //
/////////////////
/**
 * By now the user needs to be admin
 */
router.use((req, res, next) => {
    if (!res.locals.user) {
        return res.redirect("/login");
    }

    if (!res.locals.user.isadmin) {
        return res.redirect("/");
    }

    next();
});

/////////////////////
// TOKEN GENERATOR //
/////////////////////

router.get("/token",  admin.token.get);
router.post("/token", admin.token.validate, 
                      admin.token.post);

////////////////////
// PASSWORD RESET //
////////////////////
router.get("/reset-password",       admin.resetPassword.get);
router.post("/generate-reset-link", admin.resetPassword.validate, 
                                    admin.resetPassword.post);

///////////////////////////////
// DELETE/UPDATE USERS/FILES //
///////////////////////////////
router.get("/view-users", admin.deleteUsers.get);
router.post("/delete",    admin.deleteUsers.validate, 
                          admin.deleteUsers.post);

router.post("/update", admin.updateUser.validate, 
                       admin.updateUser.post);

router.get("/remove-files",  admin.deleteFiles.get);
router.post("/remove-files", admin.deleteFiles.post);

router.get("/find-user-by-file",  admin.findUser.get);
router.post("/find-user-by-file", admin.findUser.post);


export default router;