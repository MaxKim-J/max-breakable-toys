import path from "path";
import fs from "fs/promises";

export const getAppDirs = async (startDirectory) => {
  try {
    const searchConfigFile = async (directory) => {
      const configFile = path.join(directory, "mf.config.mjs");
      const isConfigFileExists = await fs
        .access(configFile)
        .then(() => true)
        .catch(() => false);

      return isConfigFileExists ? directory : null;
    };

    const configDirectories = [];

    const parentDirectory = path.resolve(startDirectory, "..");
    const parentContents = await fs.readdir(parentDirectory);

    for (const content of parentContents) {
      const contentPath = path.join(parentDirectory, content);
      const stats = await fs.stat(contentPath);

      if (stats.isDirectory()) {
        const configDirectory = await searchConfigFile(contentPath);
        if (configDirectory) {
          configDirectories.push(configDirectory);
        }
      }
    }

    return configDirectories;
  } catch (err) {
    console.error("오류 발생:", err);
    return [];
  }
};
