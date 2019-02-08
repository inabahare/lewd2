function get(req, res) {
    if (res.locals.user){
        res.render("index", {
            js: ["index"]
        });
    }        
    else {
        res.redirect("/login");
    }
}

export { get };