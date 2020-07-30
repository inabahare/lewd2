import Discord from "discord.js";
import { commands } from "./bot-commands";
import { dm } from "./commands";
import { findChannel } from "/functions/discord";

const { 
  BOT_TOKEN, 
  BOT_CHANNEL,
  APPLICATIONS_CHANNEL 
} = process.env;

const client = new Discord.Client();

const wordsOrQuotes = /[^\s"]+|"([^"]*)"/g;

client.on("message", message => {
  // Prevent bot from seeing their own messages
  if (message.author === client.user) 
    return;

  const args = message.content.match(wordsOrQuotes);

  const command = args[0];
  const channel = 
    message.channel.type === "text" ? message.channel.name : "dm";

  const findCommand = 
    cmd => 
      cmd.channel === channel &&
      cmd.command === command;

  const chosenCommand = commands.find(findCommand);

  if (chosenCommand) chosenCommand.action(args, message, client);
  else if(channel === "dm") dm(message, client);
});

client.login(BOT_TOKEN);

client.on("ready", () => {
  const applyChannel = findChannel(client, BOT_CHANNEL);
  const applicationsChannel = findChannel(client, APPLICATIONS_CHANNEL);

  if (!applyChannel) console.error("Channel for applying not found");
  if (!applicationsChannel) console.error("Channel for reading applications not found");

  if (!applyChannel || !applicationsChannel) {
    findChannel(client, "general")
          .send("Yo dudes something's fucked up");
  }
});