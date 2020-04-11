import fs from "fs";
import { Uploads, Transparency } from "/DataAccessObjects";


function get(req, res) {
  res.render("user", {
    menuItem: "remove-files"
  });
}

async function post(req, res) {
  const linkArray = req.body.theLinks.split("\r\n");

  if (!linkArray[0]) {
    return;
  }

  // Get array of filenames from link array
  const fileNames = linkArray.map(l => l.replace(process.env.UPLOAD_LINK, ""));

  for (const fileName of fileNames) {
    const fullPath = Uploads.GetFullPath(fileName);
    if (fs.existsSync(fullPath)) {
      const deleteData = await Uploads.DeleteFile (fileName);
      
      const transparencyData = {
        fileName: fileName, 
        fileHash: deleteData[0].filesha, 
        reason: "Google/Katt does not approve", 
        origin: "Google/Katt" // TODO: Softcode this
      };

      Transparency.Add(transparencyData);
    }
  }

  res.redirect("/user/admin/remove-files");
}

const validate = [

];

export { get, post, validate };