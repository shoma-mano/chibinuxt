import { createApp, useBase } from "../../../../../node_modules/.pnpm/h3@0.2.12/node_modules/h3/dist/index.cjs";
import destr from "destr";

const app = createApp({
  debug: destr(process.env.DEBUG),
  onError: () => "error",
});

// app.use(serverMiddleware);
app.use(() => import("../app/render").then((e) => e.renderMiddleware), {
  lazy: true,
});

export const stack = app.stack;
export const handle = useBase(process.env.ROUTER_BASE, app);
