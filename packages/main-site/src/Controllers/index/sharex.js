function get(req, res) {

    if (!res.locals.user) {
      res.setHeader("content-type", "text/javascript");
      res.status(401);
      return res.send("You need to be logged in for this");
    }


    res.type("sxcu; charset=utf8");

    const shareXConfig = `{
        "Name": "${process.env.SITE_NAME}",
        "DestinationType": "ImageUploader, FileUploader",
        "RequestURL": "${process.env.SITE_LINK}upload",
        "FileFormName": "file",
        "Headers": {
          "token": "${res.locals.user.token}",
          "shortUrl": "false"
        },
        "URL": "$json:data.link$"
      }`;
    
    res.send(shareXConfig);
}

export { get };
