import webpack, { Configuration } from 'webpack';

interface Params {
  webpackConfig: Configuration;
}

export const runCompiler = async ({ webpackConfig }: Params): Promise<void> => {
  const compiler = webpack(webpackConfig);

  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || (stats && stats.hasErrors())) {
        reject(stats?.toString());
      } else {
        resolve('success');
      }
    });
  });
};
