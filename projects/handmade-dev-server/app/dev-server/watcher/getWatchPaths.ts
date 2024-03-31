import { promises as fsPromises, watch } from 'fs';
import path from 'path';

import { resolve } from './resolver';
import { getWorkspacePackageLocationMap } from './getWorkspacePackages';

import { projectRootDir, executeDir } from '../constants';

interface ProcessParams {
  watchPaths: string[];
  targetDir: string;
  workspaceLocationMap: Record<string, string>;
}

const searchWatchPath = async ({
  watchPaths,
  targetDir,
  workspaceLocationMap,
}: ProcessParams): Promise<string[]> => {
  const fileContent = await fsPromises.readFile(targetDir, 'utf8');
  const importRegex =
    /import(.+?)from(.+?);|require\((.+?)\);|import\((.+?)\)/g;

  const matches = [...fileContent.matchAll(importRegex)];

  for (let matched of matches) {
    let importSource =
      matched[2]?.replace(/['";\s]/g, '') ||
      matched[3]?.replace(/['";\s]/g, '') ||
      (matched[4]?.replace(/['";\s]/g, '') as string);

    //! watch 대상 탐색하기

    const isRelativeImportSource = importSource.startsWith('.');

    // * [1] import source가 상대경로일때는 계속 타고 내려간다
    // TODO: 아래 명시된 최적화를 진행하려면 완전 파일 최초 엔트리인 경우, 내부 의존성 패키지를 리졸브하려는 경우는 다르게 다뤄져야 한다
    if (isRelativeImportSource) {
      const newTargetDir = await resolve({
        dir: path.dirname(targetDir),
        filePath: importSource,
      });
      return await searchWatchPath({
        watchPaths,
        targetDir: newTargetDir,
        workspaceLocationMap,
      });
    }

    // * [2] import source가 상대경로가 아닌 경우이면서 내부 workspace인 경우에 해당 디렉토리를 워치 대상에 넣는다
    // TODO: 하고 또 해당 패키지의 엔트리로 들어가서 다시 파일 순회를 해야한다
    // TODO: 파일 순회를 할때 export path를 리졸브하면 필연적으로 배럴파일을 지나면서 watch할 디렉토리가 많아지는데 이걸 최적화할 수 없을지?
    const workspaceLoc = workspaceLocationMap[importSource];
    if (!isRelativeImportSource && workspaceLoc !== undefined) {
      watchPaths = [...watchPaths, workspaceLoc];
      return watchPaths;
    }
  }

  return watchPaths;
};

export const getWatchPaths = async (entry: string) => {
  const workspaceLocationMap = await getWorkspacePackageLocationMap(
    projectRootDir
  );

  // 루트 디렉토리가 진짜 웹팩 엔트리의 dir가 아닐수도 있긴! 하다, 그냥 해당 패키지 전체를 그냥 watch해야할 수도
  const watchPathIncludedEntry = [
    path.dirname(path.resolve(executeDir, entry)),
  ];

  const finalWatchPaths = await searchWatchPath({
    watchPaths: watchPathIncludedEntry,
    workspaceLocationMap,
    targetDir: entry,
  });

  return finalWatchPaths;
};
