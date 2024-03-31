import path from 'path';
import { fileURLToPath } from 'url';

import HandmadePlugin from './dev-server/webpack/handmadeDevServerPlugin.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'swc-loader',
        exclude: /node_modules/,
        options: {
          jsc: {
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
            target: 'es2017',
            parser: {
              syntax: 'typescript',
              jsx: true,
            },
          },
        },
      },
    ],
  },
  plugins: [
    new HandmadePlugin({
      template: './public/index.html',
      hash: false,
    }),
  ],
};

export default config;
