import type { IncomingHttpHeaders } from "http";

import isPlainObject from "lodash/isPlainObject";
import { Hookable, createHooks } from "hookable";

import { getNuxtConfig } from "../config";
import type { Configuration, NormalizedConfiguration } from "../config";

import { version } from "../../package.json";

import Resolver from "./resolver";
import { initNitro } from "./nitro";

declare global {
  namespace NodeJS {
    interface Global {
      __NUXT_DEV__: boolean;
    }
  }
}

export interface Nuxt {
  _ready?: Promise<this | undefined>;
  _initCalled?: boolean;

  error?: Error & { statusCode?: number; headers?: IncomingHttpHeaders };
  options: NormalizedConfiguration;
  resolver?: Resolver;
  version: string;
  server?: any;
  renderer?: any;
  render?: any["app"];
  hooks: Hookable<any>;
  showReady?: () => void;
  init: () => Promise<Nuxt | undefined>;
  ready: () => Promise<Nuxt | undefined>;
  close: (callback?: () => any | Promise<any>) => Promise<void>;
}

export const createNuxt = (options: Configuration = {}) => {
  const hooks = createHooks<any>();

  const normalizedOptions = getNuxtConfig(options);

  const nuxt: Nuxt = {
    hooks,
    _ready: undefined,
    _initCalled: false,
    error: undefined,
    options: normalizedOptions as any,
    server: undefined,
    renderer: undefined,
    render: undefined,
    showReady: undefined,
    ready: () => {
      const init = initNuxt(nuxt);
      if (!nuxt._ready && init) {
        nuxt._ready = init;
      }
      return nuxt._ready!;
    },
    init: () => initNuxt(nuxt),
    get version() {
      return (
        `v${version}` + ((global as any).__NUXT_DEV__ ? "-development" : "")
      );
    },
    async close(callback?: () => any | Promise<any>) {
      await hooks.callHook("close", this);

      if (typeof callback === "function") {
        await callback();
      }
    },
  };
  nuxt.resolver = new Resolver(nuxt);

  return nuxt;
};

const initNuxt = async (nuxt: Nuxt) => {
  if (nuxt._initCalled) {
    return this;
  }
  nuxt._initCalled = true;

  // Add hooks
  if (nuxt.options.hooks instanceof Function) {
    nuxt.options.hooks(nuxt.hooks);
  } else if (isPlainObject(nuxt.options.hooks)) {
    nuxt.hooks.addHooks(nuxt.options.hooks);
  }

  // Await for server
  await initNitro(nuxt);

  // Await for modules
  // await this.moduleContainer.ready()

  // Call ready hook
  await nuxt.hooks.callHook("ready", this);

  return nuxt;
};
