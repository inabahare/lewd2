import { getUserIdFromArr, idFromMentionString, findUserById, sendMessage } from "/functions/discord";
import { Applicants } from "/data-access/applicants";

/**
 * When the overlords reject the user
 * @param { Array } args 
 * @param {*} message 
 */
export const reject = 
  async (args, message, client) => {
    const discordId = getUserIdFromArr(args);
    const id = idFromMentionString(discordId);
    const user = findUserById(client, id);

    Applicants.Remove(id);
    sendMessage(user, args[args.length - 1]);
  };