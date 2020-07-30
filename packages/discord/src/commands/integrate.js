import { User } from "/data-access/index";
import { sendMessage } from "/functions/discord";

export const integrate =
  async (args, message, client) => {
    const uploadToken = args[1];
    const discordId = message.author.id;
    
    await User.AddDiscordIdByUploadToken(discordId, uploadToken);
    sendMessage(message.author, "You have been accepted");
  };