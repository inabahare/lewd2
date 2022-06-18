import passport from "/helpers/passport";

function get(req, res) {
  res.render("login");
}

const post = passport.authenticate("local", {
  successRedirect: "/user",
  failureRedirect: "/login",
  failureFlash: "Invalid username or password"
});

export { get, post };