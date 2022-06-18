import { check, validationResult } from "express-validator";
import formatUploadSize from "/Functions/Token/formatUploadSize";
import { RegisterToken } from "/DataAccessObjects";

function get(req, res) {
  res.render("user", {
    menuItem: "token"
  });
}

async function post(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.err = errors.array();
    return res.redirect("/user/admin/token");
  }

  // Generate user information
  const uploadSize = formatUploadSize(req.body.size, req.body.unit);
  const isAdmin = req.body.isadmin === "on";

  const data = { uploadSize, isAdmin };

  const registerToken = await RegisterToken.Add(data);

  res.render("user", {
    menuItem: "token",
    registerUrl: process.env.SITE_LINK + "register/" + registerToken
  });
}

const validate = [
  check("size")
    .exists().withMessage("You need to set an upload size")
    .isNumeric().withMessage("Upload size must be a number")
    .isInt({
      gt: 1,
      lt: 9999
    }).withMessage("Upload size can't be less than 2 bytes or greater than 1TB (0.91TiB)"),

  check("unit")
    .isLength({ min: 1, max: 3 }).withMessage("Upload unit needs to be a valid unit")
    .isIn(["B", "kB", "MB", "GB", "KiB", "MiB", "GiB"]).withMessage("Upload unit needs to be a valid unit")
];

export { get, post, validate };