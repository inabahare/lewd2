import path from "path";

require("dotenv").config({
  path: path.join(__dirname, "../../../.env")
});

import Discord from "discord.js";
import { commands } from "./bot-commands";
import { dm } from "./commands";
import { findChannel } from "/functions/discord";

const {
  BOT_TOKEN,
  BOT_CHANNEL,
  APPLICATIONS_CHANNEL,
  COMMAND_PREFIX
} = process.env;

const client = new Discord.Client();

const wordsOrQuotes = /[^\s"]+|"([^"]*)"/g;

client.on("message", message => {
  // Prevent bot from seeing their own messages
  if (message.author === client.user)
    return;

  const channel =
    message.channel.type === "text" ?
      message.channel.name : "dm";

  if (message.content[0] !== COMMAND_PREFIX) {
    // For when people just sends a text message to apply
    if (channel === "dm")
      dm(message, client);
    return;
  }

  const args = message.content.match(wordsOrQuotes);

  const command = args[0].slice(1, args[0].length);

  const findCommand =
    cmd =>
      (cmd.channel === channel || cmd.channel === "*") &&
      cmd.command === `${command}`;

  const chosenCommand = commands.find(findCommand);

  if (chosenCommand)
    chosenCommand.action(args, message, client);
});

client.login(BOT_TOKEN);

client.on("ready", () => {
  const applyChannel = findChannel(client, BOT_CHANNEL);
  const applicationsChannel = findChannel(client, APPLICATIONS_CHANNEL);

  const channels = [];

  if (!applyChannel) channels.push(`BOT_CHANNEL (${BOT_CHANNEL}) not found.`);
  if (!applicationsChannel) channels.push(`APPLICATIONS_CHANNEL (${APPLICATIONS_CHANNEL}) not found`);
  if (!COMMAND_PREFIX) channels.push(`COMMAND_PREFIX not found. Possibly not set in .env`);

  const error = channels.join("\n");

  if (channels.length > 0) {
    console.error(error);
    process.exit(1);
  }
});

if (process.env.NODE_ENV === "production") {
  process.on("uncaughtException", err => {
    console.error("<discord.js>");
    console.error("app.js", err);
    console.error("</discord.js>");
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, p) => {
    console.error("<discord.js>");
    console.error(`Reason: `, reason);
    console.error("--------------------------");
    console.error(reason.stack);

    console.error("--------------------------");
    console.error(p);
    console.error("</discord.js>");
    process.exit(1);
  });
}

console.log(process.env);