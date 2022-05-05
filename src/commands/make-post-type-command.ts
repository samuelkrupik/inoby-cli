import { Command } from "./command";
import { CommandArgument } from "../types";
import path from "path";
import fs from "fs";

export default class MakePostTypeCommand extends Command {
  public signature: string = "make:post-type <post-type> <name>";
  public description: string = "Generate post type";
  protected stubPath: string = "./stubs/post-type";
  private indexPath: string = "";

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
    this.addOption({
      name: "metaboxes",
      type: "boolean",
      alias: "m",
      demandOption: false,
      default: false,
      description: "Generate metaboxes.php",
    });
    this.addOption({
      name: "require",
      demandOption: false,
      default: false,
      description: "Require post-type in ./post-types/index.php",
      alias: "r",
      type: "boolean",
    });
    this.indexPath = path.resolve(this.getOutDir(), "./index.php");
  }

  public handler(): void {
    if (!this.args?.metaboxes as boolean) {
      this.exludedStubs.push(/metaboxes.php/);
    }
    if (this.args?.require) {
      if (!fs.existsSync(this.indexPath)) {
        this.createIndex();
      }
      this.appendToIndex();
    }
    super.handler();
  }

  private createIndex(): void {
    const content = 
    `<?php

/**
 * Require all post-type files
 */

`;
    fs.writeFileSync(this.indexPath, content);
    this.createdFile(this.indexPath);
  }

  private appendToIndex(): void {
    let content = `\n// {post-type} files\nrequire_once __DIR__ . "/{post-type.dash}/register.php";\n`;
    if (this.args?.metaboxes as boolean) {
      content += `require_once __DIR__ . "/{post-type.dash}/metaboxes.php";\n`;
    }
    fs.appendFileSync(
      this.indexPath,
      this.replace(content)
    );
  }
}
