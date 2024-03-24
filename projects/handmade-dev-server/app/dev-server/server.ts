import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { Configuration } from 'webpack';

import { rootDir } from './constants';
import { runCompiler } from './webpack/runCompiler';
import { getWatchPaths } from './watcher/getWatchPaths';

const port = 3000;

interface Params {
  webpackConfig: Configuration;
}

export const runDevServer = async ({ webpackConfig }: Params) => {
  // TODO: parseWebpackConfig
  const entry = webpackConfig.entry as string; // 배열일수도 있긴 하다
  const outputAbsolutePath = path.resolve(
    rootDir,
    webpackConfig?.output?.path ?? 'dist'
  );

  // TODO 1. watch할 디렉토리를 선별하고 file descriptor를 달아준다.
  const watchPaths = await getWatchPaths(entry);
  console.info(
    `[dev-server] wathcer가 다음 ${watchPaths.length}개의 디렉토리들을 워치합니다`,
    watchPaths
  );

  const app = fastify();

  // 2. dev server 시작
  const start = async () => {
    app.register(fastifyStatic, {
      root: outputAbsolutePath,
    });

    // TODO 3. 웹소켓으로 브라우저와 통신
    try {
      await app.listen({ port });
      console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
    } catch (err) {
      console.error('서버 시작 중 오류 발생:', err);
      process.exit(1);
    }

    // TODO 4. 파일이 바뀌는 경우 다시 컴파일할 수 있게 - Proxy등으로 구현
    try {
      await runCompiler({ webpackConfig });
    } catch (e) {
      console.info('compile error');
      console.info(e);
      // 웹팩 컴파일 실패시 다시 시도할 수 있도록 (while)
    }
  };

  await start();
};
