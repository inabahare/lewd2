import lines from "../../lines.json";

/**
 * Send message to user telling them to apply
 * @param { Array } args 
 * @param {*} message 
 */
export const apply =
  (args, message) => {
    const questions = 
      lines.questions.reduce((formattedQuestions, question) => formattedQuestions += `- ${question}\n`, "");
      
    message.author.send(`${lines.onApply}\n\n${questions}`);
  };