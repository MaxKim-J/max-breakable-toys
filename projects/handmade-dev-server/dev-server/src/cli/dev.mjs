import { Command, Option } from "clipanion";
import { getAppDirs, getConfig } from "../utils/index.mjs";
import { runDevServer } from "../server/runDevServer.mjs";

export class DevCommand extends Command {
  name = Option.String();
  remotes = Option.Array(`--remote`);

  async execute() {
    const mfAppConfigMap = await this.findAllMfAppConfigMap();

    // 필터링

    // 워처

    // 서버 실행 -> 이때 트리거링을 할 수 있게

    await Promise.all(
      Object.keys(mfAppConfigMap).map((key) => {
        const config = mfAppConfigMap[key];

        return runDevServer({ config });
      })
    );
  }

  async findAllMfAppConfigMap() {
    const appDirs = await getAppDirs(process.env.PWD);
    const configs = await Promise.all(appDirs.map((dir) => getConfig(dir)));

    const configMap = configs.reduce(
      (configs, config) => ({
        ...configs,
        [config.name]: config,
      }),
      {}
    );

    return configMap;
  }

  runDevServers() {}
}
