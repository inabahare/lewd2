import { PasswordToken } from "/data-access/password-token";
import { User } from "/data-access";
import { sendMessage } from "/functions/discord";

const { SITE_LINK } = process.env;

/**
 * 
 * @param { array } args 
 * @param { Discord.Message } message 
 * @param { Discord.Client } client 
 */
export const forgotPassword =
  async (args, message, client) => {
    const { id } = message.author;
    const user = await User.FindByDiscordId(id);

    if (!user) 
      return; // TODO: Add message here

    const key = await PasswordToken.GenerateKey(user.username);
    const link = `${SITE_LINK}login/forgot-password/${key}`;

    sendMessage(message.author, `Hey bro here's your reset link: ${link}`);
  };