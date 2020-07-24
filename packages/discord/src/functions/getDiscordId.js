export const discordId = /<@!(\d)+>/g;

export const getUserIdFromArr =
  args =>
    args.find(arg => discordId.test(arg));