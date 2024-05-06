import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import path from 'path';
import process from 'process';
import { Configuration } from 'webpack';
import { type SubscribeCallback } from '@parcel/watcher';

import { projectRootDir } from './constants';
import { runCompiler } from './webpack/runCompiler';
import { getWatchPaths } from './watcher/getWatchPaths';
import { watcher } from './watcher/watcher';
import { createMessage } from './socket/messageParser';
import { augmentWebpackConfig } from './webpack/augemtWebpackConfig';

const port = 3000;

interface Params {
  webpackConfig: Configuration;
}

let closer: null | (() => Promise<void>) = null;

const cleanUpAndShutdown = async () => {
  if (closer !== null) {
    await closer();
  }
  console.log(`[dev-server] Watcher와 Socket을 정리하고 서버를 종료합니다.`);
  process.exit();
};

export const runDevServer = async ({ webpackConfig }: Params) => {
  const augmentedWebpackConfig = augmentWebpackConfig(webpackConfig);
  const appEntry = augmentedWebpackConfig.entry.app;

  const outputAbsolutePath = path.resolve(
    projectRootDir,
    augmentedWebpackConfig?.output?.path ?? 'dist'
  );

  // 1. watch할 디렉토리(파일아님)를 미리 선별한다. 파일 descriptor를 디렉토리에만 달아준다.
  const watchPaths = await getWatchPaths(appEntry);
  console.info(
    `[dev-server] watcher가 다음 ${watchPaths.length}개의 디렉토리들을 워치합니다`,
    watchPaths
  );

  const app = fastify();

  // 2. dev server 시작
  const start = async () => {
    app.register(fastifyStatic, {
      root: outputAbsolutePath,
    });
    app.register(fastifyWebsocket, {
      options: { maxPayload: 1048576 },
    });

    // 4. 소켓 엔드포인트 등록
    app.register(async (app) => {
      console.log(
        `[dev-server] 브라우저로 변경 정보를 알려줄 웹소켓 엔드포인트(/dev-server)를 셋업합니다.`
      );
      // @ts-ignore - fastify plugin에서 declare한 것을 override못함 왜일까
      app.get('/dev-server', { websocket: true }, async (socket, request) => {
        const subscribeCallback: SubscribeCallback = async (err, events) => {
          const eventsFile = events.map((it) => `${it.path}`);

          // @ts-ignore
          socket.send(
            createMessage({
              type: 'modifyDetected',
              text: `[dev-server-socket/modifyDetected] 아래 파일들의 수정이 감지되었습니다.\n${eventsFile.join(
                '\n'
              )}`,
            })
          );

          try {
            // 소켓 연결은 여러개일 수 있지만(브라우저 탭 여러개) 리컴파일은 한번만 진행되어야 의도대로 동작한다.

            await runCompiler({ webpackConfig });
            // @ts-ignore
            socket.send(
              createMessage({
                type: 'compileSuccess',
                text: `[dev-server-socket/compileSuccess] 웹팩 리컴파일을 완료했습니다.`,
              })
            );
          } catch (error) {
            // @ts-ignore
            socket.send(
              createMessage({
                type: 'compileFailed',
                text: `[dev-server-socket/compileFailed] 웹팩 리컴파일에 실패했습니다.\n${error}`,
              })
            );
          }
        };

        const cleanUpWatcher = await watcher({
          watchPaths,
          subscribeCallback,
        });

        // @ts-ignore
        socket.on('message', () => {
          const message = createMessage({
            type: 'socketOpen',
            text: '[dev-server/socketOpen] 파일의 변경사항을 전달하는 웹 소켓 서버를 /dev-server 엔드포인트에 엽니다.',
          });
          // @ts-ignore
          socket.send(message);
        });

        // close 등록
        closer = async () => {
          await cleanUpWatcher();
          // @ts-ignore
          socket.close();
        };
      });
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

    // 5. 프로세스를 suspend, cease했을 때 자원 클린업
    process.on('SIGINT', async () => {
      app.close();
      await cleanUpAndShutdown();
    });

    process.on('SIGTSTP', async () => {
      app.close();
      await cleanUpAndShutdown();
    });
  };

  await start();
};
