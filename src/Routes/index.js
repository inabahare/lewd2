import express                from "express";
import getAllFromTransparency from "../Functions/Transparency/getAllFromTransparency";

const router = express.Router();

// Transform the result json from string to array
// For the benifit of those who have JS disabled
router.use((req, res, next) => {
  if (res.locals.message)
    if (res.locals.message.uploadData)
      res.locals.message.uploadData = JSON.parse(res.locals.message.uploadData);
  
  next();
})

router.get("/",     (req, res) => res.render("index"));
router.get("/info", (req, res) => res.render("info"));

router.get("/transparency", async (req, res) => {
    const transparency = await getAllFromTransparency();
    
    res.render("transparency", {
        transparencyElements: transparency
    });
});


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