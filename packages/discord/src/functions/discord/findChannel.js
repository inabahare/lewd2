
/**
 * 
 * @param { Client } client 
 * @param { string } channelName 
 */
export const findChannel =
  (client, channelName) =>
    client.channels.get("name", channelName);