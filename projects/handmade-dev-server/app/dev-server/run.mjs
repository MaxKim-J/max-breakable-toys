import path from 'node:path';
import fs from 'node:fs/promises';
import { build } from 'esbuild';

const rootDir = process.env.PROJECT_CWD;
const webpackConfigPath = `${rootDir}/webpack.config.mjs`;
const packageJsonPath = `${rootDir}/package.json`;

// 파일 루트에서 webpack config를 찾아야

async function transpileAndExecuteBinScript() {
  try {
    await transpileBinScript();
    await executeBinScript();
  } catch (e) {
    console.info('[start] Typescript 트랜스파일링 및 실행 실패');
    console.error(e);
  }
}

const transpileBinScript = async () => {
  console.info('[start]Typescript 트랜스파일링 시작');
  const config = await getEsbuildConfig();
  await build(config);
  console.info('[start] 스크립트 코드 Typescript 트랜스파일링 완료');
};

const executeBinScript = async () => {
  const { runDevServer } = await import(
    path.resolve(rootDir, './__temp/server.mjs')
  );
  const { default: webpackConfig } = await import(webpackConfigPath);

  runDevServer({ webpackConfig });
};

const getEsbuildConfig = async () => {
  const pkg = await loadJSON(packageJsonPath);
  const external = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });

  const entryPoint = path.resolve(rootDir, './dev-server/server.ts');
  const outdir = path.resolve(rootDir, './__temp');

  return {
    entryPoints: [entryPoint],
    outdir,
    bundle: true,
    write: true,
    platform: 'node',
    target: 'node16',
    outExtension: { '.js': '.mjs' },
    format: 'esm',
    external,
  };
};

const loadJSON = async (path) => {
  const data = await fs.readFile(path);
  const json = JSON.parse(data.toString());

  return json;
};

transpileAndExecuteBinScript();
