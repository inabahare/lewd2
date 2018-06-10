import express from "express";
import multer from "multer";
import { storageConfig, constants} from "../config";
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

const addImageToDatabase = async req => {
    const client = await db.connect();

    const getUserId = await client.query("SELECT id FROM \"Users\" WHERE token = $1", [req.headers.token]);
    const userId = getUserId.rows[0].id;

    const insertUpload = await client.query("INSERT INTO \"Uploads\" (filename, userid, uploaddate) VALUES ($1, $2, NOW())", [req.file.filename, userId]);
    await client.release();
}

router.post("/", async (req, res) => {
    const storage = multer.diskStorage(storageConfig);
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: Number(await getUploadersMazSize(req.headers.token))
        }
    });

    const uploader = upload.single("file");
    uploader(req, res, async err => {
        if (err) 
            return res.status( 400 ).send( err.message );

        // If the person is logged in
        if (req.headers.token !== constants.DEFAULT_TOKEN)
            addImageToDatabase(req);
            
        return res.status(200).send(req.file);
    });
});

export default router;