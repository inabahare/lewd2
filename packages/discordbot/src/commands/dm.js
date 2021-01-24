import lines from "../../lines.json";
import { Applicants } from "/data-access/applicants";
import { findChannel } from "/functions/discord";

const {
  APPLICATIONS_CHANNEL
} = process.env;

const QUESTION_COUNT = lines.questions.length;

/**
 * When the user sends the bot a message
 * @param {*} message 
 */
export const dm =
  async (message, client) => {
    // Prevent non-applied from doing this
    const findUser = await Applicants.Exists(message.author.id);
    if (!findUser)
      return;

    // Check for answers
    const answers = message.content.split("\n");
    const answerCount = answers.length;
    const hasCorrectAmountOfAnaswer = answerCount !== QUESTION_COUNT;

    if (hasCorrectAmountOfAnaswer)
      return message.reply(`Hey bro so I'm going to need you to provide me with ${QUESTION_COUNT} answers and not ${answerCount}`);

    const reply =
      `------------- NEW MEMBERSHIP -------------\n${message.content}\n\nBy ${message.author}`;

    const adminChannel = findChannel(client, APPLICATIONS_CHANNEL);
    adminChannel.send(reply);
  };