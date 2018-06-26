import express from "express";
import db from "../helpers/database";
import passport from "../helpers/passport";

const router = express.Router();

router.get("/", (req, res) => res.render("login"));

router.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

export default router;