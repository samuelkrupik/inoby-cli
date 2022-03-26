import { Options, PositionalOptions } from "yargs";
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

  public register(): void {
    const app = CodeGenerator.getInstance();
  }

  protected getStubFileContents() {}

  public abstract getStubPath(): string;

  private outName(): string {
    return path.basename(this.stubPath, ".stub");
  }

  public handler = (argv: any) => {
    const stubPath = path.resolve(rootDir, this.stubPath);
    // try {
    let fileContents = fs.readFileSync(stubPath).toString();
    this.arguments.forEach((argument) => {
      const replacer = new RegExp(`{%${argument.name}%}`, "g");
      fileContents = fileContents.replace(replacer, argv[argument.name]);
    });
    const outDir = path.resolve(
      process.cwd(),
      argv.out.replace("<name>", argv.name)
    );
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(path.resolve(outDir, this.outName()), fileContents, {
      flag: "w+",
    });
    // } catch (error) {
    //   console.error("File %s does not exists!", stubPath);
    // }
  };
}

export { Command };
