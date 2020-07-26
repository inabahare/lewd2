export const findUserById =
  (client, userId) => 
    client.users.cache.find(user =>  user.id === userId);