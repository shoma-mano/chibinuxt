import { getServer } from "nitro";
import { buildClientEntry, buildServerEntry } from "./vite";
import { join } from "path";

const main = async () => {
  await buildServerEntry();
  await buildClientEntry();

  process.env.DIST_DIR = join(import.meta.dirname, "dist");
  const server = getServer();
  server.listen(3030, () => {
    console.log("Server listening on http://localhost:3030");
  });
};
main();
