export const projectRootDir = process.env.INIT_CWD as string;
export const rootDir = process.env.PROJECT_CWD as string;
export const executeDir = process.env.PWD as string;

export const webpackConfigPath = `${rootDir}/webpack.config.mjs`;
export const packageJsonPath = `${rootDir}/package.json`;
