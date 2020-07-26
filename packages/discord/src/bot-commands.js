import { 
  apply, 
  accept, 
  reject 
} from "./commands/apply";

export const commands = {
  "!apply": apply,
  "@accept": accept,
  "@reject": reject
};