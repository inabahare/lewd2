import express   from "express";
import * as user from "../Controllers/user";

const router = express.Router();

// Check if user is logged in
router.use((req, res, next) => {
    if (res.locals.user === null)
        return res.redirect("/login");
    
    next();
});

router.get("/", user.index.get);

router.get("/view-uploads", user.viewUploads.get);

router.post("/change-password", user.changePassword.validate, 
                                user.changePassword.post);

router.get("/logout", user.logout.get);

export default router;