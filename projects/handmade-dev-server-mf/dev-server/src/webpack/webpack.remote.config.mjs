import path from "node:path";
import webpack from "webpack";

const { ModuleFederationPlugin } = webpack.container;

export const config = ({ config }) => {
  const { mfConfig, appDir, name } = config;

  const processedMfConfig = {
    ...mfConfig,
    exposes: Object.keys(mfConfig.exposes).reduce((exposes, key) => {
      return {
        ...exposes,
        [key]: path.resolve(appDir, mfConfig.exposes[key]),
      };
    }, {}),
  };

  return {
    mode: "development",
    entry: path.resolve(appDir, "./index.tsx"),
    output: {
      path: path.resolve(appDir, "dist"),
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "swc-loader",
          exclude: /node_modules/,
          options: {
            jsc: {
              transform: {
                react: {
                  runtime: "automatic",
                },
              },
              target: "es2017",
              parser: {
                syntax: "typescript",
                jsx: true,
              },
            },
          },
        },
      ],
    },
    plugins: [new ModuleFederationPlugin(processedMfConfig)],
  };
};
