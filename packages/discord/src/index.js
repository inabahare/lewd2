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
  
  // When the user messages the bot 
  if (message.channel.type === "dm")
    return dm(message, client);

  const args = message.content.match(wordsOrQuotes);

  if (!args) return;

  for (const key of Object.keys(commands)) {    
    if (args[0] !== key)
      continue;

    commands[key](args, message, client);
  }
});

(async function setup () {
  await client.login(BOT_TOKEN);
  
  const applyChannel = findChannel(client, APPLY_CHANNEL);
  const applicationsChannel = findChannel(client, APPLICATIONS_CHANNEL);

  if (!applyChannel) console.error("Channel for applying not found");
  if (!applicationsChannel) console.error("Channel for reading applications not found");

  if (!applyChannel || !applicationsChannel) {
    findChannel(client, "general")
          .send("Yo dudes something's fucked up");
  }
})();