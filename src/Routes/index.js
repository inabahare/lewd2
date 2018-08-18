import express from "express";
import Dnode from "dnode";


const router = express.Router();

router.get("/", (req, res) => res.render("index"));

router.get("/lewd.sxcu", (req, res) => {
    res.type('sxcu; charset=utf8');
    const shareXConfig = `{
        "Name": "Local",
        "DestinationType": "ImageUploader, FileUploader",
        "RequestURL": "${process.env.UPLOAD_LINK}",
        "FileFormName": "file",
        "Headers": {
          "token": "${res.locals.user.token}"
        },
        "URL": "$json:data.link$"
      }`;

    res.send(shareXConfig);
});

export default router;