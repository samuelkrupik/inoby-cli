import { ArgumentsCamelCase } from "yargs";
import { CommandArgument, CommandOption, Modififier } from "../types";
import fs from "fs";
import path from "path";
import chalk from "chalk";

const rootDir = path.resolve(__dirname, "../../");

abstract class Command {
  public abstract signature: string;
  public abstract description: string;
  protected abstract stubPath: string;
  public enabled: boolean = true;
  public abstract arguments: CommandArgument[];
  public options: CommandOption[] = [
    {
      name: "out",
      demandOption: false,
      default: "./",
      description: "Output directory",
      alias: "o",
    },
  ];

  protected modifiers: Modififier[] = [
    {
      name: "camel",
      callback: function (str: string) {
        return str
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
      },
    },
    {
      name: "pascal",
      callback: function (str: string) {
        return (" " + str)
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
      },
    },
    {
      name: "lower",
      callback: function (str: string) {
        return str.toLowerCase();
      },
    },
    {
      name: "upper",
      callback: function (str: string) {
        return str.toUpperCase();
      },
    },
    {
      name: "dash",
      callback: function (str: string) {
        return str.replace(/[\s_]+/g, "-").toLowerCase();
      },
    },
    {
      name: "snake",
      callback: function (str: string) {
        return str.replace(/[\s-]+/g, "_").toLowerCase();
      },
    },
    {
      name: "screaming-snake",
      callback: function (str: string) {
        return str.replace(/[\s-]+/g, "_").toUpperCase();
      },
    },
    {
      name: "plural",
      callback: function (str: string) {
        return str.slice(0, -1) + "y";
      },
    },
  ];

  protected setDefaultOutDir(dir: string): boolean {
    const opt = this.options.find((opt) => opt.name === "out");
    if (opt) {
      opt.default = dir;
      return true;
    }

    return false;
  }

  protected args: ArgumentsCamelCase | null = null;

  public setArgs(args: ArgumentsCamelCase): void {
    this.args = args;
  }

  protected stripStubExt(fileName: string): string {
    return path.basename(fileName, ".stub");
  }

  protected getAbsoluteStubPath(): string {
    return path.resolve(rootDir, this.stubPath);
  }

  protected outPath(filePath: string): string {
    const outDirBase = path.join(process.cwd(), this.args?.out as string);
    const absStubPath = this.getAbsoluteStubPath();
    const outPath = path.join(outDirBase, filePath.replace(absStubPath, ""));

    return this.replace(outPath);
  }

  protected walk(dir: string, callback: (file: string) => void) {
    fs.readdirSync(dir).forEach((entry) => {
      let entryPath = path.join(dir, entry);
      fs.statSync(entryPath).isDirectory()
        ? this.walk(entryPath, callback)
        : callback(entryPath);
    });
  }

  protected replace(content: string): string {
    this.arguments.forEach((argument) => {
      content = content.replace(
        new RegExp(`{%${argument.name}%}`, "g"),
        this.args ? (this.args[argument.name] as string) : ""
      );
      this.modifiers.forEach((modifier) => {
        content = content.replace(
          new RegExp(`{%${argument.name}.${modifier.name}%}`, "g"),
          modifier.callback(
            this.args ? (this.args[argument.name] as string) : ""
          )
        );
      });
    });

    return content;
  }

  protected replaceAndCreate(file: string): void {
    let fileContents = fs.readFileSync(file).toString();
    const outPath = this.outPath(file);
    const outDir = path.dirname(outPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fileContents = this.replace(fileContents);

    const filePath = path.join(outDir, path.basename(outPath, ".stub"));
    fs.writeFile(
      filePath,
      fileContents,
      {
        flag: "w+",
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(
            chalk.bold.green("Created file: ") + chalk.underline.cyan("%s"),
            path.relative(process.cwd(), filePath)
          );
        }
      }
    );
  }

  /**
   * When handler is called this.args are already set
   */
  public handler(): void {
    const absStubPath = this.getAbsoluteStubPath();
    if (!fs.existsSync(absStubPath)) {
      console.log(chalk.red("Stub path does not exists! %s"), absStubPath);
      return;
    }
    if (fs.existsSync(absStubPath) && fs.statSync(absStubPath).isDirectory()) {
      this.walk(absStubPath, this.replaceAndCreate.bind(this));
    } else {
      this.replaceAndCreate(absStubPath);
    }
  }
}

export { Command, rootDir };
