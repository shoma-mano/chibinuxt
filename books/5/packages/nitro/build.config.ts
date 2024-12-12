import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  // declaration: true,
  entries: [
    {
      input: "src/runtime",
      outDir: "dist/runtime",
      builder: "mkdist",
    },
    {
      input: "src/index",
      builder: "rollup",
    },
  ],
  rollup: {
    commonjs: {},
    emitCJS: true,
  },
});
