function get(req, res) {
    if (res.locals.user){
        res.render("index");
    }        
    else {
        res.render("login");
    }
}

export { get };