import express from "express";
import db from "../helpers/database";

const router = express.Router();

router.get("/", (req, res) => res.render("login"));

export default router;