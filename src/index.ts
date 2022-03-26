#!/usr/bin/env node

import { CodeGenerator } from "./app";

const app = CodeGenerator.getInstance();

app.run();

// import * as yargs from "yargs";

// let args = yargs
//   .scriptName("code-generator")
//   .usage("$0 <cmd> [args]")
//   .command(
//     "make:template <name> <title>",
//     "Generate page-template",
//     (yargs) => {
//       yargs
//         .positional("name", {
//           type: "string",
//           describe: "- Name of the page template in dash-case (e.g. home-page)",
//         })
//         .positional("title", {
//           type: "string",
//           describe: "- Title od the page template (e.g. Home page)",
//         })
//         .option("out", {
//           demandOption: false,
//           default: "./page-templates/<name>",
//           description: "Output directory",
//           alias: "o",
//         })
//         .version(false);
//     },
//     function (argv) {
//       console.log(process.cwd());

//       console.log("hello", argv.name, "welcome to yargs!");
//     }
//   )
//   .strict()
//   .wrap(yargs.terminalWidth()).argv;

// console.log(JSON.stringify(args));
