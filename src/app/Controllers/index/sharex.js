function get(req, res) {

    if (!res.locals.user) {
      res.setHeader("content-type", "text/javascript");
      return res.send("You need to be logged in for this");
    }


    res.type("sxcu; charset=utf8");

    const shareXConfig = `{
        "Name": "lewd dot se",
        "DestinationType": "ImageUploader, FileUploader",
        "RequestURL": "${process.env.SITE_LINK}upload",
        "FileFormName": "file",
        "Headers": {
          "token": "${res.locals.user.token}"
        },
        "URL": "$json:data.link$"
      }`;
    
    res.send(shareXConfig);
}

export { get };
