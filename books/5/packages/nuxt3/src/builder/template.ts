import { join, dirname } from "path";
import fsExtra from "fs-extra";
import * as nxt from "./nxt";
import { Nuxt } from "../core";
import { NuxtApp } from "./app";

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

export function templateData(nuxt: Nuxt, app: NuxtApp) {
  return {
    app,
    nuxtOptions: nuxt.options,
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
