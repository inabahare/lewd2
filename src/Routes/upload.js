import express from "express";
import multer from "multer";
import { storageConfig } from "../config";
import db from "../helpers/database";

const router = express.Router();

const getUploadersMazSize = async token => {
    const client = await db.connect();

    const getRole = await client.query("SELECT role FROM \"Users\" WHERE token = $1", [token]);
    
    // The program still needs to be able to work if no user is logged in
    const role = (getRole.rows[0] === undefined) ? token 
                                                 : getRole.rows[0].role;


    const getUploadSize = await client.query("SELECT uploadsize FROM \"Roles\" WHERE name = $1", [role]);
    await client.release();

    return getUploadSize.rows[0].uploadsize;
};


router.post("/", async(req, res) => {
    const storage = multer.diskStorage(storageConfig);
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: Number(await getUploadersMazSize(req.headers.token))
        }
    });

    const uploader = upload.single("file");
    uploader(req, res, err => {
        if (err) 
            return res.status( 400 ).send( err.message );

        console.log(req.file);
            
        return res.status( 200 ).send( req.file );
    });
});

export default router;