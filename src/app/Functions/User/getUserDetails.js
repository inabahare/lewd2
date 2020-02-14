import { query } from "../../Functions/database";

/**
 * Gets the user currently logged in
 * @param {string} token If false the stock user will be returned
 */ 
const getUserDetails = async loginToken => {
    let userId = 0;

    const loginTokenCheck = await query(`SELECT userid FROM "LoginTokens" WHERE token = $1 LIMIT 1;`, [loginToken]);

    if (loginTokenCheck[0])
        userId = loginTokenCheck[0].userid;

    const getUser = await query(`SELECT "Users".id, "Users".username, "Users".token, "Users".roleid, "Users".uploadsize, "Users".isadmin, "Users"."TokenGenerated"
                                 FROM "Users"
                                 WHERE "Users".id = $1`, [ userId ]);

    if (!getUser)
        return null;

    
    return getUser[0];
};

export default getUserDetails;