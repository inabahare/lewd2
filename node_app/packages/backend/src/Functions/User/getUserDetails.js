import { LoginToken, User } from "/DataAccessObjects";

/**
 * Gets the user currently logged in
 * @param {string} token If false the stock user will be returned
 */
export const getUserDetails = async loginToken => {
  const userId = await LoginToken.GetUserId(loginToken);

  if (userId === 0)
    return null;

  const user = await User.GetUser(userId);

  return user;
};