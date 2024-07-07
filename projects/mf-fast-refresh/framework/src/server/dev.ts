import express from 'express';
import path from 'path';
import webpack, { type Configuration } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const app = express();

interface Params {
  layer: 'remote' | 'host';
  port: number;
  webpackConfig: Configuration;
}

export const runDevServer = ({ layer, port, webpackConfig }: Params) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  const webpackCompiler = webpack(webpackConfig);

  app.use(
    webpackDevMiddleware(webpackCompiler, {
      publicPath: '/',
    })
  );

  app.use(
    webpackHotMiddleware(webpackCompiler as any, {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    })
  );

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  if (layer === 'host') {
    app.get('/', async (...[, res, next]) => {
      webpackCompiler.outputFileSystem.readFile(
        path.join(webpackCompiler.outputPath, 'index.html'),
        (error, result) => {
          if (error) return next(error);
          res.set('content-type', 'text/html').end(result);
        }
      );
      return;
    });
  }

  process.on('SIGINT', () => {
    console.log('Server is shutting down');
    process.exit(0);
  });

  process.on('SIGTSTP', () => {
    console.log('Server is shutting down');
    process.exit(0);
  });
};
