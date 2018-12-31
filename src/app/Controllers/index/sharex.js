function get(req, res) {
    res.type("sxcu; charset=utf8");
    const shareXConfig = `{
        "Name": "Local",
        "DestinationType": "ImageUploader, FileUploader",
        "RequestURL": "${process.env.SITE_LINK}upload",
        "FileFormName": "file",
        "Headers": {
          "token": "${res.locals.user.token}"
        },
        "URL": "$json:data.link$"
      }`;
    
    if (res.locals.user) {
      res.send(shareXConfig);
    }
    else {
      res.send("You need to be logged in for this");
    }
}

export { get };
