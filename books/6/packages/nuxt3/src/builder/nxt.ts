import { basename, extname } from "path";
import hash from ".pnpm/@types+hash-sum@1.0.2/node_modules/@types/hash-sum";
import { camelCase } from ".pnpm/scule@0.1.1/node_modules/scule/dist";
import { NuxtRoute } from "./pages";
// NXT is a set of utils for serializing JavaScript data to JS code

export const serialize = (data) =>
  JSON.stringify(data, null, 2).replace(/"{(.+)}"/g, "$1");

export const importName = (src: string) =>
  `${camelCase(basename(src, extname(src))).replace(
    /[^a-zA-Z?\d\s:]/g,
    ""
  )}_${hash(src)}`;

export const importSources = (
  sources: string | string[],
  { lazy = false } = {}
) => {
  if (!Array.isArray(sources)) {
    sources = [sources];
  }
  return sources
    .map((src) => {
      if (lazy) {
        return `const ${importName(
          src
        )} = () => import('${src}' /* webpackChunkName: '${src}' */)`;
      }
      return `import ${importName(src)} from '${src}'`;
    })
    .join("\n");
};

export const serializeRoute = (route: NuxtRoute) => {
  return {
    name: route.name,
    path: route.path,
    children: route.children.map(serializeRoute),
    // TODO: avoid exposing to prod, using process.env.NODE_ENV ?
    __file: route.file,
    component: `{() => import('${route.file}' /* webpackChunkName: '${route.name}' */)}`,
  };
};
