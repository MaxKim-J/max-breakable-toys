import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { Configuration } from 'webpack';
import { type SubscribeCallback } from '@parcel/watcher';

import { rootDir } from './constants';
import { runCompiler } from './webpack/runCompiler';
import { getWatchPaths } from './watcher/getWatchPaths';
import { watcher } from './watcher/watcher';

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
    `[dev-server] watcher가 다음 ${watchPaths.length}개의 디렉토리들을 워치합니다`,
    watchPaths
  );

  const subscribeCallback: SubscribeCallback = async (err, events) => {
    const eventsFile = events.map((it) => it.path);
    console.info(
      `[dev-server] 아래 파일들의 수정이 감지되었습니다.`,
      eventsFile
    );
    await runCompiler({ webpackConfig });
    console.info(`[dev-server] 웹팩 리컴파일을 완료했습니다.`);

    // TODO 3. 웹소켓으로 브라우저와 통신까지
  };

  await watcher({
    watchPaths,
    subscribeCallback,
  });

  const app = fastify();

  // 2. dev server 시작
  const start = async () => {
    // TODO 3. 웹소켓열어주기

    app.register(fastifyStatic, {
      root: outputAbsolutePath,
    });

    try {
      await app.listen({ port });
      console.log(`[dev-server] 서버가 ${port}번 포트에서 실행 중입니다.`);
    } catch (err) {
      console.error('[dev-server] 서버 시작 중 오류 발생:', err);
      process.exit(1);
    }

    // 4. 최초 1회 컴파일
    try {
      await runCompiler({ webpackConfig });
    } catch (e) {
      console.info('compile error');
      console.info(e);
    }
  };

  await start();
};
