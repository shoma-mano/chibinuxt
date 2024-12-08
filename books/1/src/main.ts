import { createApp, toNodeListener, fromNodeMiddleware } from "h3";
import { createServer } from "http";
import { renderMiddleware } from "./render";

const app = createApp();
app.use(renderMiddleware);

const server = createServer(toNodeListener(app));
server.listen(3030, () => {
  console.log("Server listening on http://localhost:3030");
});
