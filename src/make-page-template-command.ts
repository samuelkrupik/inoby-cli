import { Command } from "./command";
import { CommandArgument, CommandOption } from "./types";

export class MakePageTemplateCommand extends Command {
  public getStubPath(): string {
    return this.stubPath;
  }
  public signature: string = "make:template <name> <title>";
  public description: string = "Generate page template";

  public arguments: CommandArgument[] = [
    {
      name: "title",
      type: "string",
      describe: "- Title of the page template (e.g. Home page)",
    },
    {
      name: "name",
      type: "string",
      describe: "- Name of the page template in dash-case (e.g. home-page)",
    },
  ];

  public options: CommandOption[] = [
    {
      name: "out",
      demandOption: false,
      default: "./page-templates",
      description: "Output directory",
      alias: "o",
    },
  ];

  protected stubPath: string = "./stubs/page-template/";

  public handler(): void {
    super.handler();
  }
}
