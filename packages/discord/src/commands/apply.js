import lines from "../../lines.json";
import { Applicants } from "/data-access/applicants";

/**
 * Send message to user telling them to apply
 * @param { Array } args 
 * @param {*} message 
 */
export const apply =
  async (args, message) => {
    const appendQuestion = 
      (formattedQuestions, question) => formattedQuestions += `- ${question}\n`;
    
    const questions = 
      lines.questions.reduce(appendQuestion, "");
    
    await Applicants.Add(message.author.id);  
    message.author.send(`${lines.onApply}\n\n${questions}`);
  };