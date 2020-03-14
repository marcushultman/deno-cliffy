import { CompletionsCommand } from '../commands/completions.ts';
import { BaseCommand } from './base-command.ts';
import { DefaultCommand } from './default-command.ts';

/**
 * A command with pre configured command's and option's:
 *
 *  - command's:
 *      help            Output's autogenerated help.
 *      completions     Output's autogenerated shell completion script for bash and zsh.
 *  - option's:
 *      -h, --help      Output's autogenerated help.
 *      -V, --version   Output's version number
 */
export class Command extends DefaultCommand {

    public constructor() {

        super();

        this.command( 'completions', new CompletionsCommand( this ) )
            .reset();
    }

    public command( nameAndArguments: string, cmd?: BaseCommand | string, override?: boolean ): this {
        return super.command( nameAndArguments, cmd || new Command(), override );
    }
}
