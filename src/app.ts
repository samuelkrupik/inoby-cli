import yargs from "yargs";
import { Command } from "./command";
import { MakePageTemplateCommand } from "./make-page-template-command";

export class CodeGenerator {
  private static instance: CodeGenerator;
  private commands: Command[] = [new MakePageTemplateCommand()];

  public static getInstance() {
    if (!CodeGenerator.instance) {
      CodeGenerator.instance = new CodeGenerator();
    }
    return CodeGenerator.instance;
  }

  public run() {
    const args = this.buildArgs();
    return args.argv;
  }

  private buildArgs(): yargs.Argv {
    return this.registerCommands(
      yargs.scriptName("code-generator").usage("$0 <cmd> [args]")
    )
      .strict()
      .wrap(yargs.terminalWidth());
  }

  private registerCommands(args: yargs.Argv): yargs.Argv {
    console.log(this.commands);

    this.commands.forEach((command) => {
      args.command(
        command.signature,
        command.description,
        (yargs) => {
          command.arguments.forEach((argument) =>
            yargs.positional(argument.name, argument)
          );
          command.options.forEach((option) =>
            yargs.option(option.name, option)
          );
          yargs.version(false);
        },
        this.handler
      );
    });

    return args;
  }

  private handler(argv: any) {
    console.log(JSON.stringify(argv));
  }
}
