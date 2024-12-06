import { Worker } from "worker_threads";
import { createApp } from ".pnpm/h3@0.2.12/node_modules/h3/dist";
import { resolve } from "upath";
import debounce from ".pnpm/debounce@1.2.1/node_modules/debounce";
import chokidar from ".pnpm/chokidar@3.6.0/node_modules/chokidar/types";
import {
  listen,
  Listener,
} from ".pnpm/listhen@0.1.4_encoding@0.1.13/node_modules/listhen/dist";
import serveStatic from ".pnpm/serve-static@1.16.2/node_modules/serve-static";
import servePlaceholder from ".pnpm/serve-placeholder@1.2.4/node_modules/serve-placeholder/src";
import { createProxy } from ".pnpm/http-proxy@1.18.1/node_modules/http-proxy";
import { stat } from ".pnpm/fs-extra@9.1.0/node_modules/fs-extra/lib";
import type { NitroContext } from "../context";

export function createDevServer(nitroContext: NitroContext) {
  // Worker
  const workerEntry = resolve(
    nitroContext.output.dir,
    nitroContext.output.serverDir,
    "index.js"
  );
  let pendingWorker: Worker;
  let activeWorker: Worker;
  let workerAddress: string;
  async function reload() {
    if (pendingWorker) {
      await pendingWorker.terminate();
      workerAddress = null;
      pendingWorker = null;
    }
    if (!(await stat(workerEntry)).isFile) {
      throw new Error("Entry not found: " + workerEntry);
    }
    return new Promise((resolve, reject) => {
      const worker = (pendingWorker = new Worker(workerEntry));
      worker.once("exit", (code) => {
        if (code) {
          reject(new Error("[worker] exited with code: " + code));
        }
      });
      worker.on("error", (err) => {
        err.message = "[worker] " + err.message;
        reject(err);
      });
      worker.on("message", (event) => {
        if (event && event.port) {
          workerAddress = "http://localhost:" + event.port;
          activeWorker = worker;
          pendingWorker = null;
          resolve(workerAddress);
        }
      });
    });
  }

  // App
  const app = createApp();

  // _nuxt and static
  app.use(
    nitroContext._nuxt.publicPath,
    serveStatic(resolve(nitroContext._nuxt.buildDir, "dist/client"))
  );
  app.use(
    nitroContext._nuxt.routerBase,
    serveStatic(resolve(nitroContext._nuxt.staticDir))
  );

  // Dynamic Middlwware
  const legacyMiddleware = createDynamicMiddleware();
  const devMiddleware = createDynamicMiddleware();
  app.use(legacyMiddleware.middleware);
  app.use(devMiddleware.middleware);

  // serve placeholder 404 assets instead of hitting SSR
  app.use(nitroContext._nuxt.publicPath, servePlaceholder());
  app.use(
    nitroContext._nuxt.routerBase,
    servePlaceholder({ skipUnknown: true })
  );

  // SSR Proxy
  const proxy = createProxy();
  app.use((req, res) => {
    if (workerAddress) {
      proxy.web(req, res, { target: workerAddress }, (_err) => {
        // console.error('[proxy]', err)
      });
    } else {
      res.end("Worker not ready!");
    }
  });

  // Listen
  let listeners: Listener[] = [];
  const _listen = async (port, opts?) => {
    const listener = await listen(app, { port, ...opts });
    listeners.push(listener);
    return listener;
  };

  // Watch for dist and reload worker
  const pattern = "**/*.{js,json}";
  const events = ["add", "change"];
  let watcher;
  function watch() {
    if (watcher) {
      return;
    }
    const dReload = debounce(() => reload().catch(console.warn), 200, true);
    watcher = chokidar
      .watch([
        resolve(nitroContext.output.serverDir, pattern),
        resolve(nitroContext._nuxt.buildDir, "dist/server", pattern),
      ])
      .on("all", (event) => events.includes(event) && dReload());
  }

  // Close handler
  async function close() {
    if (watcher) {
      await watcher.close();
    }
    if (activeWorker) {
      await activeWorker.terminate();
    }
    if (pendingWorker) {
      await pendingWorker.terminate();
    }
    await Promise.all(listeners.map((l) => l.close()));
    listeners = [];
  }
  nitroContext._internal.hooks.hook("close", close);

  return {
    reload,
    listen: _listen,
    close,
    watch,
    setLegacyMiddleware: legacyMiddleware.set,
    setDevMiddleware: devMiddleware.set,
  };
}

function createDynamicMiddleware() {
  let middleware;
  return {
    set: (input) => {
      if (!Array.isArray(input)) {
        middleware = input;
        return;
      }
      const app = require("connect")();
      for (const m of input) {
        app.use(m.path || m.route || "/", m.handler || m.handle);
      }
      middleware = app;
    },
    middleware: (req, res, next) =>
      middleware ? middleware(req, res, next) : next(),
  };
}
