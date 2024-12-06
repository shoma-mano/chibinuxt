import "../app/config";
import { createApp, useBase } from "h3";
import destr from "destr";

// @ts-ignore
import serverMiddleware from "~serverMiddleware";

const app = createApp({
  debug: destr(process.env.DEBUG),
  onError: () => "error",
});

app.use(serverMiddleware);
app.use(() => import("../app/render").then((e) => e.renderMiddleware), {
  lazy: true,
});

export const stack = app.stack;
export const handle = useBase(process.env.ROUTER_BASE, app);
