import { query } from "../../Functions/database";
import moment   from "moment";

const tokenError = error => [{
    "param": "token",
    "msg": error
}];

/**
 * Get token data from database
 * @param {string} token 
 */
const getTokenData = async token => {
    const getClient = await query(`SELECT registered, used, roleid, uploadsize, isadmin
                                   FROM "RegisterTokens"
                                   WHERE token = $1;`, [token]);
    
    return getClient[0];   
};

/**
 * 
 * @param {object} tokenData data from the getTokenData function
 * @returns {object} An error object if there are errors, and null if there aren't 
 */
const checkTokenDataForErrors = tokenData => {
    // Token not found
    if (!tokenData) 
        return tokenError("The token wasn't found");

    // Token used
    if (tokenData.used) 
        return tokenError("The token has already been used");

    const registered = moment(tokenData.registered);
    const now        = moment();
    const then       = moment(now).add(-1, "days");
    
    // Check if token is more than a day old
    if (!(then < registered && registered < now)) 
        return tokenError("The token is more than a day old");

    // The token is valid :)
    return null;
};

export { getTokenData as getTokenData };
export { checkTokenDataForErrors as checkTokenDataForErrors };
