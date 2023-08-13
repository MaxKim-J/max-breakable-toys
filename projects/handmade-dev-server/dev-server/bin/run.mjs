import { Cli } from "clipanion";
import { DevCommand } from "../src/cli/dev.mjs";

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `mf`,
  binaryName: `핸드메이드 개발 서버`,
  binaryVersion: `1.0.0`,
});

cli.register(DevCommand);

cli.runExit(args);
