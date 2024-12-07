import { resolve } from "path";
import globby from ".pnpm/globby@11.1.0/node_modules/globby";
import { Builder } from "./builder";

// TODO: move to core resolver
export async function resolveFiles(
  builder: Builder,
  pattern: string,
  srcDir: string
) {
  const { nuxt } = builder;

  return builder.ignore
    .filter(
      await globby(pattern, {
        cwd: srcDir,
        followSymbolicLinks: nuxt.options.build.followSymlinks,
      })
    )
    .map((p) => resolve(srcDir, p));
}
