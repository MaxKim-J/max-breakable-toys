import path from 'path';
import { promises as fs } from 'fs';
import { parseJson } from '../utils/parseJson';

interface PackageInfo {
  name: string;
  location: string;
}

const EXCLUDE_DIR_REGEX = [
  /.*\.yarn.*/,
  /.*\.git.*/,
  /.*\.idea.*/,
  /.*\.node_modules.*/,
];

// 루트디렉토리에서 시작
async function getWorkspacePackages(targetPath: string) {
  let packages: Array<PackageInfo> = [];

  const entries = await fs.readdir(targetPath, { withFileTypes: true });

  for (let entry of entries) {
    const fullPath = path.join(targetPath, entry.name);

    const isExcludedDir = EXCLUDE_DIR_REGEX.map((regex) =>
      regex.test(fullPath)
    ).some((it) => it === true);

    if (isExcludedDir) {
      continue;
    }

    if (entry.isDirectory()) {
      packages = [...packages, ...(await getWorkspacePackages(fullPath))];
    } else if (entry.name === 'package.json') {
      const packageData = await parseJson(fullPath);
      if (packageData.name) {
        packages.push({ location: targetPath, name: packageData.name });
      }
    }
  }

  return packages;
}

export const getWorkspacePackageLocationMap = async (
  targetPath: string
): Promise<Record<string, string>> => {
  const workspaces = await getWorkspacePackages(targetPath);
  return workspaces.reduce(
    (acc, workspace) => ({ ...acc, [workspace.name]: workspace.location }),
    {}
  );
};
