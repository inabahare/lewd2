import {
  apply,
  accept,
  reject,
  forgotPassword,
  integrate,
  printHelp
} from "./commands";

const {
  BOT_CHANNEL,
  APPLICATIONS_CHANNEL,
  SITE_NAME
} = process.env;

export const commands = [
  {
    command: "apply",
    action: apply,
    channel: BOT_CHANNEL,
    minArgs: 0,
    docs: "- Will start the application process for you"
  },
  {
    command: "forgot-password",
    action: forgotPassword,
    channel: BOT_CHANNEL,
    minArgs: 1,
    docs: "- Will send you a password reset link"
  },
  {
    command: "accept",
    action: accept,
    channel: APPLICATIONS_CHANNEL,
    minArgs: 1,
    docs: "@taggedUser message - Sends the quoted user an accept link and an optional message"
  },
  {
    command: "reject",
    action: reject,
    channel: APPLICATIONS_CHANNEL,
    minArgs: 1,
    docs: "@taggedUser message - Like accept but with a reject link"
  },
  {
    command: "add-me",
    action: integrate,
    channel: "dm",
    args: 1,
    docs: `<YOUR UPLOAD TOKEN> - Adds your discord ID to your ${SITE_NAME} account so you for example can request a new password`
  },
  {
    command: "help",
    action: printHelp,
    channel: "*",
    args: 0
  }
];