import { Command, Option } from "clipanion";
import path from "node:path";
import { getAppDirs, getConfig } from "../utils/index.mjs";
import { runDevServer } from "../server/runDevServer.mjs";
import { appFileTracer } from "../watcher/tracer.mjs";

export class DevCommand extends Command {
  name = Option.String();
  remotes = Option.Array(`--remote`);

  async execute() {
    const appDirs = await getAppDirs(process.env.PWD);
    // console.info(appDirs);
    const mfAppConfigMap = await this.findAllMfAppConfigMap(appDirs);

    // 리졸브 필터링(workspace 호환) -> 앱별 영향받는 디렉토리를 파악한다.
    console.info("띄우는 앱들 영향범위를 리졸브합니다.");
    appFileTracer(appDirs[0], "./src/App.tsx");

    // 워처를 해당 디렉토리로 말미암아서 최소한만 워치할 수 있도록(하지만 구분은 되도록)
    console.info("워처를 시작합니다");

    // 워처의 코드 변경을 큐에 담아서 처리하도록 -> 이때 디바운스/트리거링을 할 수 있게 처리함

    await Promise.all(
      Object.keys(mfAppConfigMap).map((key) => {
        const config = mfAppConfigMap[key];

        // runDevServer에는
        return runDevServer({ config });
      })
    );
  }

  async findAllMfAppConfigMap(appDirs) {
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
