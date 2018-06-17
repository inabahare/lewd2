import express from "express";
import { constants } from "../config";
import db from "../helpers/database";

const router = express.Router();

router.use((req, res, next) => {
    if (res.locals.user === null)
        return res.render("login");
    
    next(null);
});

router.get("/", (req, res) => res.render("user", {
                                menuItem: "viewuploads"
                              }));


// By now the user needs to be admin
router.use((req, res, next) => {
    if (res.locals.user.roleid !== constants.ADMIN_ID)
        return res.render("login");
    
    next(null);
});

router.use(async (req, res, next) => {
    const client = await db.connect();
    const getRoles = await db.query("SELECT id, name FROM \"Roles\";");
    res.locals.roles = getRoles.rows
    next(null);
});

router.get("/add-user", (req, res) => res.render("user", {
                                          menuItem: "addusers"
                                      }));

router.get("/view-users", (req, res) => res.render("user", {
                                        menuItem: "viewusers"
                                    }));

                                    
export default router;