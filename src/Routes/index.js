import express from "express";
import Dnode from "dnode";


const router = express.Router();

router.get("/", (req, res) => res.render("index"));

export default router;