import "~polyfill";
import { withQuery } from ".pnpm/ufo@0.6.12/node_modules/ufo/dist";
import { localCall } from "../server";

export async function handler(event, context) {
  const r = await localCall({
    event,
    url: withQuery(event.path, event.queryStringParameters),
    context,
    headers: event.headers,
    method: event.httpMethod,
    query: event.queryStringParameters,
    body: event.body, // TODO: handle event.isBase64Encoded
  });

  return {
    statusCode: r.status,
    headers: r.headers,
    body: r.body.toString(),
  };
}
