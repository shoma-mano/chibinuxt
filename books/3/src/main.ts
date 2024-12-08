import { createApp, toNodeListener } from "h3";
import { createServer } from "http";
import { renderMiddleware } from "./render";
import { buildClientEntry, buildServerEntry } from "./vite";

const main = async () => {
  await buildServerEntry();
  await buildClientEntry();

  const app = createApp();
  app.use(renderMiddleware);

  const server = createServer(toNodeListener(app));
  server.listen(3030, () => {
    console.log("Server listening on http://localhost:3030");
  });
};
main();
