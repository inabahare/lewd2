import { query } from "../../Functions/database"; 
import moment                      from "moment";
import { check, validationResult } from "express-validator/check";
import uuid from "uuid/v1";

async function checkToken(value, { req }) {
    const dbData = await query(`SELECT token, "TokenGenerated" from "Users" WHERE id = $1 AND token = $2;`, [ parseInt(req.body.id), value ]);
    
    if (dbData.length !== 1) {
        return Promise.reject("Token not found");
    }

    const { TokenGenerated } = dbData[0];
    const now = moment();

    // If the time the token got generate is later than now
    const tokeCantRegenerate = moment(TokenGenerated).isAfter(now);

    if (tokeCantRegenerate) {
        return Promise.reject("You need to wait until you can generate a new token");
    }

    return Promise.resolve();
}

async function post(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.err = errors.array();

        return res.redirect("/user");
    }

    const { token } = req.body;
    const newUuid = uuid();

    await query(`UPDATE "Users" SET token = $1, "TokenGenerated" = NOW() + '1 days'::INTERVAL WHERE token = $2`, [ newUuid, token ]);

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