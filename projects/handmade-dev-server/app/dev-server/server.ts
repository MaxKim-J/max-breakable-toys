import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { Configuration } from 'webpack';

import { rootDir } from './constants';
import { runWebpackCompiler } from './runWebpackCompiler';

const port = 3000;

interface Params {
  webpackConfig: Configuration;
}

export const runDevServer = async ({ webpackConfig }: Params) => {
  const outputAbsolutePath = path.resolve(
    rootDir,
    webpackConfig?.output?.path ?? 'dist'
  );

  const app = fastify();

  // TODO watch할 디렉토리를 선별한다

  // 서버 시작
  const start = async () => {
    app.register(fastifyStatic, {
      root: outputAbsolutePath,
    });

    try {
      await app.listen({ port });
      console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
    } catch (err) {
      console.error('서버 시작 중 오류 발생:', err);
      process.exit(1);
    }

    try {
      await runWebpackCompiler({ webpackConfig });
    } catch (e) {
      console.info('compile error');
      console.info(e);
      // 웹팩 컴파일 실패시 다시 시도할 수 있도록 (while)
    }
  };

  start();
};
