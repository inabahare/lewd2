import { check, validationResult } from "express-validator/check";
import { User, LoginToken, UpdatePasswordKeys } from "/DataAccessObjects";
import { PasswordToken } from "/DataAccessObjects";

// /forgot-password/:token
async function get(req, res) {
  // Get user info
  const userInfo = await PasswordToken.GetUserInfo(req.params.token);

  res.render("change-password", {
    user: userInfo
  });
}

const passwordCheck = (value, { req }) => {
  if (req.body["new-password"] !== req.body["password-check"]) {
    throw new Error("Passwords does not match");
  } else {
    return true;
  }
};

// /reset-password
async function post(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.err = errors.array();
    return res.redirect("/login/forgot-password/" + req.body.token);
  }

  const user = await PasswordToken.GetUserInfo(req.body.token);

  // If this is all bullshit
  if (!user) {
    res.send("Congratulations on finding the secret message. You have the honour of telling the developer that a proper error needs to be implemented.");
    return;
  }

  const data = {
    newPassword: req.body["new-password"],
    userId: user.userId
  };


  // I don't really see any reason for awaiting these 
  User.ChangePassword(data);

  // Clear login tokens
  LoginToken.DeleteUserTokens(user.userId);
  UpdatePasswordKeys.DeleteUsersKeys(user.userId);

  req.flash("userAdded", "Your password has been updated");
  res.redirect("/");
}

const validate = [
  check("new-password")
    .exists().withMessage("Please select a password")
    .isLength({ min: 2, max: 72 }).withMessage("Password needs to be 2 characters long")
    .custom(passwordCheck).withMessage("The two passwords must be the same"),
  check("password-check")
    .exists().withMessage("Please select a password")
    .isLength({ min: 2, max: 72 }).withMessage("Password needs to be 2 characters long")
    .custom(passwordCheck).withMessage("The two passwords must be the same"),
  check("token")
    .exists().withMessage("You need to supply a valid token")

];

export { get, post, validate };