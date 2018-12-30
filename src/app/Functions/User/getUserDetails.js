import db from "../../helpers/database";

/**
 * Gets the user currently logged in
 * @param {string} token If falsy the stock user will be returned
 */ 
const getUserDetails = async loginToken => {
    let userId = 0;

    const client  = await db.connect();

    const loginTokenCheck = await db.query(`SELECT userid FROM "LoginTokens" WHERE token = $1 LIMIT 1;`, [loginToken]);

    if (loginTokenCheck.rows[0])
        userId = loginTokenCheck.rows[0].userid;



    const getUser = await client.query(`SELECT "Users".id, "Users".username, "Users".token, "Users".roleid, "Users".uploadsize, "Users".isadmin
                                        FROM "Users"
                                        WHERE "Users".id = $1`, [
                                            userId
                                        ]);
                    await client.release();

    if (getUser.rows[0].username === "null")
        getUser.rows[0].username = null;
    
    return getUser.rows[0];
};

export default getUserDetails;