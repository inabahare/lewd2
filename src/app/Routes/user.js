import express   from "express";
import * as user from "../Controllers/user";

const router = express.Router();

// Check if user is logged in
router.use((req, res, next) => {
    if (!res.locals.user)
        return res.redirect("/login");
    
    next();
});

router.get("/", user.index.get);

router.post("/change-token", user.changeToken.validate,
                             user.changeToken.post);

router.get("/view-uploads", user.viewUploads.get);

router.post("/change-password", user.changePassword.validate, 
                                user.changePassword.post);

router.get("/logout", user.logout.get);

export default router;