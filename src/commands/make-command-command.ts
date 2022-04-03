import { Command } from "./command";
import { CommandArgument } from "../types";

export default class MakeCommandCommand extends Command {
  public signature: string = "make:command <command>";
  public description: string = "Generate new command";
  protected stubPath: string = "./stubs/command";
  public enabled: boolean = true;

  public arguments: CommandArgument[] = [
    {
      name: "command",
      type: "string",
      describe:
        " - Name of the command in dash-case (e.g. make-template-command)",
    },
  ];

  public constructor() {
    super();
    this.setDefaultOutDir("./src/commands");
  }

  public handler(): void {
    super.handler();
  }
}
