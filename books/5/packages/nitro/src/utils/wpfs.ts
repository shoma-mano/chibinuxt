import { join } from "path";
import fsExtra from "fs";

// @ts-ignore
export const wpfs = {
  // @ts-ignore
  ...(fsExtra as any),
  // @ts-ignore
  join: join as any,
};
