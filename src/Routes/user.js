import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    if (res.locals.user === null)
        return res.render("login");
    
    return res.render("user");
});

export default router;