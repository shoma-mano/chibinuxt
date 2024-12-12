import { join } from "upath";
import fsExtra from "fs-extra";

// @ts-ignore
export const wpfs = {
  // @ts-ignore
  ...(fsExtra as any),
  // @ts-ignore
  join: join as any,
};
