import lines from "../../lines.json";

/**
 * Send message to user telling them to apply
 * @param { Array } args 
 * @param {*} message 
 */
export const apply =
  (args, message) => {
    const appendQuestion = 
      (formattedQuestions, question) => formattedQuestions += `- ${question}\n`;
    
    const questions = 
      lines.questions.reduce(appendQuestion, "");
      
    message.author.send(`${lines.onApply}\n\n${questions}`);
  };