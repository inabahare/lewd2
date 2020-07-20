/**
 * Send message to user telling them to apply
 * @param { Array } args 
 * @param {*} message 
 */
export const apply =
  (args, message) => {
    message.user.send("Hey bro");
    // console.log(args, message);
  };