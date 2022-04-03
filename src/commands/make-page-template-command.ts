import { Command } from "./command";
import { CommandArgument } from "../types";
import fs from "fs";
import path from "path";
// import { boolean } from "yargs";

export default class extends Command {
  public signature: string = "make:template <page-template> <template-name>";
  public description: string = "Generate page template";
  protected stubPath: string = "./stubs/page-template/";
  private indexPath: string = "";

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
    this.setDefaultOutDir("./page-templates");
    this.addOption({
      name: "require",
      demandOption: false,
      default: false,
      description: "Require page template in ./page-templates/index.php",
      alias: "r",
      type: "boolean",
    });
    this.indexPath = path.resolve(this.getOutDir(), "./index.php");
  }

  public handler(): void {
    super.handler();
    if (this.args?.require) {
      if (!fs.existsSync(this.indexPath)) {
        this.createIndex();
      }
      this.appendToIndex();
    }
  }

  private createIndex(): void {
    const content = `<?php

/**
 * Require all page-template files
 */

`;
    fs.writeFileSync(this.indexPath, content);
    this.createdFile(this.indexPath);
  }

  private appendToIndex(): void {
    fs.appendFileSync(
      this.indexPath,
      this.replace(
        `require_once __DIR__ . "/{page-template.dash}/metaboxes.php";\n`
      )
    );
  }
}
