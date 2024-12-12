// @ts-ignore
import { join } from "upath";
// @ts-ignore
import fsExtra from "fs-extra";

export const wpfs = {
  ...fsExtra,
  join,
};
