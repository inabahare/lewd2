import { User } from "/DataAccessObjects";


function get(req, res) {
  res.render("user", {
    menuItem: "finduser"
  });
}

async function post(req, res) {
  const fileName = req.body.filename;
  const uploaders = await User.FindUser(fileName);

  res.render("user", {
    menuItem: "finduser",
    post: true, // Using this to check for post request. It's too late and I can't be bothered to think of any other way to make it go "no users found :<". Yes it will be dirty but I will fix later (never)
    uploaders: uploaders
  });
}

export { get, post };

