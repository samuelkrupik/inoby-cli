import { Command } from "./command";
import { CommandArgument } from "../types";
import path from "path";
import fs from "fs";
import chalk from "chalk";

export default class MakeComponentCommand extends Command {
  public signature: string = "make:component <component> <name>";
  public description: string = "Generate metabox component";
  protected stubPath: string = "./stubs/component/";
  private indexPath: string = "";
  private webpackPath: string = "";

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
    this.indexPath = path.resolve(this.getOutDir(), "./index.php");
    this.webpackPath = path.resolve(this.getOutDir(), "./webpack.entry.js");
    this.addOption({
      name: "require",
      demandOption: false,
      default: false,
      description: "Require component in ./components/index.php",
      alias: "r",
      type: "boolean",
    });
    this.addOption({
      name: "webpack",
      demandOption: false,
      default: false,
      description: "Require component in ./components/webpack.entry.js",
      alias: "w",
      type: "boolean",
    });
    this.addOption({
      name: "all",
      demandOption: false,
      default: false,
      description: "Require component in index.php and webpack.entry.js",
      alias: "a",
      type: "boolean",
    });
  }

  public handler(): void {
    super.handler();
    if (this.args?.all) {
      this.requireHandler();
      this.webpackHandler();
      return;
    }

    if (this.args?.require) {
      this.requireHandler();
    }

    if (this.args?.webpack) {
      this.webpackHandler();
    }
  }

  private requireHandler() {
    if (!fs.existsSync(this.indexPath)) {
      this.createIndex();
    }
    this.appendToIndex();
  }

  private webpackHandler() {
    if (!fs.existsSync(this.webpackPath)) {
      this.createWebpack();
    }
    this.appendToWebpack();
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

    console.log("Component added to index.php");
  }

  private createWebpack(): void {
    const content = `const path = require("path");
const { AssetsHelper } = require("../../inoby-theme/webpack/webpack-helpers.js");
const theme = new AssetsHelper(path.resolve(__dirname, "./../"));

const components = [];

module.exports = components;

    `;
    fs.writeFileSync(this.webpackPath, content);
    this.createdFile(this.webpackPath);
  }

  private appendToWebpack(): void {
    let file = fs.readFileSync(this.webpackPath, "utf-8").toString();

    const regex = /components\s*=\s*\[(.*)\]/is;
    let m;

    if ((m = regex.exec(file)) !== null && m.length == 2) {
      const currComponents = (m[1] as string).trim();
      let replace = "components = [";

      if (currComponents.length) {
        replace += "\n" + "  " + currComponents;
      }

      if (currComponents.length && !currComponents.endsWith(",")) {
        replace += ",";
      }

      replace += this.replace('\n  ...theme.component("{component.dash}")\n]');

      file = file.replace(m[0], replace);
      console.log("Component added to webpack.entry.js");
    }

    fs.writeFileSync(this.webpackPath, file, "utf-8");
  }
}
