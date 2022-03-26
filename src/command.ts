import { Options, PositionalOptions } from "yargs";
import { CodeGenerator } from "./app";
import { CommandArgument, CommandOption } from "./types";

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
}

export { Command };
