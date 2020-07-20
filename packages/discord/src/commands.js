import { apply } from "./commands/apply";
import { accept } from "./commands/accept";
import { reject } from "./commands/reject";

export const commands = {
  "!apply": apply,
  "@accept": accept,
  "@reject": reject
};