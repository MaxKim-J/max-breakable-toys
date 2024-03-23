import path from 'node:path';
import fs from 'node:fs/promises';
import { build } from 'esbuild';

const rootDir = process.env.PROJECT_CWD;
const packageDir = path.resolve(rootDir, 'projects/handmade-dev-server/app');
const webpackConfigPath = `${packageDir}/webpack.config.mjs`;
const packageJsonPath = `${packageDir}/package.json`;

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
    path.resolve(packageDir, './__temp/server.mjs')
  );
  const { default: webpackConfig } = await import(webpackConfigPath);

  runDevServer({ webpackConfig });
};

const getEsbuildConfig = async () => {
  const pkg = await loadJSON(packageJsonPath);

  const entryPoints = [path.resolve(packageDir, './dev-server/server.ts')];
  const outdir = path.resolve(packageDir, './__temp');
  const external = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });

  return {
    entryPoints,
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
