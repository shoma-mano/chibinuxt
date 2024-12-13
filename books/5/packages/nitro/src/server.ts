import { createServer } from "http";
import { renderMiddleware } from "./render";
import { createApp, toNodeListener } from "h3";

export const getServer = () => {
  const app = createApp();
  app.use(renderMiddleware);

  const server = createServer(toNodeListener(app));
  return server;

  //   server.listen(3030, () => {
  //     console.log("Server listening on http://localhost:3030");
  //   });
};
