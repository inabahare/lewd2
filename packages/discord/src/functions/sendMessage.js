/**
 * 
 * @param { ClientUser } user 
 * @param { string } message 
 */

export const sendMessage =
  async (user, message) => {
    const channel = await user.createDM();
    await channel.send(message);
  };