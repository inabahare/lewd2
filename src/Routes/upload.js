import express from "express";
import multer from "multer";
import { storageConfig } from "../config";
import db from "../helpers/database";

const router = express.Router();

const storage = multer.diskStorage(storageConfig);
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000
    }
});

// Check token
router.use((req, res, next) => {
    console.log(req.body);
    console.log(res.locals.user.uploadSize);
    upload.limits.fileSize = res.locals.user.uploadSize;

    next(null, true);
});

const uploader = upload.single("file");

router.post("/", (req, res) => {
    uploader(req, res, err => {
        if (err) 
            return res.status( 400 ).send( err.message );


        console.log(req.file);
        console.log(req.body);
        return res.status( 200 ).send( req.file );
    });
});

export default router;