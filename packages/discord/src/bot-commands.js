import { 
  apply, 
  accept, 
  reject,
  forgotPassword
} from "./commands";

export const commands = {
  "!apply": apply,
  "@accept": accept,
  "@reject": reject,
  "@forgot-password": forgotPassword
};