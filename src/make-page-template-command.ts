import { Command } from "./command";
import { CommandArgument } from "./types";

export class MakePageTemplateCommand extends Command {
  public signature: string = "make:template <name> <title>";
  public description: string = "Generate page template";
  protected stubPath: string = "./stubs/page-template/";

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

  public constructor() {
    super();
    super.setDefaultOutDir("./page-templates");
  }

  public handler(): void {
    super.handler();
  }
}
