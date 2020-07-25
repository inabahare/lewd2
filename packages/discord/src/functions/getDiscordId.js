export const discordId = /<@!(\d)+>/g;
export const discordIdSymbols = /[(<@!)|(>)]/g;

export const getUserIdFromArr =
  args =>
    args.find(arg => discordId.test(arg));

/**
 * Turns a discord mention string to a string. Aka going from <@!\d+> => \d+
 * @param { string } mention 
 */
export const idFromMentionString =
  mention =>
    mention.replace(discordIdSymbols, "");