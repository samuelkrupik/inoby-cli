import { Command } from "./command";
import { CommandArgument } from "../types";
import path from "path";
import fs from "fs";

export default class MakeComponentCommand extends Command {
  public signature: string = "make:component <name>";
  public description: string = "Make metabox component";
  protected stubPath: string = "./stubs/component/";
  private indexPath: string = "";

  public arguments: CommandArgument[] = [
    {
      name: "component",
      type: "string",
      describe: "Name of the component in dash-case (e.g. product-slider)",
    },
    {
      name: "name",
      type: "string",
      describe: 'Name of the component (e.g. "Produktový slider")',
    },
  ];

  public constructor() {
    super();
    this.setDefaultOutDir("./components");
    this.addOption({
      name: "require",
      demandOption: false,
      default: false,
      description: "Require component in ./components/index.php",
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
 * Require all component files
 */

`;
    fs.writeFileSync(this.indexPath, content);
    this.createdFile(this.indexPath);
  }

  private appendToIndex(): void {
    fs.appendFileSync(
      this.indexPath,
      this.replace(
        `require_once __DIR__ . "/{component.dash}/class-mb-{component.dash}.php";\n`
      )
    );
  }
}
