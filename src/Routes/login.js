import express                     from "express";
import db                          from "../helpers/database";
import passport                    from "../helpers/passport";
import { check, validationResult } from "express-validator/check"

const router = express.Router();

router.use((req, res, next) => {
    if (req.session.flash.error) {
        res.locals.error = req.session.flash.error[0];
        console.log(req.session.flash.error);
        delete req.session.flash.error;
    }
    next();
})

router.get("/", (req, res) => res.render("login"));

router.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: "Invalid username or password"
}));

export default router;