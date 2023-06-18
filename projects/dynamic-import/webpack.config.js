const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  optimization: {
    minimize: false,
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    client: {
      overlay: false,
    },
    open: true,
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
    new HtmlWebpackPlugin({
      template: './public/index.html',
      hash: false,
    }),
  ],
};
