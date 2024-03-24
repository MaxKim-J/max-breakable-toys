import enhancedResolve from 'enhanced-resolve';

const resolver = enhancedResolve.create({
  extensions: ['.ts', '.tsx'],
});

interface Params {
  dir: string;
  filePath: string;
}

export const resolve = ({ dir, filePath }: Params): Promise<string> =>
  new Promise((res, rej) => {
    resolver(dir, filePath, (err, result) => {
      if (err) {
        rej(err);
      }

      if (result) {
        res(result);
      }
    });
  });
