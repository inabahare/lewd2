import moment from "moment";

const tokenError = error => [{
    "param": "token",
    "msg": error
}];
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
    const now = moment();
    const then = moment(now).add(-1, "days");
    
    // Check if token is more than a day old
    if (!(then < registered && registered < now)) 
        return tokenError("The token is more than a day old");

    // The token is valid :)
    return null;
};
export { checkTokenDataForErrors };
