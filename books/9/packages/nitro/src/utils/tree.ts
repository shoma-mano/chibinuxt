import { resolve, dirname, relative } from "upath";
import globby from ".pnpm/globby@11.1.0/node_modules/globby";
import prettyBytes from ".pnpm/pretty-bytes@5.6.0/node_modules/pretty-bytes";
import gzipSize from ".pnpm/gzip-size@6.0.0/node_modules/gzip-size";
import { readFile } from ".pnpm/fs-extra@9.1.0/node_modules/fs-extra/lib";
import chalk from ".pnpm/chalk@4.1.2/node_modules/chalk";
import stdenv from ".pnpm/std-env@2.3.1/node_modules/std-env";

export async function printFSTree(dir) {
  if (stdenv.test) {
    return;
  }

  const files = await globby("**/*.*", { cwd: dir });

  const items = (
    await Promise.all(
      files.map(async (file) => {
        const path = resolve(dir, file);
        const src = await readFile(path);
        const size = src.byteLength;
        const gzip = await gzipSize(src);
        return { file, path, size, gzip };
      })
    )
  ).sort((a, b) => b.path.localeCompare(a.path));

  let totalSize = 0;
  let totalGzip = 0;

  let totalNodeModulesSize = 0;
  let totalNodeModulesGzip = 0;

  items.forEach((item, index) => {
    let dir = dirname(item.file);
    if (dir === ".") {
      dir = "";
    }
    const rpath = relative(process.cwd(), item.path);
    const treeChar = index === items.length - 1 ? "└─" : "├─";

    const isNodeModules = item.file.includes("node_modules");

    if (isNodeModules) {
      totalNodeModulesSize += item.size;
      totalNodeModulesGzip += item.gzip;
      return;
    }

    process.stdout.write(
      chalk.gray(
        `  ${treeChar} ${rpath} (${prettyBytes(item.size)}) (${prettyBytes(
          item.gzip
        )} gzip)\n`
      )
    );
    totalSize += item.size;
    totalGzip += item.gzip;
  });

  process.stdout.write(
    `${chalk.cyan("Σ Total size:")} ${prettyBytes(
      totalSize + totalNodeModulesSize
    )} (${prettyBytes(totalGzip + totalNodeModulesGzip)} gzip)\n`
  );
}
