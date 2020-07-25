import { getUserIdFromArr } from "/functions/getDiscordId";

/**
 * When the chad admins accepts the user
 * @param { Array } args 
 * @param {*} message 
 */
export const accept = 
  (args, message) => {
    // Do all the database stuff here
    const user = getUserIdFromArr(args);
    if (!user) {
      return;
    }
  };