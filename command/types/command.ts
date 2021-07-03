import type { Command } from "../command.ts";
import { ICompleteArguments } from "../types.ts";
import { StringType } from "./string.ts";

/** String type with auto completion of sibling command names. */
export class CommandType extends StringType {
  /** Complete sub-command names of global parent command. */
  public complete({ parent }: ICompleteArguments): string[] {
    return parent?.getCommands(false)
      .map((cmd: Command) => cmd.getName()) || [];
  }
}
