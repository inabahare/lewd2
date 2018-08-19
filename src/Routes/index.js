import express from "express";

const router = express.Router();

router.get("/",             (req, res) => res.render("index"));
router.get("/info",         (req, res) => res.render("info"));
router.get("/transparency", (req, res) => res.render("transparency"));


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