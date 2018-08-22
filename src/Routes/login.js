import express                     from "express";
import db                          from "../helpers/database";
import passport                    from "../helpers/passport";
import { check, validationResult } from "express-validator/check"

const router = express.Router();

router.get("/", (req, res) => res.render("login"));

router.post("/", passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/login",
    failureFlash: "Invalid username or password"
}));

export default router;