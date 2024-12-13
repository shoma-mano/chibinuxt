import { build as _build } from "vite";
import vue from "@vitejs/plugin-vue";
import { join } from "path";

const build = async (target: string) => {
  try {
    await _build({
      plugins: [vue()],
      build: {
        rollupOptions: {
          input: join(import.meta.dirname, `${target}.ts`),
          output: {
            format: "esm",
            dir: join(import.meta.dirname, "dist"),
            entryFileNames: `${target}.js`,
          },
          preserveEntrySignatures: "exports-only",
          treeshake: false,
        },
        emptyOutDir: false,
      },
    });
    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

export const buildServerEntry = async () => {
  await build("entry.server");
};

export const buildClientEntry = async () => {
  await build("entry.client");
};
