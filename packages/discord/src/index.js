import Discord from "discord.js";
import { commands } from "./commands";
import { dm } from "./commands/dm";

const client = new Discord.Client();

const wordsOrQuotes = /[^\s"]+|"([^"]*)"/g;

client.on("message", message => {
  // Prevent bot from seeing their own messages
  if (message.author === client.user) 
    return;
  
  // When the user messages the bot 
  if (message.channel.type === "dm")
    return dm(message);

  const args = message.content.match(wordsOrQuotes);

  if (!args) return;

  for (const key of Object.keys(commands)) {    
    if (args[0] !== key)
      continue;

    commands[key](args, message);
  }
});

client.login(process.env.BOT_TOKEN);