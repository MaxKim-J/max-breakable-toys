import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import path from 'path';
import process from 'process';
import { Configuration } from 'webpack';
import { type SubscribeCallback } from '@parcel/watcher';

import { rootDir } from './constants';
import { runCompiler } from './webpack/runCompiler';
import { getWatchPaths } from './watcher/getWatchPaths';
import { watcher } from './watcher/watcher';
import { createMessage } from './socket/messageParser';

const port = 3000;

interface Params {
  webpackConfig: Configuration;
}

export const runDevServer = async ({ webpackConfig }: Params) => {
  // TODO: parseWebpackConfig
  const entry = webpackConfig.entry as string; // 배열일수도 있긴 한데 일단
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

  const app = fastify();

  // 2. dev server 시작
  const start = async () => {
    // TODO 3. 웹소켓열어주기

    app.register(fastifyStatic, {
      root: outputAbsolutePath,
    });
    app.register(fastifyWebsocket, {
      options: { maxPayload: 1048576 },
    });

    app.register(async (app) => {
      console.log(
        `[dev-server] 브라우저로 변경 정보를 알려줄 웹소켓 엔드포인트(/dev-server)를 셋업합니다.`
      );
      // @ts-ignore - fastify plugin에서 declare한 것을 override못함 왜일까
      app.get('/dev-server', { websocket: true }, async (socket, request) => {
        const cleanUpWatcher = await watcher({
          watchPaths,
          subscribeCallback: async (err, events) => {
            const eventsFile = events.map((it) => `${it.path}`);

            // @ts-ignore
            socket.send(
              createMessage({
                type: 'notice',
                text: `[dev-server] 아래 파일들의 수정이 감지되었습니다.\n${eventsFile.join(
                  '\n'
                )}`,
              })
            );

            console.info(
              `\n[dev-server] 아래 파일들의 수정이 감지되었습니다.\n${eventsFile.join(
                '\n'
              )}`
            );

            await runCompiler({ webpackConfig });

            // @ts-ignore
            socket.send(
              createMessage({
                type: 'modify',
                text: `[dev-server] 웹팩 리컴파일을 완료했습니다.`,
              })
            );

            console.info(`[dev-server] 웹팩 리컴파일을 완료했습니다.`);

            // TODO 3. 웹소켓으로 브라우저에 메시지를 전달해준다
            // 웹 소켓 센드를 넣어야하는데 어캐해야하노 + close를 하면 watcher를 닫느다
          },
        });

        // @ts-ignore
        socket.on('message', () => {
          const message = createMessage({
            type: 'notice',
            text: '[dev-server] 파일의 변경사항을 전달하는 웹 소켓 서버를 /dev-server 엔드포인트에 엽니다.',
          });
          // @ts-ignore
          socket.send(message);
        });

        // 서버가 죽으면 소켓과 워처를 죽인다
        process.on('SIGINT', async () => {
          await cleanUpWatcher();
          // @ts-ignore
          socket.close();
          console.log(
            `[dev-server] 서버를 종료합니다. Watcher와 Socket을 정리합니다.`
          );
        });
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
  };

  await start();
};
