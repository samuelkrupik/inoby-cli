import { Command } from "./command";
import { CommandArgument } from "../types";

export default class MakePostTypeCommand extends Command {
  public signature: string = "make:post-type <post-type> <name>";
  public description: string = "Generate post type";
  protected stubPath: string = "./stubs/post-type";

  public arguments: CommandArgument[] = [
    {
      name: "post-type",
      type: "string",
      describe:
        "Name of the post type to register in dash-case (e.g. post-type)",
    },
    {
      name: "name",
      type: "string",
      describe: "Name of the post type to display (e.g. Post type)",
    },
  ];

  public constructor() {
    super();
    super.setDefaultOutDir("./post-types");
  }

  public handler(): void {
    super.handler();
    // custom handler
  }
}
