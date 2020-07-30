import Discord from "discord.js";
import { commands } from "./bot-commands";
import { dm } from "./commands";
import { findChannel } from "/functions/discord";

const { 
  BOT_TOKEN, 
  APPLY_CHANNEL, 
  APPLICATIONS_CHANNEL 
} = process.env;

const client = new Discord.Client();

const wordsOrQuotes = /[^\s"]+|"([^"]*)"/g;

client.on("message", message => {
  // Prevent bot from seeing their own messages
  if (message.author === client.user) 
    return;

  const args = message.content.match(wordsOrQuotes);

  if (message.channel.type === "dm") 
    handleDm(args, message, client);
  else  // TextChanel
    handleMessage(args, message, client);
});

function handleDm(args, message, client) {
  const findDmCommand = 
    command => command.channel === "dm" && command.command === args[0];

  const chosenCommand = commands.find(findDmCommand);

  console.log(commands);
  if (chosenCommand) chosenCommand.action(args, message, client);
  else dm(message, client);
}

function handleMessage(args, message, client) {
  const findCommand = 
    command => 
      command.channel === message.channel.name &&
      command.command === args[0];

  const chosenCommand = commands.find(findCommand);
  if (chosenCommand) chosenCommand.action(args, message, client);
}

client.login(BOT_TOKEN);

client.on("ready", () => {
  const applyChannel = findChannel(client, APPLY_CHANNEL);
  const applicationsChannel = findChannel(client, APPLICATIONS_CHANNEL);

  if (!applyChannel) console.error("Channel for applying not found");
  if (!applicationsChannel) console.error("Channel for reading applications not found");

  if (!applyChannel || !applicationsChannel) {
    findChannel(client, "general")
          .send("Yo dudes something's fucked up");
  }
});