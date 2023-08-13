import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs/promises";

export const getConfig = async (directory) => {
  try {
    const configFile = path.join(directory, "mf.config.mjs");
    const isConfigFileExists = await fs
      .access(configFile)
      .then(() => true)
      .catch(() => false);

    if (isConfigFileExists) {
      const config = await import(configFile);
      return { ...config.default, appDir: directory };
    } else {
      console.log("mf.config.mjs 파일을 찾을 수 없습니다.");
    }
  } catch (err) {
    console.error("오류 발생:", err);
  }
};
