function get(req, res) {
    if (res.locals.user){
        res.render("index");
    }        
    else {
        res.redirect("/login");
    }
}

export { get };