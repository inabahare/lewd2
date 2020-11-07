import lines from "../../lines.json";
import { Applicants } from "/data-access/applicants";
import { findChannel } from "/functions/discord";

const { 
  ADMIN_CHANNEL
} = process.env;

/**
 * Send message to user telling them to apply
 * @param { Array } args 
 * @param {*} message 
 */
export const apply =
  async (args, message, client) => {
    const { id } = message.author;

    // Prevent user from reapplying
    const findUser = await Applicants.Exists(id);
    if (findUser)
      return;

    const appendQuestion = 
      (formattedQuestions, question) => formattedQuestions += `- ${question}\n`;
    
    const questions = 
      lines.questions.reduce(appendQuestion, "");
    
    await Applicants.Add(id);  
    
    const botChannel = findChannel(client, ADMIN_CHANNEL);
    botChannel.send(`${lines.onApply}\n\n${questions}`);
  };