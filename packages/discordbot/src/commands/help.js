import { commands } from "../bot-commands";

const {
  COMMAND_PREFIX
} = process.env;

// `\n${COMMAND_PREFIX}${current.command} ${current.docs}`

export function printHelp(args, message) {
  const reducer =
    (result, current) => result += current.docs ? `\n${COMMAND_PREFIX}${current.command} ${current.docs}` : "";

  const resultMessage =
    commands.reduce(reducer, "");

  message.reply(resultMessage);
}