function get(req, res) {
    res.type("sxcu; charset=utf8");

    if (!res.locals.user) {
      return res.send("You need to be logged in for this");
    }

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
    
    res.send(shareXConfig);
}

export { get };
