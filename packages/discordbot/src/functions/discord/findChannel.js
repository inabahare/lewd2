/**
 * 
 * @param { Client } client 
 * @param { string } channelName 
 */
export const findChannel =
  (client, channelName) =>
    client.channels.cache.find(channel => channel.name === channelName);