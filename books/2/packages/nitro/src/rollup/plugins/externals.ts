import { isAbsolute, relative } from "path";
import type { Plugin } from "rollup";
import { NodeFileTraceOptions } from "@vercel/nft";

export interface NodeExternalsOptions {
  ignore?: string[];
  outDir?: string;
  trace?: boolean;
  traceOptions?: NodeFileTraceOptions;
  moduleDirectories?: string[];
}

export function externals(opts: NodeExternalsOptions): Plugin {
  const resolvedExternals = {};
  return {
    name: "node-externals",
    resolveId(id) {
      // Internals
      if (id.startsWith("\x00") || id.includes("?")) {
        return null;
      }

      // Resolve relative paths and exceptions
      if (id.startsWith(".") || opts.ignore.find((i) => id.startsWith(i))) {
        return null;
      }

      // for (const dir of opts.moduleDirectories) {
      //   if (id.startsWith(dir)) {
      //     id = id.substr(dir.length + 1);
      //     break;
      //   }
      // }

      try {
        resolvedExternals[id] = require.resolve(id, {
          paths: opts.moduleDirectories,
        });
      } catch (_err) {}

      return {
        id: isAbsolute(id) ? relative(opts.outDir, id) : id,
        external: true,
      };
    },
  };
}
