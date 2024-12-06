import { join, dirname } from "path";
import fsExtra from ".pnpm/@types+fs-extra@9.0.13/node_modules/@types/fs-extra";
import * as nxt from "./nxt";

export interface NuxtTemplate {
  fileName: string; // Relative path of destination
  getContents?: (data: {
    globals: any;
    app: any;
    nuxtOptions: any;
    nxt: any;
  }) => string;
  data?: any;
}

export function templateData(builder) {
  return {
    globals: builder.globals,
    app: builder.app,
    nuxtOptions: builder.nuxt.options,
    nxt,
  };
}

async function compileTemplate(
  { fileName, data, getContents }: NuxtTemplate,
  destDir: string
) {
  const compiledSrc = getContents ? getContents(data) : "";
  const dest = join(destDir, fileName);
  await fsExtra.mkdirp(dirname(dest));
  await fsExtra.writeFile(dest, compiledSrc);
}

export function compileTemplates(templates: NuxtTemplate[], destDir: string) {
  return Promise.all(
    templates.map((t) => {
      return compileTemplate(t, destDir);
    })
  );
}

export function watchTemplate(
  template: NuxtTemplate,
  _watcher: any,
  _cb: Function
) {
  template.data = new Proxy(template.data, {
    // TODO: deep watch option changes
  });
  // TODO: Watch fs changes
}
