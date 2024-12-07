import { join } from "upath";
import fsExtra from ".pnpm/fs-extra@9.1.0/node_modules/fs-extra/lib";

export const wpfs = {
  ...fsExtra,
  join,
};
