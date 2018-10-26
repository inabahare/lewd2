import express                     from "express";
import db                          from "../helpers/database";
import moment                      from "moment";
import bcrypt                      from "bcrypt";

import * as user from "../Controllers/user";

const router = express.Router();

// Check if user is logged in
router.use((req, res, next) => {
    if (res.locals.user.username === null)
        return res.render("login");
    
    next();
});

router.get("/", user.index.get);

router.get("/view-uploads", user.viewUploads.get);

router.post("/change-password", user.changePassword.post);

export default router;