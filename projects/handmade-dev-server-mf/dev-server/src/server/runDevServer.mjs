import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";

import { runWebpackCompiler } from "./runWebpackCompiler.mjs";
import { config as hostWebpackConfig } from "../webpack/webpack.host.config.mjs";
import { config as remoteWebpackConfig } from "../webpack/webpack.remote.config.mjs";

// 프록시에 반영되도록 한다..?
// 서버가 뜰 때 리졸브한 것들을 받을 수 있어야 함
export const runDevServer = async ({ config, watchDir }) => {
  const { layer, port, appDir: dirname, name } = config;

  // watch하면 다시 리컴파일 할 수 있도록 처리
  await runWebpackCompiler({
    name,
    webpackConfig:
      layer === "host"
        ? hostWebpackConfig({ config })
        : remoteWebpackConfig({ config }),
  });

  // layer에 맞는 webpack config

  const staticRootPath = path.resolve(dirname, "dist");

  const app = fastify();

  app.register(fastifyStatic, {
    root: staticRootPath,
  });

  // 서버 시작
  const start = async () => {
    try {
      await app.listen({ port });
      console.log(`${name} 서버가 ${port} 포트에서 실행 중입니다.`);
    } catch (err) {
      console.error("서버 시작 중 오류 발생:", err);
      process.exit(1);
    }
  };

  start();
};
