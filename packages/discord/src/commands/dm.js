const { APPLICATIONS_CHANNEL } = process.env;

/**
 * When the user sends the bot a message
 * @param {*} message 
 */
export const dm = 
  (message, client) => {
    const reply = `
    ------------- NEW MEMBERSHIP -------------
    ${message.content}

    By ${message.author}
    `;
    const applicationChannel = client.channels.cache.find(channel => channel.name === APPLICATIONS_CHANNEL);
    applicationChannel.send(reply);
  };