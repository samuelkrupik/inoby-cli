import { Options, PositionalOptions } from "yargs";

export interface CommandArgument extends PositionalOptions {
  name: string;
}

export interface CommandOption extends Options {
  name: string;
}
