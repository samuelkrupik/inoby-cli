import yargs, { Options, PositionalOptions } from "yargs";
import { CodeGenerator } from "./app";
import { CommandArgument, CommandOption } from "./types";
import fs from "fs";
import path from "path";

export const rootDir = path.resolve(__dirname, "../");

abstract class Command {
  public abstract signature: string;
  public abstract description: string;
  protected abstract stubPath: string;
  public abstract arguments: CommandArgument[];
  public abstract options: CommandOption[];
  protected args: yargs.ArgumentsCamelCase | null = null;

  public setArgs(args: yargs.ArgumentsCamelCase): void {
    this.args = args;
  }

  protected getStubFileContents() {}

  public abstract getStubPath(): string;

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
      const replacer = new RegExp(`{%${argument.name}%}`, "g");
      content = content.replace(
        replacer,
        this.args ? (this.args[argument.name] as string) : ""
      );
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

    fs.writeFileSync(
      path.join(outDir, path.basename(outPath, ".stub")),
      fileContents,
      {
        flag: "w+",
      }
    );
  }

  /**
   * When handler is called this.args are already set
   */
  public handler(): void {
    const absStubPath = this.getAbsoluteStubPath();
    if (fs.statSync(absStubPath).isDirectory()) {
      this.walk(absStubPath, this.replaceAndCreate.bind(this));
    } else {
      this.replaceAndCreate(absStubPath);
    }
  }
}

export { Command };
