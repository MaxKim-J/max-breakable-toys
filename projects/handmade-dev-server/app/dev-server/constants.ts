export const workspaceRootDir = process.env.PROJECT_CWD as string;

export const projectRootDir = process.env.INIT_CWD as string;
export const executeDir = process.env.PWD as string;

export const webpackConfigPath = `${projectRootDir}/webpack.config.mjs`;
export const packageJsonPath = `${projectRootDir}/package.json`;
