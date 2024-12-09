import _renderToString from ".pnpm/vue-server-renderer@2.7.16/node_modules/vue-server-renderer/basic";

export function renderToString(component, context) {
  return new Promise((resolve, reject) => {
    _renderToString(component, context, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}
