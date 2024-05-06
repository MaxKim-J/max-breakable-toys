import { Configuration } from 'webpack';
import webpack from 'webpack';
import path from 'path';

type AugmentedWebpackConfig = Omit<Configuration, 'entry'> & {
  entry: {
    app: string;
    hot: string;
  };
};

export const augmentWebpackConfig = (webpackConfig: Configuration) => {
  // yarn에 의존
  const packageCwd = process.env.INIT_CWD as string;

  if (webpackConfig.mode !== 'development') {
    throw Error('mode가 devleopment여야 합니다');
  }

  if (typeof webpackConfig?.entry === 'string') {
    webpackConfig.entry = {
      app: webpackConfig.entry,
      hot: 'webpack/hot/dev-server.js',
    };
  } else {
    throw Error('webpack config가 문자열 단일 엔트리여야 합니다.');
  }

  webpackConfig.output = {
    ...webpackConfig.output,
    // dist에 쌓이는 파일을 없애기 위해
    clean: true,
  };

  // 이전 해쉬값에 대한 참조를 위해
  webpackConfig.recordsPath = path.join(packageCwd, './dist/records.json');

  webpackConfig.optimization = {
    ...webpackConfig.optimization,
    // 엔트리가 여러개인 경우 HMR이 잘 동작하려면
    runtimeChunk: 'single',
  };

  webpackConfig.plugins = [
    // HMR 플러그인
    new webpack.HotModuleReplacementPlugin(),
    ...(webpackConfig?.plugins ?? []),
  ];

  webpackConfig.module = {
    rules: [
      // module.hot.accept를 연결하기 위한 커스텀 로더(트랜스파일링 보다 앞서야함)
      {
        test: /\.(ts|tsx)$/,
        loader: path.resolve(
          packageCwd,
          './dev-server/webpack/handmadeDevServerLoader.mjs'
        ),
        options: {
          appEntry: path.resolve(packageCwd, webpackConfig.entry.app as string),
        },
        exclude: /node_modules/,
      },
      ...(webpackConfig.module?.rules ?? []),
    ],
  };

  return webpackConfig as AugmentedWebpackConfig;
};
