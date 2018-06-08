import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    console.log(res.locals.user)
    res.render("index");
});

export default router;