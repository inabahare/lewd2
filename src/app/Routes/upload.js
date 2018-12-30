import express     from "express";
import * as upload from "../Controllers/upload";

const router = express.Router();

router.use((req, res, next) => {
    if (res.locals.user == null) {
        return res.status(403)
                  .send("You need to be logged in to upload");
    }

    next();
});

router.post("/", upload.index.post);

export default router;