import "../app/config";
import { createApp, useBase } from ".pnpm/h3@0.2.12/node_modules/h3/dist";
import { createFetch } from ".pnpm/ohmyfetch@0.1.8_encoding@0.1.13/node_modules/ohmyfetch/dist";
import destr from ".pnpm/destr@1.2.2/node_modules/destr/dist";
import {
  createCall,
  createFetch as createLocalFetch,
} from ".pnpm/@nuxt+un@0.1.1_encoding@0.1.13/node_modules/@nuxt/un/runtime/fetch";
import { timingMiddleware } from "./timing";
import { handleError } from "./error";
// @ts-ignore
import serverMiddleware from "~serverMiddleware";

const app = createApp({
  debug: destr(process.env.DEBUG),
  onError: handleError,
});

app.use(timingMiddleware);
app.use(serverMiddleware);
app.use(() => import("../app/render").then((e) => e.renderMiddleware), {
  lazy: true,
});

export const stack = app.stack;
export const handle = useBase(process.env.ROUTER_BASE, app);
export const localCall = createCall(handle);
export const localFetch = createLocalFetch(localCall, global.fetch);
export const $fetch = (global.$fetch = createFetch({ fetch: localFetch }));
