import path from "path";
import fs from "fs";
import yargs from "yargs";
import { Command } from "./commands/command";

export class CodeGenerator {
  private static instance: CodeGenerator;

  private autoDiscovery: boolean = true;

  private commands: Command[] = [
    // new MakePageTemplateCommand(),
    // new MakeCommandCommand(),
  ];

  public static getInstance(): CodeGenerator {
    if (!CodeGenerator.instance) {
      CodeGenerator.instance = new CodeGenerator();
    }
    return CodeGenerator.instance;
  }

  public async run() {
    const args = await this.buildArgs();
    return args.argv;
  }

  private async buildArgs(): Promise<yargs.Argv<{}>> {
    const args = await this.registerCommands();

    return args
      .scriptName("inoby")
      .usage("$0 <cmd> [args]")
      .strict()
      .wrap(yargs.terminalWidth());
  }

  private async discoverCommands(): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(__dirname, "./commands"), (err, files) => {
        if (err) {
          reject(err);
        } else {
          files.forEach(async (file, index) => {
            if (file === "command.js") return;
            const commandImport = await import("./commands/" + file);
            const command: Command = new commandImport.default();
            this.commands.push(command);

            if (index === files.length - 1) {
              resolve();
            }
          });
        }
      });
    });
  }

  private async registerCommands(): Promise<yargs.Argv<{}>> {
    if (this.autoDiscovery) {
      await this.discoverCommands();
    }

    let args = yargs;

    this.commands.forEach((command) => {
      // check enabled
      if (!command.enabled) return;
      // register
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
        (args: yargs.ArgumentsCamelCase) => {
          command.setArgs(args);
          command.handler();
        }
      );
    });

    return args;
  }
}
