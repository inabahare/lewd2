import { 
  apply, 
  accept, 
  reject,
  forgotPassword,
  integrate
} from "./commands";

const {
  BOT_CHANNEL,
  ADMIN_CHANNEL
} = process.env;

export const commands = [
  {
    command: "apply",
    action: apply,
    channel: BOT_CHANNEL,
    minArgs: 0
  },
  {
    command: "forgot-password",
    action: forgotPassword,
    channel: BOT_CHANNEL,
    minArgs: 1
  },
  {
    command: "accept",
    action: accept,
    channel: ADMIN_CHANNEL,
    minArgs: 1
  },
  {
    command: "reject",
    action: reject,
    channel: ADMIN_CHANNEL,
    minArgs: 1
  },
  {
    command: "integrate",
    action: integrate,
    channel: "dm",
    args: 1
  }
];