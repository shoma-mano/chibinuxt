import { Worker } from "worker_threads";
import {
  createApp,
  defineEventHandler,
  dynamicEventHandler,
  fromNodeMiddleware,
  toNodeListener,
} from "h3";
import { resolve } from "path";
import { debounce } from "perfect-debounce";
// @ts-ignore
import chokidar from "chokidar";
import { listen } from "listhen";
import serveStatic from "serve-static";
import type { Listener } from "listhen";
import { statSync } from "fs";
import type { NitroContext } from "../context";
import { createProxyServer } from "httpxy";

export function createDevServer(nitroContext: NitroContext) {
  // App
  const app = createApp();

  // _nuxt and static
  app.use(
    nitroContext._nuxt.publicPath,
    fromNodeMiddleware(
      serveStatic(resolve(nitroContext._nuxt.buildDir, "dist/client"))
    )
  );
  app.use(
    nitroContext._nuxt.routerBase,
    fromNodeMiddleware(serveStatic(resolve(nitroContext._nuxt.staticDir)))
  );

  // Dynamic Middlwware
  const legacyMiddleware = createDynamicMiddleware();
  const devMiddleware = dynamicEventHandler();
  // app.use(fromNodeMiddleware(legacyMiddleware.middleware));
  app.use(nitroContext.viteDevHandler!);
  app.use(
    defineEventHandler((event) => {
      console.log("event", event.path);
    })
  );

  // Worker
  const workerEntry = resolve(
    nitroContext.output.dir,
    nitroContext.output.serverDir,
    "index.js"
  );
  let pendingWorker: Worker | null;
  let activeWorker: Worker;
  let workerAddress: string | null;
  async function reload() {
    if (pendingWorker) {
      await pendingWorker.terminate();
      workerAddress = null;
      pendingWorker = null;
    }
    if (!statSync(workerEntry).isFile) {
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
          console.log("[worker] ready at", workerAddress);
          activeWorker = worker;
          pendingWorker = null;
          resolve(workerAddress);
        }
      });
    });
  }

  // SSR Proxy
  const proxy = createProxyServer({});
  app.use(
    defineEventHandler(async (event) => {
      const { req, res } = event.node;
      if (workerAddress) {
        console.log("workerAddress", workerAddress, "req.url", req.url);
        await proxy.web(req, res, { target: workerAddress }, (_err: any) => {
          console.log("proxy error", _err);
        });
      } else {
        res.end("Worker not ready!");
      }
    }),
    { lazy: false }
  );

  // Listen
  let listeners: Listener[] = [];
  const _listen = async (port: number, opts?: any) => {
    const handler = toNodeListener(app);
    const listener = await listen(handler, { port, ...opts });
    listeners.push(listener);
    return listener;
  };

  // Watch for dist and reload worker
  const pattern = "**/*.{js,json}";
  const events = ["add", "change"];
  let watcher: any;
  function watch() {
    if (watcher) {
      return;
    }
    const dReload = debounce(() => reload().catch(console.warn), 500);
    watcher = chokidar
      .watch([
        resolve(nitroContext.output.serverDir, pattern),
        // resolve(nitroContext._nuxt.buildDir, "dist/server", pattern),
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
  let middleware: any;
  return {
    set: async (input: any) => {
      if (!Array.isArray(input)) {
        middleware = input;
        return;
      }
    },
    middleware: (req: any, res: any, next: any) =>
      middleware ? middleware(req, res, next) : next(),
  };
}
