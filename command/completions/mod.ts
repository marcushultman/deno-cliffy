import { Command } from "../command.ts";
import { dim, italic } from "../deps.ts";
import { BashCompletionsCommand } from "./bash.ts";
import { CompleteCommand } from "./complete.ts";
import { FishCompletionsCommand } from "./fish.ts";
import { ZshCompletionsCommand } from "./zsh.ts";

/**
 * Generates source code for interactive shell completions used in multiple shell's.
 */
export class CompletionsCommand extends Command {
  public constructor(cmd?: Command) {
    super();

    this.description("Generate shell completions.")
      .description(() => {
        cmd = cmd || this.getMainCommand();
        return `Generate shell completions.

To enable shell completions for this program add following line to your ${
          dim(italic("~/.bashrc"))
        } or similar:

    ${dim(italic(`source <(${cmd.getPath()} completions [shell])`))}

    For mor information run ${
          dim(italic(`${cmd.getPath()} completions [shell] --help`))
        }
`;
      })
      .action(() => this.help())
      .command("bash", new BashCompletionsCommand(cmd))
      .command("fish", new FishCompletionsCommand(cmd))
      .command("zsh", new ZshCompletionsCommand(cmd))
      .command("complete", new CompleteCommand(cmd).hidden())
      .reset();
  }
}
