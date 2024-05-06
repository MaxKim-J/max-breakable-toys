import webpack, { Configuration } from 'webpack';

interface Params {
  webpackConfig: Configuration;
}

let isFunctionRunning = false; // 함수 실행 상태를 추적하는 전역 변수
let pendingResolve: any[] = []; // 대기 중인 promise를 저장하는 array

export const runCompiler = async ({ webpackConfig }: Params): Promise<void> => {
  if (isFunctionRunning) {
    return new Promise((resolve) => {
      pendingResolve.push(resolve);
    });
  }

  isFunctionRunning = true;

  const compiler = webpack(webpackConfig);

  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || (stats && stats.hasErrors())) {
        reject(stats?.toString());
      } else {
        resolve('success');
      }
    });
  });

  isFunctionRunning = false;

  while (pendingResolve.length > 0) {
    const res = pendingResolve.shift();
    res();
  }
};
