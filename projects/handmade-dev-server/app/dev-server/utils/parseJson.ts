import { promises as fs } from 'fs';

export const parseJson = async (targetPath: string): Promise<any> => {
  const packageJsonFileString = (await fs.readFile(
    targetPath,
    'utf-8'
  )) as string;

  return JSON.parse(packageJsonFileString);
};
