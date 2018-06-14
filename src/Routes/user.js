import express from "express";
import { constants } from "../config";

const router = express.Router();

router.get("/", (req, res) => {
    if (res.locals.user === null)
        return res.render("login");
    
    res.render("user", {
        menuItem: "viewuploads"
    });
});

router.get("/add-user", (req, res) => {
    if (res.locals.user === null)
        return res.render("login");

    if (res.locals.user.roleid !== constants.ADMIN_ID)
        return res.render("login");

    res.render("user", {
        menuItem: "addusers"
    });
});

export default router;