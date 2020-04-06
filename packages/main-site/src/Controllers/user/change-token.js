import { check, validationResult } from "express-validator/check";
import { Token } from "/DataAccessObjects";

async function checkToken(value, { req }) {
  const userId = parseInt(req.body.id);

  const tokenValidation = await Token.CheckTokenValid(userId, value);

  if (tokenValidation === 0) {
    return Promise.resolve();
  }

  if (tokenValidation === 1) {
    return Promise.reject("You need to supply a token");
  }

  if (tokenValidation === 2) {
    return Promise.reject("You have to wait a day to be able to change token");
  }
}

async function post(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.err = errors.array();

    return res.redirect("/user");
  }

  const { token } = req.body;

  await Token.UpdateTokenToNew(token);

  req.flash("token", "Your token has been updated");
  return res.redirect("/user");
}

const validate = [
  check("id").exists().withMessage("You must supply an id")
             .isNumeric().withMessage("Invalid id"),
  check("token").exists().withMessage("You must supply a token")
                .custom(checkToken)
               
];

export { post, validate }; 