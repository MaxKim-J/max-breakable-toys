import { Cli } from 'clipanion';
import { DevCommand } from '../src/commands/devCommand';

const [, , ...args] = process.argv;

export const cli = () => {
  const cli = new Cli({
    enableCapture: true,
    enableColors: true,
  });

  // register the command
  cli.register(DevCommand);

  cli.runExit(args);
};
