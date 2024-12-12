import { resolve } from "path";

import type { Nuxt } from ".";
import globby from "globby";

export async function resolveFiles(
  nuxt: Nuxt,
  pattern: string,
  srcDir: string
) {
  return (
    await globby(pattern, {
      cwd: srcDir,
      followSymbolicLinks: nuxt.options.build.followSymlinks,
    })
  ).map((p) => resolve(srcDir, p));
}
