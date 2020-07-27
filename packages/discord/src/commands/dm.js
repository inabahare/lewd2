import { Applicants } from "/data-access/applicants";

const { APPLICATIONS_CHANNEL } = process.env;

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

    const reply = `
    ------------- NEW MEMBERSHIP -------------
    ${message.content}

    By ${message.author}
    `;
    const applicationChannel = client.channels.cache.find(channel => channel.name === APPLICATIONS_CHANNEL);
    applicationChannel.send(reply);
  };