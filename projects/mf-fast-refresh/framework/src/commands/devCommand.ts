import { Command } from 'clipanion';
import path from 'path';
import { type Configuration } from 'webpack';

import { runDevServer } from '../server/dev';
import { getWebpackCOnfig } from '../webpack/getWebpackConfig';

export class DevCommand extends Command {
  static paths = [['dev'], Command.Default];

  async execute() {
    const configPath = path.resolve(process.env.PWD as string, 'mf.config.mjs');
    const config = (await import(configPath)).default;
    const { layer, port, ...mfPluginOptions } = config;

    const webpackConfig = getWebpackCOnfig({
      layer,
      mfPluginOptions,
    }) as Configuration;

    runDevServer({ layer, port, webpackConfig });
  }
}
