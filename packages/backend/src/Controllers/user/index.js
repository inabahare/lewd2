async function get(req, res) {
    res.render("user", { 
        menuItem: "index"
    });
}

export { get };