import { commands } from "../bot-commands";

const { COMMAND_PREFIX } = process.env;

export const help =
  (args, message) => {
    const resultMessage = commands.reduce((result, current) => result += current.docs ? `\n${COMMAND_PREFIX}${current.command} ${current.docs}` : "", "");
    message.reply(resultMessage);
  };