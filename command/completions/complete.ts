import { Command } from "../command.ts";
import { UnknownCompletionCommand } from "../_errors.ts";
import type { ICompleteArguments, ICompletion } from "../types.ts";

function tokenize(cmd: string) {
  return (cmd.match(/\\?.|^$/g) ?? []).reduce(({ words, quote }, c) => {
    if (c === '"'){
      quote ^= 1;
    } else if (!quote && c === ' '){
      words.push('');
    } else{
      words[words.length - 1] += c.replace(/\\(.)/, '$1');
    }
    return { words, quote };
  }, { words: [''], quote: 0 }).words;
}

async function parsePartialCommand(cmd: Command, args: string[]) {
  try {
    return await cmd.parsePartial(args);
  } catch (e) {
    return { options: {}, args: [], literal: args };
  }
}

/** Execute auto completion method of command and action. */
export class CompleteCommand
  extends Command<{}, [action: string, commandNames?: Array<string>]> {
  public constructor(cmd?: Command) {
    super();
    this.description("Get completions for given action from given command.")
      .option<{ cmd?: string }>("--cmd [s:string]", "the full commandline buffer")
      .arguments("<action:string> [command...:string]")
      .action(async ({ cmd: cmdBuffer = '' }, action: string, commandNames?: Array<string>) => {

        const rawArgs = tokenize(cmdBuffer).slice(1);
        const { options, args, literal } = await parsePartialCommand(this.getMainCommand(), rawArgs);

        let parent: Command | undefined;
        const completeCommand: Command = commandNames
          ?.reduce((cmd: Command, name: string): Command => {
            parent = cmd;
            const childCmd: Command | undefined = cmd.getCommand(name, false);
            if (!childCmd) {
              throw new UnknownCompletionCommand(name, cmd.getCommands());
            }
            return childCmd;
          }, cmd || this.getMainCommand()) ?? (cmd || this.getMainCommand());

        const completion: ICompletion | undefined = completeCommand
          .getCompletion(action);
        const result: Array<string | number> =
          await completion?.complete({ options, args, literal, cmd: completeCommand, parent }) ?? [];

        if (result?.length) {
          Deno.stdout.writeSync(new TextEncoder().encode(result.join("\n")));
        }
      })
      .reset();
  }
}
