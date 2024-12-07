import { build as _build } from "vite";
import vue from "@vitejs/plugin-vue";
import { join } from "path";

export const build = async () => {
  try {
    await _build({
      plugins: [vue()],
      build: {
        rollupOptions: {
          input: join(import.meta.dirname, "createApp.ts"),
          output: {
            format: "esm",
            dir: join(import.meta.dirname, "dist"),
            entryFileNames: "createApp.js",
          },
          preserveEntrySignatures: "exports-only",
          treeshake: false,
        },
      },
    });
    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};
