import db from "../../helpers/database";

/**
 * Gets the user currently logged in
 * @param {string} token If falsy the stock user will be returned
 */ 
const getUserDetails = async loginToken => {
    let query = "";

    if (loginToken) {
        query = `SELECT "Users".id, "Users".username, "Users".token, "Users".roleid, "Users".uploadsize
                 FROM "Users", "LoginTokens"
                 WHERE "Users".id = "LoginTokens".userid
                 AND "LoginTokens".token = $1`;
    } else {
        loginToken = "default";
        query      = `SELECT "Users".id, "Users".username, "Users".token, "Users".roleid, "Users".uploadsize
                      FROM "Users", "LoginTokens"
                      WHERE "Users".password = $1;`;
    }

    const client  = await db.connect();
    const getUser = await client.query(query, [
                                            loginToken
                                        ]);
                    await client.release();

    if (getUser.rows[0].username === "null")
        getUser.rows[0].username = null
    
    return getUser.rows[0];
};

export default getUserDetails;