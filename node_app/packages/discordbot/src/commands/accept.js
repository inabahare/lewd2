import { stringToBytes } from "/functions/formatUploadSize";
import { RegisterToken } from "/data-access/register-token";
import { 
  getUserIdFromArr, 
  idFromMentionString, 
  sendMessage, 
  findUserById 
} from "/functions/discord";

const { DEFAULT_UPLOAD_SIZE } = process.env;

/**
 * When the chad admins accepts the user
 * @param { Array } args 
 * @param {*} message 
 */
export const accept = 
  async (args, message, client) => {
    // Do all the database stuff here
    const discordId = getUserIdFromArr(args);

    if (!discordId)
      return;
    
    const uploadSize = stringToBytes(DEFAULT_UPLOAD_SIZE);
    
    const token = await RegisterToken.Add({
      discordId,
      uploadSize,
      isAdmin: false
    });
    
    const uploadUrl = `${process.env.SITE_LINK}register/${token}`;

    message.reply(`${discordId} as now been accepted`);
    
    const reply =
      args.splice(2, args.length).join(" ");

    const userId = idFromMentionString(discordId);
    const user = findUserById(client, userId);
    sendMessage(user, `${reply} ${uploadUrl}`);
  };