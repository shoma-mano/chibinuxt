import chokidar, {
  WatchOptions,
} from ".pnpm/chokidar@3.6.0/node_modules/chokidar/types";
import defu from ".pnpm/defu@3.2.2/node_modules/defu/dist/defu";
import consola from ".pnpm/consola@2.15.3/node_modules/consola/types/consola";
import Ignore from "./ignore";

export function createWatcher(
  pattern: string,
  options?: WatchOptions,
  ignore?: Ignore
) {
  const opts = defu(options, {
    ignored: [],
    ignoreInitial: true,
  });
  const watcher = chokidar.watch(pattern, opts);
  const watchAll = (cb: Function, filter?: Function) => {
    watcher.on("all", (event, path: string) => {
      if (ignore && ignore.ignores(path)) {
        return;
      }
      const _event = { event, path };
      if (!filter || filter(_event)) {
        cb(_event);
      }
    });
  };

  const watch = (pattern: string | RegExp, cb: Function, events?: string[]) =>
    watchAll(
      cb,
      ({ event, path }) =>
        path.match(pattern) && (!events || events.includes(event))
    );

  const debug = (tag: string = "[Watcher]") => {
    consola.log(tag, "Watching ", pattern);
    watchAll((e) => {
      consola.log(tag, e.event, e.path);
    });
  };

  return {
    watchAll,
    watch,
    debug,
    close: () => watcher.close(),
  };
}

export type Watcher = ReturnType<typeof createWatcher>;
