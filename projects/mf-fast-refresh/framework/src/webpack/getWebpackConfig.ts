import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { createRequire } from 'node:module';

import { type MfPluginOptions } from './types';

const hotMiddlewareClientEntry = createRequire(import.meta.url).resolve(
  'webpack-hot-middleware/client'
);

interface Params {
  layer: 'remote' | 'host';
  mfPluginOptions: MfPluginOptions;
}

export const getWebpackCOnfig = ({ layer, mfPluginOptions }: Params) => ({
  mode: 'development',
  entry: {
    main: [
      `${hotMiddlewareClientEntry}?path=/__webpack_hmr&timeout=20000`,
      layer === 'host' ? './index.tsx' : './fakeEntry.ts',
    ],
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
    layer === 'host'
      ? new HtmlWebpackPlugin({
          template: './public/index.html',
          hash: false,
        })
      : undefined,
    new webpack.container.ModuleFederationPlugin({
      ...mfPluginOptions,
      filename: 'remoteEntry.js',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
});
