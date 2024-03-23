import { nodeFileTrace } from "@vercel/nft";
import fs from "fs/promises";
import esbuild from "esbuild";
import enhancedResolve from "enhanced-resolve";
import { resolve, dirname } from "node:path";

export const appFileTracer = async (base, entry) => {
  // CWD internal file trace
  const fileTraceList = await nodeFileTrace([entry], {
    base,
    ignore: ["package.json"],
    resolve: async (id, path, ...args) => {
      return await resolvePromise(path, id);
    },
    readFile: async (path) => {
      return await transformFile(path);
    },
  });

  // External File Trace

  console.info(fileTraceList);

  return "";
};

const customEnhancedResolver = enhancedResolve.create({
  extensions: [".ts", ".tsx", ".jsx", ".js"],
});

const resolvePromise = (path, id) => {
  return new Promise((resolve, reject) => {
    customEnhancedResolver(dirname(path), id, (err, result) => {
      console.info("리졸브 결과", dirname(path), id, result);
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

const transformFile = async (filePath) => {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");

    const transformedCode = await esbuild.transform(fileContent, {
      loader: "tsx",
      target: "esnext",
    });

    return transformedCode.code;
  } catch (error) {
    console.error("Error transforming file:", error);
    return null;
  }
};
