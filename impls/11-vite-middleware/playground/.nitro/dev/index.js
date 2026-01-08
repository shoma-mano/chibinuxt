import { join } from "node:path";
import { createRenderer } from "file:///Users/mano/nuxts/chibinuxt/impls/9-vite-middleware/node_modules/.pnpm/vue-bundle-renderer@2.1.1/node_modules/vue-bundle-renderer/dist/runtime.mjs";
import { renderToString } from "file:///Users/mano/nuxts/chibinuxt/impls/9-vite-middleware/node_modules/.pnpm/vue@3.5.13_typescript@5.7.3/node_modules/vue/server-renderer/index.mjs";

//#region ../node_modules/.pnpm/ufo@1.5.4/node_modules/ufo/dist/index.mjs
const r = String.fromCharCode;
const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
	if (typeof opts === "boolean") opts = { acceptRelative: opts };
	if (opts.strict) return PROTOCOL_STRICT_REGEX.test(inputString);
	return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return input.endsWith("/");
	return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
	if (!hasTrailingSlash(input, true)) return input || "/";
	let path = input;
	let fragment = "";
	const fragmentIndex = input.indexOf("#");
	if (fragmentIndex >= 0) {
		path = input.slice(0, fragmentIndex);
		fragment = input.slice(fragmentIndex);
	}
	const [s0, ...s] = path.split("?");
	const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
	return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return input.endsWith("/") ? input : input + "/";
	if (hasTrailingSlash(input, true)) return input || "/";
	let path = input;
	let fragment = "";
	const fragmentIndex = input.indexOf("#");
	if (fragmentIndex >= 0) {
		path = input.slice(0, fragmentIndex);
		fragment = input.slice(fragmentIndex);
		if (!path) return fragment;
	}
	const [s0, ...s] = path.split("?");
	return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
	return input.startsWith("/");
}
function withLeadingSlash(input = "") {
	return hasLeadingSlash(input) ? input : "/" + input;
}
function isNonEmptyURL(url) {
	return url && url !== "/";
}
function joinURL(base, ...input) {
	let url = base || "";
	for (const segment of input.filter((url2) => isNonEmptyURL(url2))) if (url) {
		const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
		url = withTrailingSlash(url) + _segment;
	} else url = segment;
	return url;
}
const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
	const _specialProtoMatch = input.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);
	if (_specialProtoMatch) {
		const [, _proto, _pathname = ""] = _specialProtoMatch;
		return {
			protocol: _proto.toLowerCase(),
			pathname: _pathname,
			href: _proto + _pathname,
			auth: "",
			host: "",
			search: "",
			hash: ""
		};
	}
	if (!hasProtocol(input, { acceptRelative: true })) return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
	const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
	let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
	if (protocol === "file:") path = path.replace(/\/(?=[A-Za-z]:)/, "");
	const { pathname, search, hash } = parsePath(path);
	return {
		protocol: protocol.toLowerCase(),
		auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
		host,
		pathname,
		search,
		hash,
		[protocolRelative]: !protocol
	};
}
function parsePath(input = "") {
	const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
	return {
		pathname,
		search,
		hash
	};
}

//#endregion
//#region ../node_modules/.pnpm/radix3@1.1.2/node_modules/radix3/dist/index.mjs
const NODE_TYPES = {
	NORMAL: 0,
	WILDCARD: 1,
	PLACEHOLDER: 2
};
function createRouter$1(options = {}) {
	const ctx = {
		options,
		rootNode: createRadixNode(),
		staticRoutesMap: {}
	};
	const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
	if (options.routes) for (const path in options.routes) insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
	return {
		ctx,
		lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
		insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
		remove: (path) => remove(ctx, normalizeTrailingSlash(path))
	};
}
function lookup(ctx, path) {
	const staticPathNode = ctx.staticRoutesMap[path];
	if (staticPathNode) return staticPathNode.data;
	const sections = path.split("/");
	const params = {};
	let paramsFound = false;
	let wildcardNode = null;
	let node = ctx.rootNode;
	let wildCardParam = null;
	for (let i = 0; i < sections.length; i++) {
		const section = sections[i];
		if (node.wildcardChildNode !== null) {
			wildcardNode = node.wildcardChildNode;
			wildCardParam = sections.slice(i).join("/");
		}
		const nextNode = node.children.get(section);
		if (nextNode === void 0) {
			if (node && node.placeholderChildren.length > 1) {
				const remaining = sections.length - i;
				node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
			} else node = node.placeholderChildren[0] || null;
			if (!node) break;
			if (node.paramName) params[node.paramName] = section;
			paramsFound = true;
		} else node = nextNode;
	}
	if ((node === null || node.data === null) && wildcardNode !== null) {
		node = wildcardNode;
		params[node.paramName || "_"] = wildCardParam;
		paramsFound = true;
	}
	if (!node) return null;
	if (paramsFound) return {
		...node.data,
		params: paramsFound ? params : void 0
	};
	return node.data;
}
function insert(ctx, path, data) {
	let isStaticRoute = true;
	const sections = path.split("/");
	let node = ctx.rootNode;
	let _unnamedPlaceholderCtr = 0;
	const matchedNodes = [node];
	for (const section of sections) {
		let childNode;
		if (childNode = node.children.get(section)) node = childNode;
		else {
			const type = getNodeType(section);
			childNode = createRadixNode({
				type,
				parent: node
			});
			node.children.set(section, childNode);
			if (type === NODE_TYPES.PLACEHOLDER) {
				childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
				node.placeholderChildren.push(childNode);
				isStaticRoute = false;
			} else if (type === NODE_TYPES.WILDCARD) {
				node.wildcardChildNode = childNode;
				childNode.paramName = section.slice(
					3
					/* "**:" */
) || "_";
				isStaticRoute = false;
			}
			matchedNodes.push(childNode);
			node = childNode;
		}
	}
	for (const [depth, node2] of matchedNodes.entries()) node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
	node.data = data;
	if (isStaticRoute === true) ctx.staticRoutesMap[path] = node;
	return node;
}
function remove(ctx, path) {
	let success = false;
	const sections = path.split("/");
	let node = ctx.rootNode;
	for (const section of sections) {
		node = node.children.get(section);
		if (!node) return success;
	}
	if (node.data) {
		const lastSection = sections.at(-1) || "";
		node.data = null;
		if (Object.keys(node.children).length === 0 && node.parent) {
			node.parent.children.delete(lastSection);
			node.parent.wildcardChildNode = null;
			node.parent.placeholderChildren = [];
		}
		success = true;
	}
	return success;
}
function createRadixNode(options = {}) {
	return {
		type: options.type || NODE_TYPES.NORMAL,
		maxDepth: 0,
		parent: options.parent || null,
		children: /* @__PURE__ */ new Map(),
		data: options.data || null,
		paramName: options.paramName || null,
		wildcardChildNode: null,
		placeholderChildren: []
	};
}
function getNodeType(str) {
	if (str.startsWith("**")) return NODE_TYPES.WILDCARD;
	if (str[0] === ":" || str === "*") return NODE_TYPES.PLACEHOLDER;
	return NODE_TYPES.NORMAL;
}
function toRouteMatcher(router) {
	const table = _routerNodeToTable("", router.ctx.rootNode);
	return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
	return {
		ctx: { table },
		matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
	};
}
function _createRouteTable() {
	return {
		static: /* @__PURE__ */ new Map(),
		wildcard: /* @__PURE__ */ new Map(),
		dynamic: /* @__PURE__ */ new Map()
	};
}
function _matchRoutes(path, table, strictTrailingSlash) {
	if (strictTrailingSlash !== true && path.endsWith("/")) path = path.slice(0, -1) || "/";
	const matches = [];
	for (const [key, value] of _sortRoutesMap(table.wildcard)) if (path === key || path.startsWith(key + "/")) matches.push(value);
	for (const [key, value] of _sortRoutesMap(table.dynamic)) if (path.startsWith(key + "/")) {
		const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
		matches.push(..._matchRoutes(subPath, value));
	}
	const staticMatch = table.static.get(path);
	if (staticMatch) matches.push(staticMatch);
	return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
	return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
	const table = _createRouteTable();
	function _addNode(path, node) {
		if (path) {
			if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
				if (node.data) table.static.set(path, node.data);
			} else if (node.type === NODE_TYPES.WILDCARD) table.wildcard.set(path.replace("/**", ""), node.data);
			else if (node.type === NODE_TYPES.PLACEHOLDER) {
				const subTable = _routerNodeToTable("", node);
				if (node.data) subTable.static.set("/", node.data);
				table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
				return;
			}
		}
		for (const [childPath, child] of node.children.entries()) _addNode(`${path}/${childPath}`.replace("//", "/"), child);
	}
	_addNode(initialPath, initialNode);
	return table;
}

//#endregion
//#region ../node_modules/.pnpm/defu@6.1.4/node_modules/defu/dist/defu.mjs
function isPlainObject(value) {
	if (value === null || typeof value !== "object") return false;
	const prototype = Object.getPrototypeOf(value);
	if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) return false;
	if (Symbol.iterator in value) return false;
	if (Symbol.toStringTag in value) return Object.prototype.toString.call(value) === "[object Module]";
	return true;
}
function _defu(baseObject, defaults, namespace = ".", merger) {
	if (!isPlainObject(defaults)) return _defu(baseObject, {}, namespace, merger);
	const object = Object.assign({}, defaults);
	for (const key in baseObject) {
		if (key === "__proto__" || key === "constructor") continue;
		const value = baseObject[key];
		if (value === null || value === void 0) continue;
		if (merger && merger(object, key, value, namespace)) continue;
		if (Array.isArray(value) && Array.isArray(object[key])) object[key] = [...value, ...object[key]];
		else if (isPlainObject(value) && isPlainObject(object[key])) object[key] = _defu(value, object[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
		else object[key] = value;
	}
	return object;
}
function createDefu(merger) {
	return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
	if (object[key] !== void 0 && typeof currentValue === "function") {
		object[key] = currentValue(object[key]);
		return true;
	}
});
const defuArrayFn = createDefu((object, key, currentValue) => {
	if (Array.isArray(object[key]) && typeof currentValue === "function") {
		object[key] = currentValue(object[key]);
		return true;
	}
});

//#endregion
//#region ../node_modules/.pnpm/h3@1.13.0/node_modules/h3/dist/index.mjs
function hasProp(obj, prop) {
	try {
		return prop in obj;
	} catch {
		return false;
	}
}
var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
	__defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
	return value;
};
var H3Error = class extends Error {
	constructor(message, opts = {}) {
		super(message, opts);
		__publicField$2(this, "statusCode", 500);
		__publicField$2(this, "fatal", false);
		__publicField$2(this, "unhandled", false);
		__publicField$2(this, "statusMessage");
		__publicField$2(this, "data");
		__publicField$2(this, "cause");
		if (opts.cause && !this.cause) this.cause = opts.cause;
	}
	toJSON() {
		const obj = {
			message: this.message,
			statusCode: sanitizeStatusCode(this.statusCode, 500)
		};
		if (this.statusMessage) obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
		if (this.data !== void 0) obj.data = this.data;
		return obj;
	}
};
__publicField$2(H3Error, "__h3_error__", true);
function createError(input) {
	if (typeof input === "string") return new H3Error(input);
	if (isError(input)) return input;
	const err = new H3Error(input.message ?? input.statusMessage ?? "", { cause: input.cause || input });
	if (hasProp(input, "stack")) try {
		Object.defineProperty(err, "stack", { get() {
			return input.stack;
		} });
	} catch {
		try {
			err.stack = input.stack;
		} catch {}
	}
	if (input.data) err.data = input.data;
	if (input.statusCode) err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
	else if (input.status) err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
	if (input.statusMessage) err.statusMessage = input.statusMessage;
	else if (input.statusText) err.statusMessage = input.statusText;
	if (err.statusMessage) {
		const originalMessage = err.statusMessage;
		const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
		if (sanitizedMessage !== originalMessage) console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.");
	}
	if (input.fatal !== void 0) err.fatal = input.fatal;
	if (input.unhandled !== void 0) err.unhandled = input.unhandled;
	return err;
}
function isError(input) {
	return input?.constructor?.__h3_error__ === true;
}
const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const MIMES = {
	html: "text/html",
	json: "application/json"
};
const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
	return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
	if (!statusCode) return defaultStatusCode;
	if (typeof statusCode === "string") statusCode = Number.parseInt(statusCode, 10);
	if (statusCode < 100 || statusCode > 999) return defaultStatusCode;
	return statusCode;
}
function splitCookiesString(cookiesString) {
	if (Array.isArray(cookiesString)) return cookiesString.flatMap((c) => splitCookiesString(c));
	if (typeof cookiesString !== "string") return [];
	const cookiesStrings = [];
	let pos = 0;
	let start;
	let ch;
	let lastComma;
	let nextStart;
	let cookiesSeparatorFound;
	const skipWhitespace = () => {
		while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) pos += 1;
		return pos < cookiesString.length;
	};
	const notSpecialChar = () => {
		ch = cookiesString.charAt(pos);
		return ch !== "=" && ch !== ";" && ch !== ",";
	};
	while (pos < cookiesString.length) {
		start = pos;
		cookiesSeparatorFound = false;
		while (skipWhitespace()) {
			ch = cookiesString.charAt(pos);
			if (ch === ",") {
				lastComma = pos;
				pos += 1;
				skipWhitespace();
				nextStart = pos;
				while (pos < cookiesString.length && notSpecialChar()) pos += 1;
				if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
					cookiesSeparatorFound = true;
					pos = nextStart;
					cookiesStrings.push(cookiesString.slice(start, lastComma));
					start = pos;
				} else pos = lastComma + 1;
			} else pos += 1;
		}
		if (!cookiesSeparatorFound || pos >= cookiesString.length) cookiesStrings.push(cookiesString.slice(start));
	}
	return cookiesStrings;
}
const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
	if (type) defaultContentType(event, type);
	return new Promise((resolve) => {
		defer(() => {
			if (!event.handled) event.node.res.end(data);
			resolve();
		});
	});
}
function sendNoContent(event, code) {
	if (event.handled) return;
	if (!code && event.node.res.statusCode !== 200) code = event.node.res.statusCode;
	const _code = sanitizeStatusCode(code, 204);
	if (_code === 204) event.node.res.removeHeader("content-length");
	event.node.res.writeHead(_code);
	event.node.res.end();
}
function defaultContentType(event, type) {
	if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) event.node.res.setHeader("content-type", type);
}
function isStream(data) {
	if (!data || typeof data !== "object") return false;
	if (typeof data.pipe === "function") {
		if (typeof data._read === "function") return true;
		if (typeof data.abort === "function") return true;
	}
	if (typeof data.pipeTo === "function") return true;
	return false;
}
function isWebResponse(data) {
	return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
	if (!stream || typeof stream !== "object") throw new Error("[h3] Invalid stream provided.");
	event.node.res._data = stream;
	if (!event.node.res.socket) {
		event._handled = true;
		return Promise.resolve();
	}
	if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") return stream.pipeTo(new WritableStream({ write(chunk) {
		event.node.res.write(chunk);
	} })).then(() => {
		event.node.res.end();
	});
	if (hasProp(stream, "pipe") && typeof stream.pipe === "function") return new Promise((resolve, reject) => {
		stream.pipe(event.node.res);
		if (stream.on) {
			stream.on("end", () => {
				event.node.res.end();
				resolve();
			});
			stream.on("error", (error) => {
				reject(error);
			});
		}
		event.node.res.on("close", () => {
			if (stream.abort) stream.abort();
		});
	});
	throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
	for (const [key, value] of response.headers) if (key === "set-cookie") event.node.res.appendHeader(key, splitCookiesString(value));
	else event.node.res.setHeader(key, value);
	if (response.status) event.node.res.statusCode = sanitizeStatusCode(response.status, event.node.res.statusCode);
	if (response.statusText) event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
	if (response.redirected) event.node.res.setHeader("location", response.url);
	if (!response.body) {
		event.node.res.end();
		return;
	}
	return sendStream(event, response.body);
}
const getSessionPromise = Symbol("getSession");
function defineEventHandler(handler) {
	if (typeof handler === "function") {
		handler.__is_handler__ = true;
		return handler;
	}
	const _hooks = {
		onRequest: _normalizeArray(handler.onRequest),
		onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
	};
	const _handler = (event) => {
		return _callHandler(event, handler.handler, _hooks);
	};
	_handler.__is_handler__ = true;
	_handler.__resolve__ = handler.handler.__resolve__;
	_handler.__websocket__ = handler.websocket;
	return _handler;
}
function _normalizeArray(input) {
	return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
	if (hooks.onRequest) for (const hook of hooks.onRequest) {
		await hook(event);
		if (event.handled) return;
	}
	const body = await handler(event);
	const response = { body };
	if (hooks.onBeforeResponse) for (const hook of hooks.onBeforeResponse) await hook(event, response);
	return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
	return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
	if (!isEventHandler(input)) console.warn("[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.", _route && _route !== "/" ? `
     Route: ${_route}` : "", `
     Handler: ${input}`);
	return input;
}
function defineLazyEventHandler(factory) {
	let _promise;
	let _resolved;
	const resolveHandler = () => {
		if (_resolved) return Promise.resolve(_resolved);
		if (!_promise) _promise = Promise.resolve(factory()).then((r$1) => {
			const handler2 = r$1.default || r$1;
			if (typeof handler2 !== "function") throw new TypeError("Invalid lazy handler result. It should be a function:", handler2);
			_resolved = { handler: toEventHandler(r$1.default || r$1) };
			return _resolved;
		});
		return _promise;
	};
	const handler = eventHandler((event) => {
		if (_resolved) return _resolved.handler(event);
		return resolveHandler().then((r$1) => r$1.handler(event));
	});
	handler.__resolve__ = resolveHandler;
	return handler;
}
const lazyEventHandler = defineLazyEventHandler;
const H3Headers = globalThis.Headers;
const H3Response = globalThis.Response;
function createApp(options = {}) {
	const stack = [];
	const handler = createAppEventHandler(stack, options);
	const resolve = createResolver(stack);
	handler.__resolve__ = resolve;
	const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
	const app = {
		use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
		resolve,
		handler,
		stack,
		options,
		get websocket() {
			return getWebsocket();
		}
	};
	return app;
}
function use(app, arg1, arg2, arg3) {
	if (Array.isArray(arg1)) for (const i of arg1) use(app, i, arg2, arg3);
	else if (Array.isArray(arg2)) for (const i of arg2) use(app, arg1, i, arg3);
	else if (typeof arg1 === "string") app.stack.push(normalizeLayer({
		...arg3,
		route: arg1,
		handler: arg2
	}));
	else if (typeof arg1 === "function") app.stack.push(normalizeLayer({
		...arg2,
		handler: arg1
	}));
	else app.stack.push(normalizeLayer({ ...arg1 }));
	return app;
}
function createAppEventHandler(stack, options) {
	const spacing = options.debug ? 2 : void 0;
	return eventHandler(async (event) => {
		event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
		const _reqPath = event._path || event.node.req.url || "/";
		let _layerPath;
		if (options.onRequest) await options.onRequest(event);
		for (const layer of stack) {
			if (layer.route.length > 1) {
				if (!_reqPath.startsWith(layer.route)) continue;
				_layerPath = _reqPath.slice(layer.route.length) || "/";
			} else _layerPath = _reqPath;
			if (layer.match && !layer.match(_layerPath, event)) continue;
			event._path = _layerPath;
			event.node.req.url = _layerPath;
			const val = await layer.handler(event);
			const _body = val === void 0 ? void 0 : await val;
			if (_body !== void 0) {
				const _response = { body: _body };
				if (options.onBeforeResponse) {
					event._onBeforeResponseCalled = true;
					await options.onBeforeResponse(event, _response);
				}
				await handleHandlerResponse(event, _response.body, spacing);
				if (options.onAfterResponse) {
					event._onAfterResponseCalled = true;
					await options.onAfterResponse(event, _response);
				}
				return;
			}
			if (event.handled) {
				if (options.onAfterResponse) {
					event._onAfterResponseCalled = true;
					await options.onAfterResponse(event, void 0);
				}
				return;
			}
		}
		if (!event.handled) throw createError({
			statusCode: 404,
			statusMessage: `Cannot find any path matching ${event.path || "/"}.`
		});
		if (options.onAfterResponse) {
			event._onAfterResponseCalled = true;
			await options.onAfterResponse(event, void 0);
		}
	});
}
function createResolver(stack) {
	return async (path) => {
		let _layerPath;
		for (const layer of stack) {
			if (layer.route === "/" && !layer.handler.__resolve__) continue;
			if (!path.startsWith(layer.route)) continue;
			_layerPath = path.slice(layer.route.length) || "/";
			if (layer.match && !layer.match(_layerPath, void 0)) continue;
			let res = {
				route: layer.route,
				handler: layer.handler
			};
			if (res.handler.__resolve__) {
				const _res = await res.handler.__resolve__(_layerPath);
				if (!_res) continue;
				res = {
					...res,
					..._res,
					route: joinURL(res.route || "/", _res.route || "/")
				};
			}
			return res;
		}
	};
}
function normalizeLayer(input) {
	let handler = input.handler;
	if (handler.handler) handler = handler.handler;
	if (input.lazy) handler = lazyEventHandler(handler);
	else if (!isEventHandler(handler)) handler = toEventHandler(handler, void 0, input.route);
	return {
		route: withoutTrailingSlash(input.route),
		match: input.match,
		handler
	};
}
function handleHandlerResponse(event, val, jsonSpace) {
	if (val === null) return sendNoContent(event);
	if (val) {
		if (isWebResponse(val)) return sendWebResponse(event, val);
		if (isStream(val)) return sendStream(event, val);
		if (val.buffer) return send(event, val);
		if (val.arrayBuffer && typeof val.arrayBuffer === "function") return val.arrayBuffer().then((arrayBuffer) => {
			return send(event, Buffer.from(arrayBuffer), val.type);
		});
		if (val instanceof Error) throw createError(val);
		if (typeof val.end === "function") return true;
	}
	const valType = typeof val;
	if (valType === "string") return send(event, val, MIMES.html);
	if (valType === "object" || valType === "boolean" || valType === "number") return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
	if (valType === "bigint") return send(event, val.toString(), MIMES.json);
	throw createError({
		statusCode: 500,
		statusMessage: `[h3] Cannot send ${valType} as response.`
	});
}
function cachedFn(fn) {
	let cache;
	return () => {
		if (!cache) cache = fn();
		return cache;
	};
}
function websocketOptions(evResolver, appOptions) {
	return {
		...appOptions.websocket,
		async resolve(info) {
			const url = info.request?.url || info.url || "/";
			const { pathname } = typeof url === "string" ? parseURL(url) : url;
			const resolved = await evResolver(pathname);
			return resolved?.handler?.__websocket__ || {};
		}
	};
}
const RouterMethods = [
	"connect",
	"delete",
	"get",
	"head",
	"options",
	"post",
	"put",
	"trace",
	"patch"
];
function createRouter(opts = {}) {
	const _router = createRouter$1({});
	const routes = {};
	let _matcher;
	const router = {};
	const addRoute = (path, handler, method) => {
		let route = routes[path];
		if (!route) {
			routes[path] = route = {
				path,
				handlers: {}
			};
			_router.insert(path, route);
		}
		if (Array.isArray(method)) for (const m of method) addRoute(path, handler, m);
		else route.handlers[method] = toEventHandler(handler, void 0, path);
		return router;
	};
	router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
	for (const method of RouterMethods) router[method] = (path, handle) => router.add(path, handle, method);
	const matchHandler = (path = "/", method = "get") => {
		const qIndex = path.indexOf("?");
		if (qIndex !== -1) path = path.slice(0, Math.max(0, qIndex));
		const matched = _router.lookup(path);
		if (!matched || !matched.handlers) return { error: createError({
			statusCode: 404,
			name: "Not Found",
			statusMessage: `Cannot find any route matching ${path || "/"}.`
		}) };
		let handler = matched.handlers[method] || matched.handlers.all;
		if (!handler) {
			if (!_matcher) _matcher = toRouteMatcher(_router);
			const _matches = _matcher.matchAll(path).reverse();
			for (const _match of _matches) {
				if (_match.handlers[method]) {
					handler = _match.handlers[method];
					matched.handlers[method] = matched.handlers[method] || handler;
					break;
				}
				if (_match.handlers.all) {
					handler = _match.handlers.all;
					matched.handlers.all = matched.handlers.all || handler;
					break;
				}
			}
		}
		if (!handler) return { error: createError({
			statusCode: 405,
			name: "Method Not Allowed",
			statusMessage: `Method ${method} is not allowed on this route.`
		}) };
		return {
			matched,
			handler
		};
	};
	const isPreemptive = opts.preemptive || opts.preemtive;
	router.handler = eventHandler((event) => {
		const match = matchHandler(event.path, event.method.toLowerCase());
		if ("error" in match) if (isPreemptive) throw match.error;
		else return;
		event.context.matchedRoute = match.matched;
		const params = match.matched.params || {};
		event.context.params = params;
		return Promise.resolve(match.handler(event)).then((res) => {
			if (res === void 0 && isPreemptive) return null;
			return res;
		});
	});
	router.handler.__resolve__ = async (path) => {
		path = withLeadingSlash(path);
		const match = matchHandler(path);
		if ("error" in match) return;
		let res = {
			route: match.matched.path,
			handler: match.handler
		};
		if (match.handler.__resolve__) {
			const _res = await match.handler.__resolve__(path);
			if (!_res) return;
			res = {
				...res,
				..._res
			};
		}
		return res;
	};
	return router;
}

//#endregion
//#region ../packages/nuxt/dist/core/runtime/nitro/renderer.js
const distDir = process.env.DIST_DIR;
let renderer;
const getRenderer = async () => {
	if (renderer) return renderer;
	const createApp$1 = await import(join(distDir, "app", "_entry.server.js")).then((m) => m.default);
	renderer = createRenderer(createApp$1, {
		renderToString,
		manifest: {}
	});
	return renderer;
};
var renderer_default = defineEventHandler(async (event) => {
	const renderer2 = await getRenderer();
	const rendered = await renderer2.renderToString({ url: event.path });
	const body = renderHTML(rendered);
	return body;
});
function renderHTML({ html, renderResourceHints, renderStyles, renderScripts }) {
	const clientEntry = "/@fs" + join(distDir, "../src/app/entry.client.ts");
	return `
  <!DOCTYPE html>
  <html>
  <head>
    ${renderResourceHints()}
    ${renderStyles()}
  </head>
  <body>
    <div id="__nuxt">${html}${renderScripts()}</div>
    <script type="module" src="${clientEntry}"><\/script>
  </body>
  </html>
  `;
}

//#endregion
//#region \0virtual:#nitro-internal-virtual/server-handlers
const handlers = [{
	route: "/**",
	handler: renderer_default
}];

//#endregion
//#region ../packages/nitro/dist/runtime/internal/app.mjs
function createNitroApp() {
	const h3App = createApp();
	const router = createRouter();
	console.log("handlers", handlers);
	handlers.forEach(({ route, handler }) => {
		router.use(route, handler);
	});
	h3App.use(router);
	return { h3App };
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

//#endregion
export { useNitroApp };