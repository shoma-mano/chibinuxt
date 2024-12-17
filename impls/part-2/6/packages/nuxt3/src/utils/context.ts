import type { ServerResponse, IncomingMessage } from "http";

import { TARGETS } from "./constants";

export const getContext = function getContext(
  req: IncomingMessage,
  res: ServerResponse
) {
  return { req, res };
};

export const isFullStatic = function (options) {
  return (
    !options.dev &&
    !options._legacyGenerate &&
    options.target === TARGETS.static &&
    options.render.ssr
  );
};
