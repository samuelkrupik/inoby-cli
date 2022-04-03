import { Command } from "./command";
import { CommandArgument } from "../types";

export default class extends Command {
  public signature: string = "make:template <page-template> <template-name>";
  public description: string = "Generate page template";
  protected stubPath: string = "./stubs/page-template/";

  public arguments: CommandArgument[] = [
    {
      name: "page-template",
      type: "string",
      describe: "Name of the page template in dash-case (e.g. home-page)",
    },
    {
      name: "template-name",
      type: "string",
      describe: 'Template name (e.g. "Home page")',
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
