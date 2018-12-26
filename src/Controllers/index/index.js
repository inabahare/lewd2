function get(req, res) {
    if (res.locals.user.username){
        res.render("index");
    }        
    else {
        res.render("login");
    }
}

export { get }