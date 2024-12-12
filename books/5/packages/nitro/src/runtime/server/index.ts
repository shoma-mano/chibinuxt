import { createApp, defineEventHandler, toNodeListener } from "h3";
import { renderMiddleware } from "../app/render";

const app = createApp({
  onError: () => "error",
});

app.use(
  defineEventHandler((event) => {
    console.log("event!!!");
  })
);

app.use(renderMiddleware);

export const handle = toNodeListener(app);
