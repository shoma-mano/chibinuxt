import consola from ".pnpm/consola@2.15.3/node_modules/consola/types/consola";
import { extendPreset, prettyPath } from "../utils";
import { NitroPreset, NitroContext } from "../context";
import { node } from "./node";

export const cli: NitroPreset = extendPreset(node, {
  entry: "{{ _internal.runtimeDir }}/entries/cli",
  hooks: {
    "nitro:compiled"({ output }: NitroContext) {
      consola.info(
        "Run with `node " + prettyPath(output.serverDir) + " [route]`"
      );
    },
  },
});
