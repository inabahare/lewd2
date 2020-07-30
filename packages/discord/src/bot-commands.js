import { 
  apply, 
  accept, 
  reject,
  forgotPassword,
  integrate
} from "./commands";

const {
  APPLY_CHANNEL,
  APPLICATIONS_CHANNEL
} = process.env;

export const commands = [
  {
    command: "@apply",
    action: apply,
    channel: APPLY_CHANNEL
  },
  {
    command: "@forgot-password",
    action: forgotPassword,
    channel: APPLY_CHANNEL
  },
  {
    command: "@accept",
    action: accept,
    channel: APPLICATIONS_CHANNEL
  },
  {
    command: "@reject",
    action: reject,
    channel: APPLICATIONS_CHANNEL
  },
  {
    command: "@integrate",
    action: integrate,
    channel: "dm"
  }
];