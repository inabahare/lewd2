import express from "express";
import db from "../helpers/database";
import passport from "../helpers/passport";

const router = express.Router();

router.get("/", (req, res) => res.render("login"));

router.post("/login", passport.authenticate("local", {
    successReditect: "/",
    failureRedirect: "/login"
}))

export default router;