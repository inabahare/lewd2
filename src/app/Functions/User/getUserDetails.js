import { db } from "../../helpers/database";

/**
 * Gets the user currently logged in
 * @param {string} token If false the stock user will be returned
 */ 
const getUserDetails = async loginToken => {
    const client = await db.connect();
    let userId = 0;

    let getUser = null;

    try {
        const loginTokenCheck = await client.query(`SELECT userid FROM "LoginTokens" WHERE token = $1 LIMIT 1;`, [loginToken]);
    
        if (loginTokenCheck.rows[0])
            userId = loginTokenCheck.rows[0].userid;
    
        getUser = await client.query(`SELECT "Users".id, "Users".username, "Users".token, "Users".roleid, "Users".uploadsize, "Users".isadmin, "Users"."TokenGenerated"
                                      FROM "Users"
                                      WHERE "Users".id = $1`, [
                                          userId
                                      ]);
    }
    catch(ex) {
        console.error(`Failed to select userid from LoginTokens or selecting user with error: ${ex.message}`);
    }
    finally {
        await client.release();
    }

    if (!getUser)
        return null;

    if (getUser.rows.length == 0)
        return null;
    
    return getUser.rows[0];
};

export default getUserDetails;