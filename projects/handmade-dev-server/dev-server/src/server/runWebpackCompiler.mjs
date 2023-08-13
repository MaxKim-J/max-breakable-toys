import webpack from "webpack";

export const runWebpackCompiler = async ({ name, webpackConfig }) => {
  const compiler = webpack(webpackConfig);

  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(`${name} 웹팩 컴파일 실패:`, err || stats.toString());
        reject();
      } else {
        console.log(`${name} 웹팩 컴파일 완료`);
        resolve();
      }
    });
  });
};
