
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.10.4";globalThis.nextVersion = "15.3.2";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var e = {}, r = {};
      function t(o) {
        var n = r[o];
        if (void 0 !== n) return n.exports;
        var i = r[o] = { exports: {} }, a = true;
        try {
          e[o](i, i.exports, t), a = false;
        } finally {
          a && delete r[o];
        }
        return i.exports;
      }
      t.m = e, t.amdO = {}, (() => {
        var e2 = [];
        t.O = (r2, o, n, i) => {
          if (o) {
            i = i || 0;
            for (var a = e2.length; a > 0 && e2[a - 1][2] > i; a--) e2[a] = e2[a - 1];
            e2[a] = [o, n, i];
            return;
          }
          for (var l = 1 / 0, a = 0; a < e2.length; a++) {
            for (var [o, n, i] = e2[a], u = true, f = 0; f < o.length; f++) (false & i || l >= i) && Object.keys(t.O).every((e3) => t.O[e3](o[f])) ? o.splice(f--, 1) : (u = false, i < l && (l = i));
            if (u) {
              e2.splice(a--, 1);
              var s = n();
              void 0 !== s && (r2 = s);
            }
          }
          return r2;
        };
      })(), t.n = (e2) => {
        var r2 = e2 && e2.__esModule ? () => e2.default : () => e2;
        return t.d(r2, { a: r2 }), r2;
      }, t.d = (e2, r2) => {
        for (var o in r2) t.o(r2, o) && !t.o(e2, o) && Object.defineProperty(e2, o, { enumerable: true, get: r2[o] });
      }, t.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (e2) {
          if ("object" == typeof window) return window;
        }
      }(), t.o = (e2, r2) => Object.prototype.hasOwnProperty.call(e2, r2), t.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, (() => {
        var e2 = { 149: 0 };
        t.O.j = (r3) => 0 === e2[r3];
        var r2 = (r3, o2) => {
          var n, i, [a, l, u] = o2, f = 0;
          if (a.some((r4) => 0 !== e2[r4])) {
            for (n in l) t.o(l, n) && (t.m[n] = l[n]);
            if (u) var s = u(t);
          }
          for (r3 && r3(o2); f < a.length; f++) i = a[f], t.o(e2, i) && e2[i] && e2[i][0](), e2[i] = 0;
          return t.O(s);
        }, o = self.webpackChunk_N_E = self.webpackChunk_N_E || [];
        o.forEach(r2.bind(null, 0)), o.push = r2.bind(null, o.push.bind(o));
      })();
    })();
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/middleware.js
var require_middleware = __commonJS({
  ".next/server/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[751], { 25: (e, t, r) => {
      "use strict";
      let s, n;
      r.r(t), r.d(t, { default: () => ii });
      var i, a, o, l, u, c, h = {};
      async function d() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      r.r(h), r.d(h, { config: () => ie, middleware: () => n7 });
      let p = null;
      async function f() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        p || (p = d());
        let e10 = await p;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function g(...e10) {
        let t10 = await d();
        try {
          var r10;
          await (null == t10 || null == (r10 = t10.onRequestError) ? void 0 : r10.call(t10, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let m = null;
      function b() {
        return m || (m = f()), m;
      }
      function y(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== r.g.process && (process.env = r.g.process.env, r.g.process = process), Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
        let t10 = new Proxy(function() {
        }, { get(t11, r10) {
          if ("then" === r10) return {};
          throw Object.defineProperty(Error(y(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }, construct() {
          throw Object.defineProperty(Error(y(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }, apply(r10, s10, n10) {
          if ("function" == typeof n10[0]) return n10[0](t10);
          throw Object.defineProperty(Error(y(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        } });
        return new Proxy({}, { get: () => t10 });
      }, enumerable: false, configurable: false }), b();
      class w extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class v extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class _ extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      let k = "_N_T_", S = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function E(e10) {
        var t10, r10, s10, n10, i2, a2 = [], o2 = 0;
        function l2() {
          for (; o2 < e10.length && /\s/.test(e10.charAt(o2)); ) o2 += 1;
          return o2 < e10.length;
        }
        for (; o2 < e10.length; ) {
          for (t10 = o2, i2 = false; l2(); ) if ("," === (r10 = e10.charAt(o2))) {
            for (s10 = o2, o2 += 1, l2(), n10 = o2; o2 < e10.length && "=" !== (r10 = e10.charAt(o2)) && ";" !== r10 && "," !== r10; ) o2 += 1;
            o2 < e10.length && "=" === e10.charAt(o2) ? (i2 = true, o2 = n10, a2.push(e10.substring(t10, s10)), t10 = o2) : o2 = s10 + 1;
          } else o2 += 1;
          (!i2 || o2 >= e10.length) && a2.push(e10.substring(t10, e10.length));
        }
        return a2;
      }
      function T(e10) {
        let t10 = {}, r10 = [];
        if (e10) for (let [s10, n10] of e10.entries()) "set-cookie" === s10.toLowerCase() ? (r10.push(...E(n10)), t10[s10] = 1 === r10.length ? r10[0] : r10) : t10[s10] = n10;
        return t10;
      }
      function R(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...S, GROUP: { builtinReact: [S.reactServerComponents, S.actionBrowser], serverOnly: [S.reactServerComponents, S.actionBrowser, S.instrument, S.middleware], neutralTarget: [S.apiNode, S.apiEdge], clientOnly: [S.serverSideRendering, S.appPagesBrowser], bundled: [S.reactServerComponents, S.actionBrowser, S.serverSideRendering, S.appPagesBrowser, S.shared, S.instrument, S.middleware], appPages: [S.reactServerComponents, S.serverSideRendering, S.appPagesBrowser, S.actionBrowser] } });
      let O = Symbol("response"), C = Symbol("passThrough"), P = Symbol("waitUntil");
      class x {
        constructor(e10, t10) {
          this[C] = false, this[P] = t10 ? { kind: "external", function: t10 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[O] || (this[O] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[C] = true;
        }
        waitUntil(e10) {
          if ("external" === this[P].kind) return (0, this[P].function)(e10);
          this[P].promises.push(e10);
        }
      }
      class A extends x {
        constructor(e10) {
          var t10;
          super(e10.request, null == (t10 = e10.context) ? void 0 : t10.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new w({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new w({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function j(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function I(e10) {
        let t10 = e10.indexOf("#"), r10 = e10.indexOf("?"), s10 = r10 > -1 && (t10 < 0 || r10 < t10);
        return s10 || t10 > -1 ? { pathname: e10.substring(0, s10 ? r10 : t10), query: s10 ? e10.substring(r10, t10 > -1 ? t10 : void 0) : "", hash: t10 > -1 ? e10.slice(t10) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function N(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: s10, hash: n10 } = I(e10);
        return "" + t10 + r10 + s10 + n10;
      }
      function $(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: s10, hash: n10 } = I(e10);
        return "" + r10 + t10 + s10 + n10;
      }
      function L(e10, t10) {
        if ("string" != typeof e10) return false;
        let { pathname: r10 } = I(e10);
        return r10 === t10 || r10.startsWith(t10 + "/");
      }
      let D = /* @__PURE__ */ new WeakMap();
      function U(e10, t10) {
        let r10;
        if (!t10) return { pathname: e10 };
        let s10 = D.get(t10);
        s10 || (s10 = t10.map((e11) => e11.toLowerCase()), D.set(t10, s10));
        let n10 = e10.split("/", 2);
        if (!n10[1]) return { pathname: e10 };
        let i2 = n10[1].toLowerCase(), a2 = s10.indexOf(i2);
        return a2 < 0 ? { pathname: e10 } : (r10 = t10[a2], { pathname: e10 = e10.slice(r10.length + 1) || "/", detectedLocale: r10 });
      }
      let M = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function q(e10, t10) {
        return new URL(String(e10).replace(M, "localhost"), t10 && String(t10).replace(M, "localhost"));
      }
      let B = Symbol("NextURLInternal");
      class H {
        constructor(e10, t10, r10) {
          let s10, n10;
          "object" == typeof t10 && "pathname" in t10 || "string" == typeof t10 ? (s10 = t10, n10 = r10 || {}) : n10 = r10 || t10 || {}, this[B] = { url: q(e10, s10 ?? n10.base), options: n10, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t10, r10, s10, n10;
          let i2 = function(e11, t11) {
            var r11, s11;
            let { basePath: n11, i18n: i3, trailingSlash: a3 } = null != (r11 = t11.nextConfig) ? r11 : {}, o3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : a3 };
            n11 && L(o3.pathname, n11) && (o3.pathname = function(e12, t12) {
              if (!L(e12, t12)) return e12;
              let r12 = e12.slice(t12.length);
              return r12.startsWith("/") ? r12 : "/" + r12;
            }(o3.pathname, n11), o3.basePath = n11);
            let l2 = o3.pathname;
            if (o3.pathname.startsWith("/_next/data/") && o3.pathname.endsWith(".json")) {
              let e12 = o3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              o3.buildId = e12[0], l2 = "index" !== e12[1] ? "/" + e12.slice(1).join("/") : "/", true === t11.parseData && (o3.pathname = l2);
            }
            if (i3) {
              let e12 = t11.i18nProvider ? t11.i18nProvider.analyze(o3.pathname) : U(o3.pathname, i3.locales);
              o3.locale = e12.detectedLocale, o3.pathname = null != (s11 = e12.pathname) ? s11 : o3.pathname, !e12.detectedLocale && o3.buildId && (e12 = t11.i18nProvider ? t11.i18nProvider.analyze(l2) : U(l2, i3.locales)).detectedLocale && (o3.locale = e12.detectedLocale);
            }
            return o3;
          }(this[B].url.pathname, { nextConfig: this[B].options.nextConfig, parseData: true, i18nProvider: this[B].options.i18nProvider }), a2 = function(e11, t11) {
            let r11;
            if ((null == t11 ? void 0 : t11.host) && !Array.isArray(t11.host)) r11 = t11.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r11 = e11.hostname;
            }
            return r11.toLowerCase();
          }(this[B].url, this[B].options.headers);
          this[B].domainLocale = this[B].options.i18nProvider ? this[B].options.i18nProvider.detectDomainLocale(a2) : function(e11, t11, r11) {
            if (e11) for (let i3 of (r11 && (r11 = r11.toLowerCase()), e11)) {
              var s11, n11;
              if (t11 === (null == (s11 = i3.domain) ? void 0 : s11.split(":", 1)[0].toLowerCase()) || r11 === i3.defaultLocale.toLowerCase() || (null == (n11 = i3.locales) ? void 0 : n11.some((e12) => e12.toLowerCase() === r11))) return i3;
            }
          }(null == (t10 = this[B].options.nextConfig) || null == (e10 = t10.i18n) ? void 0 : e10.domains, a2);
          let o2 = (null == (r10 = this[B].domainLocale) ? void 0 : r10.defaultLocale) || (null == (n10 = this[B].options.nextConfig) || null == (s10 = n10.i18n) ? void 0 : s10.defaultLocale);
          this[B].url.pathname = i2.pathname, this[B].defaultLocale = o2, this[B].basePath = i2.basePath ?? "", this[B].buildId = i2.buildId, this[B].locale = i2.locale ?? o2, this[B].trailingSlash = i2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t10;
          return t10 = function(e11, t11, r10, s10) {
            if (!t11 || t11 === r10) return e11;
            let n10 = e11.toLowerCase();
            return !s10 && (L(n10, "/api") || L(n10, "/" + t11.toLowerCase())) ? e11 : N(e11, "/" + t11);
          }((e10 = { basePath: this[B].basePath, buildId: this[B].buildId, defaultLocale: this[B].options.forceLocale ? void 0 : this[B].defaultLocale, locale: this[B].locale, pathname: this[B].url.pathname, trailingSlash: this[B].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t10 = j(t10)), e10.buildId && (t10 = $(N(t10, "/_next/data/" + e10.buildId), "/" === e10.pathname ? "index.json" : ".json")), t10 = N(t10, e10.basePath), !e10.buildId && e10.trailingSlash ? t10.endsWith("/") ? t10 : $(t10, "/") : j(t10);
        }
        formatSearch() {
          return this[B].url.search;
        }
        get buildId() {
          return this[B].buildId;
        }
        set buildId(e10) {
          this[B].buildId = e10;
        }
        get locale() {
          return this[B].locale ?? "";
        }
        set locale(e10) {
          var t10, r10;
          if (!this[B].locale || !(null == (r10 = this[B].options.nextConfig) || null == (t10 = r10.i18n) ? void 0 : t10.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[B].locale = e10;
        }
        get defaultLocale() {
          return this[B].defaultLocale;
        }
        get domainLocale() {
          return this[B].domainLocale;
        }
        get searchParams() {
          return this[B].url.searchParams;
        }
        get host() {
          return this[B].url.host;
        }
        set host(e10) {
          this[B].url.host = e10;
        }
        get hostname() {
          return this[B].url.hostname;
        }
        set hostname(e10) {
          this[B].url.hostname = e10;
        }
        get port() {
          return this[B].url.port;
        }
        set port(e10) {
          this[B].url.port = e10;
        }
        get protocol() {
          return this[B].url.protocol;
        }
        set protocol(e10) {
          this[B].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t10 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t10}${this.hash}`;
        }
        set href(e10) {
          this[B].url = q(e10), this.analyze();
        }
        get origin() {
          return this[B].url.origin;
        }
        get pathname() {
          return this[B].url.pathname;
        }
        set pathname(e10) {
          this[B].url.pathname = e10;
        }
        get hash() {
          return this[B].url.hash;
        }
        set hash(e10) {
          this[B].url.hash = e10;
        }
        get search() {
          return this[B].url.search;
        }
        set search(e10) {
          this[B].url.search = e10;
        }
        get password() {
          return this[B].url.password;
        }
        set password(e10) {
          this[B].url.password = e10;
        }
        get username() {
          return this[B].url.username;
        }
        set username(e10) {
          this[B].url.username = e10;
        }
        get basePath() {
          return this[B].basePath;
        }
        set basePath(e10) {
          this[B].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new H(String(this), this[B].options);
        }
      }
      var W = r(724);
      let V = Symbol("internal request");
      class z extends Request {
        constructor(e10, t10 = {}) {
          let r10 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          R(r10), e10 instanceof Request ? super(e10, t10) : super(r10, t10);
          let s10 = new H(r10, { headers: T(this.headers), nextConfig: t10.nextConfig });
          this[V] = { cookies: new W.RequestCookies(this.headers), nextUrl: s10, url: s10.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[V].cookies;
        }
        get nextUrl() {
          return this[V].nextUrl;
        }
        get page() {
          throw new v();
        }
        get ua() {
          throw new _();
        }
        get url() {
          return this[V].url;
        }
      }
      class G {
        static get(e10, t10, r10) {
          let s10 = Reflect.get(e10, t10, r10);
          return "function" == typeof s10 ? s10.bind(e10) : s10;
        }
        static set(e10, t10, r10, s10) {
          return Reflect.set(e10, t10, r10, s10);
        }
        static has(e10, t10) {
          return Reflect.has(e10, t10);
        }
        static deleteProperty(e10, t10) {
          return Reflect.deleteProperty(e10, t10);
        }
      }
      let K = Symbol("internal response"), F = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function J(e10, t10) {
        var r10;
        if (null == e10 || null == (r10 = e10.request) ? void 0 : r10.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r11 = [];
          for (let [s10, n10] of e10.request.headers) t10.set("x-middleware-request-" + s10, n10), r11.push(s10);
          t10.set("x-middleware-override-headers", r11.join(","));
        }
      }
      class X extends Response {
        constructor(e10, t10 = {}) {
          super(e10, t10);
          let r10 = this.headers, s10 = new Proxy(new W.ResponseCookies(r10), { get(e11, s11, n10) {
            switch (s11) {
              case "delete":
              case "set":
                return (...n11) => {
                  let i2 = Reflect.apply(e11[s11], e11, n11), a2 = new Headers(r10);
                  return i2 instanceof W.ResponseCookies && r10.set("x-middleware-set-cookie", i2.getAll().map((e12) => (0, W.stringifyCookie)(e12)).join(",")), J(t10, a2), i2;
                };
              default:
                return G.get(e11, s11, n10);
            }
          } });
          this[K] = { cookies: s10, url: t10.url ? new H(t10.url, { headers: T(r10), nextConfig: t10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[K].cookies;
        }
        static json(e10, t10) {
          let r10 = Response.json(e10, t10);
          return new X(r10.body, r10);
        }
        static redirect(e10, t10) {
          let r10 = "number" == typeof t10 ? t10 : (null == t10 ? void 0 : t10.status) ?? 307;
          if (!F.has(r10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let s10 = "object" == typeof t10 ? t10 : {}, n10 = new Headers(null == s10 ? void 0 : s10.headers);
          return n10.set("Location", R(e10)), new X(null, { ...s10, headers: n10, status: r10 });
        }
        static rewrite(e10, t10) {
          let r10 = new Headers(null == t10 ? void 0 : t10.headers);
          return r10.set("x-middleware-rewrite", R(e10)), J(t10, r10), new X(null, { ...t10, headers: r10 });
        }
        static next(e10) {
          let t10 = new Headers(null == e10 ? void 0 : e10.headers);
          return t10.set("x-middleware-next", "1"), J(e10, t10), new X(null, { ...e10, headers: t10 });
        }
      }
      function Y(e10, t10) {
        let r10 = "string" == typeof t10 ? new URL(t10) : t10, s10 = new URL(e10, t10), n10 = s10.origin === r10.origin;
        return { url: n10 ? s10.toString().slice(r10.origin.length) : s10.toString(), isRelative: n10 };
      }
      let Q = "Next-Router-Prefetch", Z = ["RSC", "Next-Router-State-Tree", Q, "Next-HMR-Refresh", "Next-Router-Segment-Prefetch"], ee = "_rsc";
      class et extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new et();
        }
      }
      class er extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r10, s10) {
            if ("symbol" == typeof r10) return G.get(t10, r10, s10);
            let n10 = r10.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            if (void 0 !== i2) return G.get(t10, i2, s10);
          }, set(t10, r10, s10, n10) {
            if ("symbol" == typeof r10) return G.set(t10, r10, s10, n10);
            let i2 = r10.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            return G.set(t10, a2 ?? r10, s10, n10);
          }, has(t10, r10) {
            if ("symbol" == typeof r10) return G.has(t10, r10);
            let s10 = r10.toLowerCase(), n10 = Object.keys(e10).find((e11) => e11.toLowerCase() === s10);
            return void 0 !== n10 && G.has(t10, n10);
          }, deleteProperty(t10, r10) {
            if ("symbol" == typeof r10) return G.deleteProperty(t10, r10);
            let s10 = r10.toLowerCase(), n10 = Object.keys(e10).find((e11) => e11.toLowerCase() === s10);
            return void 0 === n10 || G.deleteProperty(t10, n10);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "append":
              case "delete":
              case "set":
                return et.callable;
              default:
                return G.get(e11, t10, r10);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new er(e10);
        }
        append(e10, t10) {
          let r10 = this.headers[e10];
          "string" == typeof r10 ? this.headers[e10] = [r10, t10] : Array.isArray(r10) ? r10.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r10, s10] of this.entries()) e10.call(t10, s10, r10, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r10 = this.get(t10);
            yield [t10, r10];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let es = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class en {
        disable() {
          throw es;
        }
        getStore() {
        }
        run() {
          throw es;
        }
        exit() {
          throw es;
        }
        enterWith() {
          throw es;
        }
        static bind(e10) {
          return e10;
        }
      }
      let ei = "undefined" != typeof globalThis && globalThis.AsyncLocalStorage;
      function ea() {
        return ei ? new ei() : new en();
      }
      let eo = ea(), el = ea();
      class eu extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new eu();
        }
      }
      class ec {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return eu.callable;
              default:
                return G.get(e11, t10, r10);
            }
          } });
        }
      }
      let eh = Symbol.for("next.mutated.cookies");
      class ed {
        static wrap(e10, t10) {
          let r10 = new W.ResponseCookies(new Headers());
          for (let t11 of e10.getAll()) r10.set(t11);
          let s10 = [], n10 = /* @__PURE__ */ new Set(), i2 = () => {
            let e11 = eo.getStore();
            if (e11 && (e11.pathWasRevalidated = true), s10 = r10.getAll().filter((e12) => n10.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of s10) {
                let r11 = new W.ResponseCookies(new Headers());
                r11.set(t11), e12.push(r11.toString());
              }
              t10(e12);
            }
          }, a2 = new Proxy(r10, { get(e11, t11, r11) {
            switch (t11) {
              case eh:
                return s10;
              case "delete":
                return function(...t12) {
                  n10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.delete(...t12), a2;
                  } finally {
                    i2();
                  }
                };
              case "set":
                return function(...t12) {
                  n10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12), a2;
                  } finally {
                    i2();
                  }
                };
              default:
                return G.get(e11, t11, r11);
            }
          } });
          return a2;
        }
      }
      function ep(e10) {
        if ("action" !== function(e11) {
          let t10 = el.getStore();
          switch (!t10 && function(e12) {
            throw Object.defineProperty(Error(`\`${e12}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E251", enumerable: false, configurable: true });
          }(e11), t10.type) {
            case "request":
            default:
              return t10;
            case "prerender":
            case "prerender-ppr":
            case "prerender-legacy":
              throw Object.defineProperty(Error(`\`${e11}\` cannot be called inside a prerender. This is a bug in Next.js.`), "__NEXT_ERROR_CODE", { value: "E401", enumerable: false, configurable: true });
            case "cache":
              throw Object.defineProperty(Error(`\`${e11}\` cannot be called inside "use cache". Call it outside and pass an argument instead. Read more: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", { value: "E37", enumerable: false, configurable: true });
            case "unstable-cache":
              throw Object.defineProperty(Error(`\`${e11}\` cannot be called inside unstable_cache. Call it outside and pass an argument instead. Read more: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", { value: "E69", enumerable: false, configurable: true });
          }
        }(e10).phase) throw new eu();
      }
      var ef = function(e10) {
        return e10.handleRequest = "BaseServer.handleRequest", e10.run = "BaseServer.run", e10.pipe = "BaseServer.pipe", e10.getStaticHTML = "BaseServer.getStaticHTML", e10.render = "BaseServer.render", e10.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", e10.renderToResponse = "BaseServer.renderToResponse", e10.renderToHTML = "BaseServer.renderToHTML", e10.renderError = "BaseServer.renderError", e10.renderErrorToResponse = "BaseServer.renderErrorToResponse", e10.renderErrorToHTML = "BaseServer.renderErrorToHTML", e10.render404 = "BaseServer.render404", e10;
      }(ef || {}), eg = function(e10) {
        return e10.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", e10.loadComponents = "LoadComponents.loadComponents", e10;
      }(eg || {}), em = function(e10) {
        return e10.getRequestHandler = "NextServer.getRequestHandler", e10.getServer = "NextServer.getServer", e10.getServerRequestHandler = "NextServer.getServerRequestHandler", e10.createServer = "createServer.createServer", e10;
      }(em || {}), eb = function(e10) {
        return e10.compression = "NextNodeServer.compression", e10.getBuildId = "NextNodeServer.getBuildId", e10.createComponentTree = "NextNodeServer.createComponentTree", e10.clientComponentLoading = "NextNodeServer.clientComponentLoading", e10.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", e10.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", e10.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", e10.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", e10.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", e10.sendRenderResult = "NextNodeServer.sendRenderResult", e10.proxyRequest = "NextNodeServer.proxyRequest", e10.runApi = "NextNodeServer.runApi", e10.render = "NextNodeServer.render", e10.renderHTML = "NextNodeServer.renderHTML", e10.imageOptimizer = "NextNodeServer.imageOptimizer", e10.getPagePath = "NextNodeServer.getPagePath", e10.getRoutesManifest = "NextNodeServer.getRoutesManifest", e10.findPageComponents = "NextNodeServer.findPageComponents", e10.getFontManifest = "NextNodeServer.getFontManifest", e10.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", e10.getRequestHandler = "NextNodeServer.getRequestHandler", e10.renderToHTML = "NextNodeServer.renderToHTML", e10.renderError = "NextNodeServer.renderError", e10.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", e10.render404 = "NextNodeServer.render404", e10.startResponse = "NextNodeServer.startResponse", e10.route = "route", e10.onProxyReq = "onProxyReq", e10.apiResolver = "apiResolver", e10.internalFetch = "internalFetch", e10;
      }(eb || {}), ey = function(e10) {
        return e10.startServer = "startServer.startServer", e10;
      }(ey || {}), ew = function(e10) {
        return e10.getServerSideProps = "Render.getServerSideProps", e10.getStaticProps = "Render.getStaticProps", e10.renderToString = "Render.renderToString", e10.renderDocument = "Render.renderDocument", e10.createBodyResult = "Render.createBodyResult", e10;
      }(ew || {}), ev = function(e10) {
        return e10.renderToString = "AppRender.renderToString", e10.renderToReadableStream = "AppRender.renderToReadableStream", e10.getBodyResult = "AppRender.getBodyResult", e10.fetch = "AppRender.fetch", e10;
      }(ev || {}), e_ = function(e10) {
        return e10.executeRoute = "Router.executeRoute", e10;
      }(e_ || {}), ek = function(e10) {
        return e10.runHandler = "Node.runHandler", e10;
      }(ek || {}), eS = function(e10) {
        return e10.runHandler = "AppRouteRouteHandlers.runHandler", e10;
      }(eS || {}), eE = function(e10) {
        return e10.generateMetadata = "ResolveMetadata.generateMetadata", e10.generateViewport = "ResolveMetadata.generateViewport", e10;
      }(eE || {}), eT = function(e10) {
        return e10.execute = "Middleware.execute", e10;
      }(eT || {});
      let eR = ["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"], eO = ["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"];
      function eC(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let { context: eP, propagation: ex, trace: eA, SpanStatusCode: ej, SpanKind: eI, ROOT_CONTEXT: eN } = s = r(956);
      class e$ extends Error {
        constructor(e10, t10) {
          super(), this.bubble = e10, this.result = t10;
        }
      }
      let eL = (e10, t10) => {
        (function(e11) {
          return "object" == typeof e11 && null !== e11 && e11 instanceof e$;
        })(t10) && t10.bubble ? e10.setAttribute("next.bubble", true) : (t10 && e10.recordException(t10), e10.setStatus({ code: ej.ERROR, message: null == t10 ? void 0 : t10.message })), e10.end();
      }, eD = /* @__PURE__ */ new Map(), eU = s.createContextKey("next.rootSpanId"), eM = 0, eq = () => eM++, eB = { set(e10, t10, r10) {
        e10.push({ key: t10, value: r10 });
      } };
      class eH {
        getTracerInstance() {
          return eA.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return eP;
        }
        getTracePropagationData() {
          let e10 = eP.active(), t10 = [];
          return ex.inject(e10, t10, eB), t10;
        }
        getActiveScopeSpan() {
          return eA.getSpan(null == eP ? void 0 : eP.active());
        }
        withPropagatedContext(e10, t10, r10) {
          let s10 = eP.active();
          if (eA.getSpanContext(s10)) return t10();
          let n10 = ex.extract(s10, e10, r10);
          return eP.with(n10, t10);
        }
        trace(...e10) {
          var t10;
          let [r10, s10, n10] = e10, { fn: i2, options: a2 } = "function" == typeof s10 ? { fn: s10, options: {} } : { fn: n10, options: { ...s10 } }, o2 = a2.spanName ?? r10;
          if (!eR.includes(r10) && "1" !== process.env.NEXT_OTEL_VERBOSE || a2.hideSpan) return i2();
          let l2 = this.getSpanContext((null == a2 ? void 0 : a2.parentSpan) ?? this.getActiveScopeSpan()), u2 = false;
          l2 ? (null == (t10 = eA.getSpanContext(l2)) ? void 0 : t10.isRemote) && (u2 = true) : (l2 = (null == eP ? void 0 : eP.active()) ?? eN, u2 = true);
          let c2 = eq();
          return a2.attributes = { "next.span_name": o2, "next.span_type": r10, ...a2.attributes }, eP.with(l2.setValue(eU, c2), () => this.getTracerInstance().startActiveSpan(o2, a2, (e11) => {
            let t11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0, s11 = () => {
              eD.delete(c2), t11 && process.env.NEXT_OTEL_PERFORMANCE_PREFIX && eO.includes(r10 || "") && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-${(r10.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: t11, end: performance.now() });
            };
            u2 && eD.set(c2, new Map(Object.entries(a2.attributes ?? {})));
            try {
              if (i2.length > 1) return i2(e11, (t13) => eL(e11, t13));
              let t12 = i2(e11);
              if (eC(t12)) return t12.then((t13) => (e11.end(), t13)).catch((t13) => {
                throw eL(e11, t13), t13;
              }).finally(s11);
              return e11.end(), s11(), t12;
            } catch (t12) {
              throw eL(e11, t12), s11(), t12;
            }
          }));
        }
        wrap(...e10) {
          let t10 = this, [r10, s10, n10] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return eR.includes(r10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = s10;
            "function" == typeof e11 && "function" == typeof n10 && (e11 = e11.apply(this, arguments));
            let i2 = arguments.length - 1, a2 = arguments[i2];
            if ("function" != typeof a2) return t10.trace(r10, e11, () => n10.apply(this, arguments));
            {
              let s11 = t10.getContext().bind(eP.active(), a2);
              return t10.trace(r10, e11, (e12, t11) => (arguments[i2] = function(e13) {
                return null == t11 || t11(e13), s11.apply(this, arguments);
              }, n10.apply(this, arguments)));
            }
          } : n10;
        }
        startSpan(...e10) {
          let [t10, r10] = e10, s10 = this.getSpanContext((null == r10 ? void 0 : r10.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t10, r10, s10);
        }
        getSpanContext(e10) {
          return e10 ? eA.setSpan(eP.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = eP.active().getValue(eU);
          return eD.get(e10);
        }
        setRootSpanAttribute(e10, t10) {
          let r10 = eP.active().getValue(eU), s10 = eD.get(r10);
          s10 && s10.set(e10, t10);
        }
      }
      let eW = (() => {
        let e10 = new eH();
        return () => e10;
      })(), eV = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(eV);
      class ez {
        constructor(e10, t10, r10, s10) {
          var n10;
          let i2 = e10 && function(e11, t11) {
            let r11 = er.from(e11.headers);
            return { isOnDemandRevalidate: r11.get("x-prerender-revalidate") === t11.previewModeId, revalidateOnlyGenerated: r11.has("x-prerender-revalidate-if-generated") };
          }(t10, e10).isOnDemandRevalidate, a2 = null == (n10 = r10.get(eV)) ? void 0 : n10.value;
          this._isEnabled = !!(!i2 && a2 && e10 && a2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = s10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: eV, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: eV, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function eG(e10, t10) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r10 = e10.headers["x-middleware-set-cookie"], s10 = new Headers();
          for (let e11 of E(r10)) s10.append("set-cookie", e11);
          for (let e11 of new W.ResponseCookies(s10).getAll()) t10.set(e11);
        }
      }
      var eK = r(802), eF = r.n(eK);
      class eJ extends Error {
        constructor(e10, t10) {
          super("Invariant: " + (e10.endsWith(".") ? e10 : e10 + ".") + " This is a bug in Next.js.", t10), this.name = "InvariantError";
        }
      }
      class eX {
        constructor(e10, t10) {
          this.cache = /* @__PURE__ */ new Map(), this.sizes = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = e10, this.calculateSize = t10 || (() => 1);
        }
        set(e10, t10) {
          if (!e10 || !t10) return;
          let r10 = this.calculateSize(t10);
          if (r10 > this.maxSize) return void console.warn("Single item size exceeds maxSize");
          this.cache.has(e10) && (this.totalSize -= this.sizes.get(e10) || 0), this.cache.set(e10, t10), this.sizes.set(e10, r10), this.totalSize += r10, this.touch(e10);
        }
        has(e10) {
          return !!e10 && (this.touch(e10), !!this.cache.get(e10));
        }
        get(e10) {
          if (!e10) return;
          let t10 = this.cache.get(e10);
          if (void 0 !== t10) return this.touch(e10), t10;
        }
        touch(e10) {
          let t10 = this.cache.get(e10);
          void 0 !== t10 && (this.cache.delete(e10), this.cache.set(e10, t10), this.evictIfNecessary());
        }
        evictIfNecessary() {
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) this.evictLeastRecentlyUsed();
        }
        evictLeastRecentlyUsed() {
          let e10 = this.cache.keys().next().value;
          if (void 0 !== e10) {
            let t10 = this.sizes.get(e10) || 0;
            this.totalSize -= t10, this.cache.delete(e10), this.sizes.delete(e10);
          }
        }
        reset() {
          this.cache.clear(), this.sizes.clear(), this.totalSize = 0;
        }
        keys() {
          return [...this.cache.keys()];
        }
        remove(e10) {
          this.cache.has(e10) && (this.totalSize -= this.sizes.get(e10) || 0, this.cache.delete(e10), this.sizes.delete(e10));
        }
        clear() {
          this.cache.clear(), this.sizes.clear(), this.totalSize = 0;
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      r(356).Buffer, new eX(52428800, (e10) => e10.size), process.env.NEXT_PRIVATE_DEBUG_CACHE && console.debug.bind(console, "DefaultCacheHandler:"), process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let eY = Symbol.for("@next/cache-handlers-map"), eQ = Symbol.for("@next/cache-handlers-set"), eZ = globalThis;
      function e0() {
        if (eZ[eY]) return eZ[eY].entries();
      }
      async function e1(e10, t10) {
        if (!e10) return t10();
        let r10 = e2(e10);
        try {
          return await t10();
        } finally {
          let t11 = function(e11, t12) {
            let r11 = new Set(e11.pendingRevalidatedTags), s10 = new Set(e11.pendingRevalidateWrites);
            return { pendingRevalidatedTags: t12.pendingRevalidatedTags.filter((e12) => !r11.has(e12)), pendingRevalidates: Object.fromEntries(Object.entries(t12.pendingRevalidates).filter(([t13]) => !(t13 in e11.pendingRevalidates))), pendingRevalidateWrites: t12.pendingRevalidateWrites.filter((e12) => !s10.has(e12)) };
          }(r10, e2(e10));
          await e5(e10, t11);
        }
      }
      function e2(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function e3(e10, t10) {
        if (0 === e10.length) return;
        let r10 = [];
        t10 && r10.push(t10.revalidateTag(e10));
        let s10 = function() {
          if (eZ[eQ]) return eZ[eQ].values();
        }();
        if (s10) for (let t11 of s10) r10.push(t11.expireTags(...e10));
        await Promise.all(r10);
      }
      async function e5(e10, t10) {
        let r10 = (null == t10 ? void 0 : t10.pendingRevalidatedTags) ?? e10.pendingRevalidatedTags ?? [], s10 = (null == t10 ? void 0 : t10.pendingRevalidates) ?? e10.pendingRevalidates ?? {}, n10 = (null == t10 ? void 0 : t10.pendingRevalidateWrites) ?? e10.pendingRevalidateWrites ?? [];
        return Promise.all([e3(r10, e10.incrementalCache), ...Object.values(s10), ...n10]);
      }
      let e4 = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class e6 {
        disable() {
          throw e4;
        }
        getStore() {
        }
        run() {
          throw e4;
        }
        exit() {
          throw e4;
        }
        enterWith() {
          throw e4;
        }
        static bind(e10) {
          return e10;
        }
      }
      let e8 = "undefined" != typeof globalThis && globalThis.AsyncLocalStorage, e9 = e8 ? new e8() : new e6();
      class e7 {
        constructor({ waitUntil: e10, onClose: t10, onTaskError: r10 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t10, this.onTaskError = r10, this.callbackQueue = new (eF())(), this.callbackQueue.pause();
        }
        after(e10) {
          if (eC(e10)) this.waitUntil || te(), this.waitUntil(e10.catch((e11) => this.reportTaskError("promise", e11)));
          else if ("function" == typeof e10) this.addCallback(e10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(e10) {
          var t10;
          this.waitUntil || te();
          let r10 = el.getStore();
          r10 && this.workUnitStores.add(r10);
          let s10 = e9.getStore(), n10 = s10 ? s10.rootTaskSpawnPhase : null == r10 ? void 0 : r10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let i2 = (t10 = async () => {
            try {
              await e9.run({ rootTaskSpawnPhase: n10 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          }, e8 ? e8.bind(t10) : e6.bind(t10));
          this.callbackQueue.add(i2);
        }
        async runCallbacksOnClose() {
          return await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let e11 of this.workUnitStores) e11.phase = "after";
          let e10 = eo.getStore();
          if (!e10) throw Object.defineProperty(new eJ("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return e1(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t10) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t10);
          } catch (e11) {
            console.error(Object.defineProperty(new eJ("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function te() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function tt(e10) {
        let t10, r10 = { then: (s10, n10) => (t10 || (t10 = e10()), t10.then((e11) => {
          r10.value = e11;
        }).catch(() => {
        }), t10.then(s10, n10)) };
        return r10;
      }
      class tr {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function ts() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID, previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let tn = Symbol.for("@next/request-context"), ti = (e10) => {
        let t10 = ["/layout"];
        if (e10.startsWith("/")) {
          let r10 = e10.split("/");
          for (let e11 = 1; e11 < r10.length + 1; e11++) {
            let s10 = r10.slice(0, e11).join("/");
            s10 && (s10.endsWith("/page") || s10.endsWith("/route") || (s10 = `${s10}${!s10.endsWith("/") ? "/" : ""}layout`), t10.push(s10));
          }
        }
        return t10;
      };
      async function ta(e10, t10, r10) {
        let s10 = [], n10 = r10 && r10.size > 0;
        for (let t11 of ti(e10)) t11 = `${k}${t11}`, s10.push(t11);
        if (t10.pathname && !n10) {
          let e11 = `${k}${t10.pathname}`;
          s10.push(e11);
        }
        return { tags: s10, expirationsByCacheKind: function(e11) {
          let t11 = /* @__PURE__ */ new Map(), r11 = e0();
          if (r11) for (let [s11, n11] of r11) "getExpiration" in n11 && t11.set(s11, tt(async () => n11.getExpiration(...e11)));
          return t11;
        }(s10) };
      }
      class to extends z {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new w({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new w({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new w({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let tl = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, tu = (e10, t10) => eW().withPropagatedContext(e10.headers, t10, tl), tc = false;
      async function th(e10) {
        var t10;
        let s10, n10;
        if (!tc && (tc = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
          let { interceptTestApis: e11, wrapRequestHandler: t11 } = r(905);
          e11(), tu = t11(tu);
        }
        await b();
        let i2 = void 0 !== globalThis.__BUILD_MANIFEST;
        e10.request.url = e10.request.url.replace(/\.rsc($|\?)/, "$1");
        let a2 = new H(e10.request.url, { headers: e10.request.headers, nextConfig: e10.request.nextConfig });
        for (let e11 of [...a2.searchParams.keys()]) {
          let t11 = a2.searchParams.getAll(e11), r10 = function(e12) {
            for (let t12 of ["nxtP", "nxtI"]) if (e12 !== t12 && e12.startsWith(t12)) return e12.substring(t12.length);
            return null;
          }(e11);
          if (r10) {
            for (let e12 of (a2.searchParams.delete(r10), t11)) a2.searchParams.append(r10, e12);
            a2.searchParams.delete(e11);
          }
        }
        let o2 = a2.buildId;
        a2.buildId = "";
        let l2 = function(e11) {
          let t11 = new Headers();
          for (let [r10, s11] of Object.entries(e11)) for (let e12 of Array.isArray(s11) ? s11 : [s11]) void 0 !== e12 && ("number" == typeof e12 && (e12 = e12.toString()), t11.append(r10, e12));
          return t11;
        }(e10.request.headers), u2 = l2.has("x-nextjs-data"), c2 = "1" === l2.get("RSC");
        u2 && "/index" === a2.pathname && (a2.pathname = "/");
        let h2 = /* @__PURE__ */ new Map();
        if (!i2) for (let e11 of Z) {
          let t11 = e11.toLowerCase(), r10 = l2.get(t11);
          null !== r10 && (h2.set(t11, r10), l2.delete(t11));
        }
        let d2 = new to({ page: e10.page, input: function(e11) {
          let t11 = "string" == typeof e11, r10 = t11 ? new URL(e11) : e11;
          return r10.searchParams.delete(ee), t11 ? r10.toString() : r10;
        }(a2).toString(), init: { body: e10.request.body, headers: l2, method: e10.request.method, nextConfig: e10.request.nextConfig, signal: e10.request.signal } });
        u2 && Object.defineProperty(d2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCache && e10.IncrementalCache && (globalThis.__incrementalCache = new e10.IncrementalCache({ appDir: true, fetchCache: true, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: e10.request.headers, requestProtocol: "https", getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: ts() }) }));
        let p2 = e10.request.waitUntil ?? (null == (t10 = function() {
          let e11 = globalThis[tn];
          return null == e11 ? void 0 : e11.get();
        }()) ? void 0 : t10.waitUntil), f2 = new A({ request: d2, page: e10.page, context: p2 ? { waitUntil: p2 } : void 0 });
        if ((s10 = await tu(d2, () => {
          if ("/middleware" === e10.page || "/src/middleware" === e10.page) {
            let t11 = f2.waitUntil.bind(f2), r10 = new tr();
            return eW().trace(eT.execute, { spanName: `middleware ${d2.method} ${d2.nextUrl.pathname}`, attributes: { "http.target": d2.nextUrl.pathname, "http.method": d2.method } }, async () => {
              try {
                var s11, i3, a3, l3, u3, c3;
                let h3 = ts(), p3 = await ta("/", d2.nextUrl, null), g3 = (u3 = d2.nextUrl, c3 = (e11) => {
                  n10 = e11;
                }, function(e11, t12, r11, s12, n11, i4, a4, o3, l4, u4, c4) {
                  function h4(e12) {
                    r11 && r11.setHeader("Set-Cookie", e12);
                  }
                  let d3 = {};
                  return { type: "request", phase: e11, implicitTags: i4, url: { pathname: s12.pathname, search: s12.search ?? "" }, rootParams: n11, get headers() {
                    return d3.headers || (d3.headers = function(e12) {
                      let t13 = er.from(e12);
                      for (let e13 of Z) t13.delete(e13.toLowerCase());
                      return er.seal(t13);
                    }(t12.headers)), d3.headers;
                  }, get cookies() {
                    if (!d3.cookies) {
                      let e12 = new W.RequestCookies(er.from(t12.headers));
                      eG(t12, e12), d3.cookies = ec.seal(e12);
                    }
                    return d3.cookies;
                  }, set cookies(value) {
                    d3.cookies = value;
                  }, get mutableCookies() {
                    if (!d3.mutableCookies) {
                      let e12 = function(e13, t13) {
                        let r12 = new W.RequestCookies(er.from(e13));
                        return ed.wrap(r12, t13);
                      }(t12.headers, a4 || (r11 ? h4 : void 0));
                      eG(t12, e12), d3.mutableCookies = e12;
                    }
                    return d3.mutableCookies;
                  }, get userspaceMutableCookies() {
                    return d3.userspaceMutableCookies || (d3.userspaceMutableCookies = function(e12) {
                      let t13 = new Proxy(e12, { get(e13, r12, s13) {
                        switch (r12) {
                          case "delete":
                            return function(...r13) {
                              return ep("cookies().delete"), e13.delete(...r13), t13;
                            };
                          case "set":
                            return function(...r13) {
                              return ep("cookies().set"), e13.set(...r13), t13;
                            };
                          default:
                            return G.get(e13, r12, s13);
                        }
                      } });
                      return t13;
                    }(this.mutableCookies)), d3.userspaceMutableCookies;
                  }, get draftMode() {
                    return d3.draftMode || (d3.draftMode = new ez(l4, t12, this.cookies, this.mutableCookies)), d3.draftMode;
                  }, renderResumeDataCache: o3 ?? null, isHmrRefresh: u4, serverComponentsHmrCache: c4 || globalThis.__serverComponentsHmrCache };
                }("action", d2, void 0, u3, {}, p3, c3, void 0, h3, false, void 0)), m3 = function({ page: e11, fallbackRouteParams: t12, renderOpts: r11, requestEndedState: s12, isPrefetchRequest: n11, buildId: i4, previouslyRevalidatedTags: a4 }) {
                  var o3;
                  let l4 = { isStaticGeneration: !r11.shouldWaitOnAllReady && !r11.supportsDynamicResponse && !r11.isDraftMode && !r11.isPossibleServerAction, page: e11, fallbackRouteParams: t12, route: (o3 = e11.split("/").reduce((e12, t13, r12, s13) => t13 ? "(" === t13[0] && t13.endsWith(")") || "@" === t13[0] || ("page" === t13 || "route" === t13) && r12 === s13.length - 1 ? e12 : e12 + "/" + t13 : e12, "")).startsWith("/") ? o3 : "/" + o3, incrementalCache: r11.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: r11.cacheLifeProfiles, isRevalidate: r11.isRevalidate, isPrerendering: r11.nextExport, fetchCache: r11.fetchCache, isOnDemandRevalidate: r11.isOnDemandRevalidate, isDraftMode: r11.isDraftMode, requestEndedState: s12, isPrefetchRequest: n11, buildId: i4, reactLoadableManifest: (null == r11 ? void 0 : r11.reactLoadableManifest) || {}, assetPrefix: (null == r11 ? void 0 : r11.assetPrefix) || "", afterContext: function(e12) {
                    let { waitUntil: t13, onClose: r12, onAfterTaskError: s13 } = e12;
                    return new e7({ waitUntil: t13, onClose: r12, onTaskError: s13 });
                  }(r11), dynamicIOEnabled: r11.experimental.dynamicIO, dev: r11.dev ?? false, previouslyRevalidatedTags: a4, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t13 = e0();
                    if (t13) for (let [r12, s13] of t13) "refreshTags" in s13 && e12.set(r12, tt(async () => s13.refreshTags()));
                    return e12;
                  }() };
                  return r11.store = l4, l4;
                }({ page: "/", fallbackRouteParams: null, renderOpts: { cacheLifeProfiles: null == (i3 = e10.request.nextConfig) || null == (s11 = i3.experimental) ? void 0 : s11.cacheLife, experimental: { isRoutePPREnabled: false, dynamicIO: false, authInterrupts: !!(null == (l3 = e10.request.nextConfig) || null == (a3 = l3.experimental) ? void 0 : a3.authInterrupts) }, supportsDynamicResponse: true, waitUntil: t11, onClose: r10.onClose.bind(r10), onAfterTaskError: void 0 }, requestEndedState: { ended: false }, isPrefetchRequest: d2.headers.has(Q), buildId: o2 ?? "", previouslyRevalidatedTags: [] });
                return await eo.run(m3, () => el.run(g3, e10.handler, d2, f2));
              } finally {
                setTimeout(() => {
                  r10.dispatchClose();
                }, 0);
              }
            });
          }
          return e10.handler(d2, f2);
        })) && !(s10 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        s10 && n10 && s10.headers.set("set-cookie", n10);
        let g2 = null == s10 ? void 0 : s10.headers.get("x-middleware-rewrite");
        if (s10 && g2 && (c2 || !i2)) {
          let t11 = new H(g2, { forceLocale: true, headers: e10.request.headers, nextConfig: e10.request.nextConfig });
          i2 || t11.host !== d2.nextUrl.host || (t11.buildId = o2 || t11.buildId, s10.headers.set("x-middleware-rewrite", String(t11)));
          let { url: r10, isRelative: n11 } = Y(t11.toString(), a2.toString());
          !i2 && u2 && s10.headers.set("x-nextjs-rewrite", r10), c2 && n11 && (a2.pathname !== t11.pathname && s10.headers.set("x-nextjs-rewritten-path", t11.pathname), a2.search !== t11.search && s10.headers.set("x-nextjs-rewritten-query", t11.search.slice(1)));
        }
        let m2 = null == s10 ? void 0 : s10.headers.get("Location");
        if (s10 && m2 && !i2) {
          let t11 = new H(m2, { forceLocale: false, headers: e10.request.headers, nextConfig: e10.request.nextConfig });
          s10 = new Response(s10.body, s10), t11.host === a2.host && (t11.buildId = o2 || t11.buildId, s10.headers.set("Location", t11.toString())), u2 && (s10.headers.delete("Location"), s10.headers.set("x-nextjs-redirect", Y(t11.toString(), a2.toString()).url));
        }
        let y2 = s10 || X.next(), w2 = y2.headers.get("x-middleware-override-headers"), v2 = [];
        if (w2) {
          for (let [e11, t11] of h2) y2.headers.set(`x-middleware-request-${e11}`, t11), v2.push(e11);
          v2.length > 0 && y2.headers.set("x-middleware-override-headers", w2 + "," + v2.join(","));
        }
        return { response: y2, waitUntil: ("internal" === f2[P].kind ? Promise.all(f2[P].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: d2.fetchMetrics };
      }
      r(280), "undefined" == typeof URLPattern || URLPattern;
      var td = r(815);
      /* @__PURE__ */ new WeakMap();
      let tp = "function" == typeof td.unstable_postpone;
      function tf(e10, t10) {
        return `Route ${e10} needs to bail out of prerendering at this point because it used ${t10}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
      }
      if (false === function(e10) {
        return e10.includes("needs to bail out of prerendering at this point because it used") && e10.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error");
      }(tf("%%%", "^^^"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      RegExp(`\\n\\s+at __next_metadata_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_viewport_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_outlet_boundary__[\\n\\s]`), /* @__PURE__ */ new WeakMap();
      var tg = r(554);
      function tm() {
        return "undefined" != typeof window && void 0 !== window.document;
      }
      tg.qg, tg.lK;
      let tb = { path: "/", sameSite: "lax", httpOnly: false, maxAge: 3456e4 }, ty = /^(.*)[.](0|[1-9][0-9]*)$/;
      function tw(e10, t10) {
        if (e10 === t10) return true;
        let r10 = e10.match(ty);
        return !!r10 && r10[1] === t10;
      }
      function tv(e10, t10, r10) {
        let s10 = r10 ?? 3180, n10 = encodeURIComponent(t10);
        if (n10.length <= s10) return [{ name: e10, value: t10 }];
        let i2 = [];
        for (; n10.length > 0; ) {
          let e11 = n10.slice(0, s10), t11 = e11.lastIndexOf("%");
          t11 > s10 - 3 && (e11 = e11.slice(0, t11));
          let r11 = "";
          for (; e11.length > 0; ) try {
            r11 = decodeURIComponent(e11);
            break;
          } catch (t12) {
            if (t12 instanceof URIError && "%" === e11.at(-3) && e11.length > 3) e11 = e11.slice(0, e11.length - 3);
            else throw t12;
          }
          i2.push(r11), n10 = n10.slice(e11.length);
        }
        return i2.map((t11, r11) => ({ name: `${e10}.${r11}`, value: t11 }));
      }
      async function t_(e10, t10) {
        let r10 = await t10(e10);
        if (r10) return r10;
        let s10 = [];
        for (let r11 = 0; ; r11++) {
          let n10 = `${e10}.${r11}`, i2 = await t10(n10);
          if (!i2) break;
          s10.push(i2);
        }
        return s10.length > 0 ? s10.join("") : null;
      }
      let tk = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), tS = " 	\n\r=".split(""), tE = (() => {
        let e10 = Array(128);
        for (let t10 = 0; t10 < e10.length; t10 += 1) e10[t10] = -1;
        for (let t10 = 0; t10 < tS.length; t10 += 1) e10[tS[t10].charCodeAt(0)] = -2;
        for (let t10 = 0; t10 < tk.length; t10 += 1) e10[tk[t10].charCodeAt(0)] = t10;
        return e10;
      })();
      function tT(e10) {
        let t10 = [], r10 = 0, s10 = 0;
        if (function(e11, t11) {
          for (let r11 = 0; r11 < e11.length; r11 += 1) {
            let s11 = e11.charCodeAt(r11);
            if (s11 > 55295 && s11 <= 56319) {
              let t12 = (s11 - 55296) * 1024 & 65535;
              s11 = (e11.charCodeAt(r11 + 1) - 56320 & 65535 | t12) + 65536, r11 += 1;
            }
            !function(e12, t12) {
              if (e12 <= 127) return t12(e12);
              if (e12 <= 2047) {
                t12(192 | e12 >> 6), t12(128 | 63 & e12);
                return;
              }
              if (e12 <= 65535) {
                t12(224 | e12 >> 12), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                return;
              }
              if (e12 <= 1114111) {
                t12(240 | e12 >> 18), t12(128 | e12 >> 12 & 63), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                return;
              }
              throw Error(`Unrecognized Unicode codepoint: ${e12.toString(16)}`);
            }(s11, t11);
          }
        }(e10, (e11) => {
          for (r10 = r10 << 8 | e11, s10 += 8; s10 >= 6; ) {
            let e12 = r10 >> s10 - 6 & 63;
            t10.push(tk[e12]), s10 -= 6;
          }
        }), s10 > 0) for (r10 <<= 6 - s10, s10 = 6; s10 >= 6; ) {
          let e11 = r10 >> s10 - 6 & 63;
          t10.push(tk[e11]), s10 -= 6;
        }
        return t10.join("");
      }
      function tR(e10) {
        let t10 = [], r10 = (e11) => {
          t10.push(String.fromCodePoint(e11));
        }, s10 = { utf8seq: 0, codepoint: 0 }, n10 = 0, i2 = 0;
        for (let t11 = 0; t11 < e10.length; t11 += 1) {
          let a2 = tE[e10.charCodeAt(t11)];
          if (a2 > -1) for (n10 = n10 << 6 | a2, i2 += 6; i2 >= 8; ) (function(e11, t12, r11) {
            if (0 === t12.utf8seq) {
              if (e11 <= 127) return r11(e11);
              for (let r12 = 1; r12 < 6; r12 += 1) if ((e11 >> 7 - r12 & 1) == 0) {
                t12.utf8seq = r12;
                break;
              }
              if (2 === t12.utf8seq) t12.codepoint = 31 & e11;
              else if (3 === t12.utf8seq) t12.codepoint = 15 & e11;
              else if (4 === t12.utf8seq) t12.codepoint = 7 & e11;
              else throw Error("Invalid UTF-8 sequence");
              t12.utf8seq -= 1;
            } else if (t12.utf8seq > 0) {
              if (e11 <= 127) throw Error("Invalid UTF-8 sequence");
              t12.codepoint = t12.codepoint << 6 | 63 & e11, t12.utf8seq -= 1, 0 === t12.utf8seq && r11(t12.codepoint);
            }
          })(n10 >> i2 - 8 & 255, s10, r10), i2 -= 8;
          else if (-2 === a2) continue;
          else throw Error(`Invalid Base64-URL character "${e10.at(t11)}" at position ${t11}`);
        }
        return t10.join("");
      }
      let tO = "base64-";
      async function tC({ getAll: e10, setAll: t10, setItems: r10, removedItems: s10 }, n10) {
        let i2 = n10.cookieEncoding, a2 = n10.cookieOptions ?? null, o2 = await e10([...r10 ? Object.keys(r10) : [], ...s10 ? Object.keys(s10) : []]), l2 = o2?.map(({ name: e11 }) => e11) || [], u2 = Object.keys(s10).flatMap((e11) => l2.filter((t11) => tw(t11, e11))), c2 = Object.keys(r10).flatMap((e11) => {
          let t11 = new Set(l2.filter((t12) => tw(t12, e11))), s11 = r10[e11];
          "base64url" === i2 && (s11 = tO + tT(s11));
          let n11 = tv(e11, s11);
          return n11.forEach((e12) => {
            t11.delete(e12.name);
          }), u2.push(...t11), n11;
        }), h2 = { ...tb, ...a2, maxAge: 0 }, d2 = { ...tb, ...a2, maxAge: tb.maxAge };
        delete h2.name, delete d2.name, await t10([...u2.map((e11) => ({ name: e11, value: "", options: h2 })), ...c2.map(({ name: e11, value: t11 }) => ({ name: e11, value: t11, options: d2 }))], { "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0", Expires: "0", Pragma: "no-cache" });
      }
      function tP(e10, t10) {
        var r10 = {};
        for (var s10 in e10) Object.prototype.hasOwnProperty.call(e10, s10) && 0 > t10.indexOf(s10) && (r10[s10] = e10[s10]);
        if (null != e10 && "function" == typeof Object.getOwnPropertySymbols) for (var n10 = 0, s10 = Object.getOwnPropertySymbols(e10); n10 < s10.length; n10++) 0 > t10.indexOf(s10[n10]) && Object.prototype.propertyIsEnumerable.call(e10, s10[n10]) && (r10[s10[n10]] = e10[s10[n10]]);
        return r10;
      }
      Object.create;
      Object.create, "function" == typeof SuppressedError && SuppressedError;
      let tx = (e10) => e10 ? (...t10) => e10(...t10) : (...e11) => fetch(...e11);
      class tA extends Error {
        constructor(e10, t10 = "FunctionsError", r10) {
          super(e10), this.name = t10, this.context = r10;
        }
        toJSON() {
          return { name: this.name, message: this.message, context: this.context };
        }
      }
      class tj extends tA {
        constructor(e10) {
          super("Failed to send a request to the Edge Function", "FunctionsFetchError", e10);
        }
      }
      class tI extends tA {
        constructor(e10) {
          super("Relay Error invoking the Edge Function", "FunctionsRelayError", e10);
        }
      }
      class tN extends tA {
        constructor(e10) {
          super("Edge Function returned a non-2xx status code", "FunctionsHttpError", e10);
        }
      }
      !function(e10) {
        e10.Any = "any", e10.ApNortheast1 = "ap-northeast-1", e10.ApNortheast2 = "ap-northeast-2", e10.ApSouth1 = "ap-south-1", e10.ApSoutheast1 = "ap-southeast-1", e10.ApSoutheast2 = "ap-southeast-2", e10.CaCentral1 = "ca-central-1", e10.EuCentral1 = "eu-central-1", e10.EuWest1 = "eu-west-1", e10.EuWest2 = "eu-west-2", e10.EuWest3 = "eu-west-3", e10.SaEast1 = "sa-east-1", e10.UsEast1 = "us-east-1", e10.UsWest1 = "us-west-1", e10.UsWest2 = "us-west-2";
      }(i || (i = {}));
      class t$ {
        constructor(e10, { headers: t10 = {}, customFetch: r10, region: s10 = i.Any } = {}) {
          this.url = e10, this.headers = t10, this.region = s10, this.fetch = tx(r10);
        }
        setAuth(e10) {
          this.headers.Authorization = `Bearer ${e10}`;
        }
        invoke(e10) {
          var t10, r10, s10, n10;
          return t10 = this, r10 = arguments, s10 = void 0, n10 = function* (e11, t11 = {}) {
            var r11;
            let s11, n11;
            try {
              let i2, a2, { headers: o2, method: l2, body: u2, signal: c2, timeout: h2 } = t11, d2 = {}, { region: p2 } = t11;
              p2 || (p2 = this.region);
              let f2 = new URL(`${this.url}/${e11}`);
              p2 && "any" !== p2 && (d2["x-region"] = p2, f2.searchParams.set("forceFunctionRegion", p2)), u2 && (o2 && !Object.prototype.hasOwnProperty.call(o2, "Content-Type") || !o2) ? "undefined" != typeof Blob && u2 instanceof Blob || u2 instanceof ArrayBuffer ? (d2["Content-Type"] = "application/octet-stream", i2 = u2) : "string" == typeof u2 ? (d2["Content-Type"] = "text/plain", i2 = u2) : "undefined" != typeof FormData && u2 instanceof FormData ? i2 = u2 : (d2["Content-Type"] = "application/json", i2 = JSON.stringify(u2)) : i2 = !u2 || "string" == typeof u2 || "undefined" != typeof Blob && u2 instanceof Blob || u2 instanceof ArrayBuffer || "undefined" != typeof FormData && u2 instanceof FormData ? u2 : JSON.stringify(u2);
              let g2 = c2;
              h2 && (n11 = new AbortController(), s11 = setTimeout(() => n11.abort(), h2), c2 ? (g2 = n11.signal, c2.addEventListener("abort", () => n11.abort())) : g2 = n11.signal);
              let m2 = yield this.fetch(f2.toString(), { method: l2 || "POST", headers: Object.assign(Object.assign(Object.assign({}, d2), this.headers), o2), body: i2, signal: g2 }).catch((e12) => {
                throw new tj(e12);
              }), b2 = m2.headers.get("x-relay-error");
              if (b2 && "true" === b2) throw new tI(m2);
              if (!m2.ok) throw new tN(m2);
              let y2 = (null != (r11 = m2.headers.get("Content-Type")) ? r11 : "text/plain").split(";")[0].trim();
              return { data: "application/json" === y2 ? yield m2.json() : "application/octet-stream" === y2 || "application/pdf" === y2 ? yield m2.blob() : "text/event-stream" === y2 ? m2 : "multipart/form-data" === y2 ? yield m2.formData() : yield m2.text(), error: null, response: m2 };
            } catch (e12) {
              return { data: null, error: e12, response: e12 instanceof tN || e12 instanceof tI ? e12.context : void 0 };
            } finally {
              s11 && clearTimeout(s11);
            }
          }, new (s10 || (s10 = Promise))(function(e11, i2) {
            function a2(e12) {
              try {
                l2(n10.next(e12));
              } catch (e13) {
                i2(e13);
              }
            }
            function o2(e12) {
              try {
                l2(n10.throw(e12));
              } catch (e13) {
                i2(e13);
              }
            }
            function l2(t11) {
              var r11;
              t11.done ? e11(t11.value) : ((r11 = t11.value) instanceof s10 ? r11 : new s10(function(e12) {
                e12(r11);
              })).then(a2, o2);
            }
            l2((n10 = n10.apply(t10, r10 || [])).next());
          });
        }
      }
      let tL = (e10) => Math.min(1e3 * 2 ** e10, 3e4), tD = [520, 503], tU = ["GET", "HEAD", "OPTIONS"];
      var tM = class extends Error {
        constructor(e10) {
          super(e10.message), this.name = "PostgrestError", this.details = e10.details, this.hint = e10.hint, this.code = e10.code;
        }
        toJSON() {
          return { name: this.name, message: this.message, details: this.details, hint: this.hint, code: this.code };
        }
      };
      function tq(e10, t10) {
        return new Promise((r10) => {
          if (null == t10 ? void 0 : t10.aborted) return void r10();
          let s10 = setTimeout(() => {
            null == t10 || t10.removeEventListener("abort", n10), r10();
          }, e10);
          function n10() {
            clearTimeout(s10), r10();
          }
          null == t10 || t10.addEventListener("abort", n10);
        });
      }
      var tB = class {
        constructor(e10) {
          var t10, r10, s10, n10, i2;
          this.shouldThrowOnError = false, this.retryEnabled = true, this.method = e10.method, this.url = e10.url, this.headers = new Headers(e10.headers), this.schema = e10.schema, this.body = e10.body, this.shouldThrowOnError = null != (t10 = e10.shouldThrowOnError) && t10, this.signal = e10.signal, this.isMaybeSingle = null != (r10 = e10.isMaybeSingle) && r10, this.shouldStripNulls = null != (s10 = e10.shouldStripNulls) && s10, this.urlLengthLimit = null != (n10 = e10.urlLengthLimit) ? n10 : 8e3, this.retryEnabled = null == (i2 = e10.retry) || i2, e10.fetch ? this.fetch = e10.fetch : this.fetch = fetch;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        stripNulls() {
          if ("text/csv" === this.headers.get("Accept")) throw Error("stripNulls() cannot be used with csv()");
          return this.shouldStripNulls = true, this;
        }
        setHeader(e10, t10) {
          return this.headers = new Headers(this.headers), this.headers.set(e10, t10), this;
        }
        retry(e10) {
          return this.retryEnabled = e10, this;
        }
        then(e10, t10) {
          var r10 = this;
          if (void 0 === this.schema || (["GET", "HEAD"].includes(this.method) ? this.headers.set("Accept-Profile", this.schema) : this.headers.set("Content-Profile", this.schema)), "GET" !== this.method && "HEAD" !== this.method && this.headers.set("Content-Type", "application/json"), this.shouldStripNulls) {
            let e11 = this.headers.get("Accept");
            "application/vnd.pgrst.object+json" === e11 ? this.headers.set("Accept", "application/vnd.pgrst.object+json;nulls=stripped") : e11 && "application/json" !== e11 || this.headers.set("Accept", "application/vnd.pgrst.array+json;nulls=stripped");
          }
          let s10 = this.fetch, n10 = (async () => {
            let e11 = 0;
            for (; ; ) {
              var t11, n11, i2, a2, o2;
              let l2, u2 = new Headers(r10.headers);
              e11 > 0 && u2.set("X-Retry-Count", String(e11));
              try {
                l2 = await s10(r10.url.toString(), { method: r10.method, headers: u2, body: JSON.stringify(r10.body, (e12, t12) => "bigint" == typeof t12 ? t12.toString() : t12), signal: r10.signal });
              } catch (t12) {
                if ((null == t12 ? void 0 : t12.name) === "AbortError" || (null == t12 ? void 0 : t12.code) === "ABORT_ERR" || !tU.includes(r10.method)) throw t12;
                if (r10.retryEnabled && e11 < 3) {
                  let t13 = tL(e11);
                  e11++, await tq(t13, r10.signal);
                  continue;
                }
                throw t12;
              }
              if (t11 = r10.method, n11 = l2.status, i2 = e11, r10.retryEnabled && !(i2 >= 3) && tU.includes(t11) && tD.includes(n11) && 1) {
                let t12 = null != (a2 = null == (o2 = l2.headers) ? void 0 : o2.get("Retry-After")) ? a2 : null, s11 = null !== t12 ? 1e3 * Math.max(0, parseInt(t12, 10) || 0) : tL(e11);
                await l2.text(), e11++, await tq(s11, r10.signal);
                continue;
              }
              return await r10.processResponse(l2);
            }
          })();
          return this.shouldThrowOnError || (n10 = n10.catch((e11) => {
            var t11, r11, s11, n11, i2, a2;
            let o2 = "", l2 = "", u2 = "", c2 = null == e11 ? void 0 : e11.cause;
            if (c2) {
              let t12 = null != (r11 = null == c2 ? void 0 : c2.message) ? r11 : "", a3 = null != (s11 = null == c2 ? void 0 : c2.code) ? s11 : "";
              o2 = `${null != (n11 = null == e11 ? void 0 : e11.name) ? n11 : "FetchError"}: ${null == e11 ? void 0 : e11.message}

Caused by: ${null != (i2 = null == c2 ? void 0 : c2.name) ? i2 : "Error"}: ${t12}`, a3 && (o2 += ` (${a3})`), (null == c2 ? void 0 : c2.stack) && (o2 += `
${c2.stack}`);
            } else o2 = null != (a2 = null == e11 ? void 0 : e11.stack) ? a2 : "";
            let h2 = this.url.toString().length;
            return (null == e11 ? void 0 : e11.name) === "AbortError" || (null == e11 ? void 0 : e11.code) === "ABORT_ERR" ? (u2 = "", l2 = "Request was aborted (timeout or manual cancellation)", h2 > this.urlLengthLimit && (l2 += `. Note: Your request URL is ${h2} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)) : ((null == c2 ? void 0 : c2.name) === "HeadersOverflowError" || (null == c2 ? void 0 : c2.code) === "UND_ERR_HEADERS_OVERFLOW") && (u2 = "", l2 = "HTTP headers exceeded server limits (typically 16KB)", h2 > this.urlLengthLimit && (l2 += `. Your request URL is ${h2} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)), { success: false, error: { message: `${null != (t11 = null == e11 ? void 0 : e11.name) ? t11 : "FetchError"}: ${null == e11 ? void 0 : e11.message}`, details: o2, hint: l2, code: u2 }, data: null, count: null, status: 0, statusText: "" };
          })), n10.then(e10, t10);
        }
        async processResponse(e10) {
          var t10, r10, s10;
          let n10 = null, i2 = null, a2 = null, o2 = e10.status, l2 = e10.statusText;
          if (e10.ok) {
            if ("HEAD" !== this.method) {
              let t11 = await e10.text();
              "" === t11 || (i2 = "text/csv" === this.headers.get("Accept") || this.headers.get("Accept") && (null == (s10 = this.headers.get("Accept")) ? void 0 : s10.includes("application/vnd.pgrst.plan+text")) ? t11 : JSON.parse(t11));
            }
            let u2 = null == (t10 = this.headers.get("Prefer")) ? void 0 : t10.match(/count=(exact|planned|estimated)/), c2 = null == (r10 = e10.headers.get("content-range")) ? void 0 : r10.split("/");
            u2 && c2 && c2.length > 1 && (a2 = parseInt(c2[1])), this.isMaybeSingle && Array.isArray(i2) && (i2.length > 1 ? (n10 = { code: "PGRST116", details: `Results contain ${i2.length} rows, application/vnd.pgrst.object+json requires 1 row`, hint: null, message: "JSON object requested, multiple (or no) rows returned" }, i2 = null, a2 = null, o2 = 406, l2 = "Not Acceptable") : i2 = 1 === i2.length ? i2[0] : null);
          } else {
            let t11 = await e10.text();
            try {
              n10 = JSON.parse(t11), Array.isArray(n10) && 404 === e10.status && (i2 = [], n10 = null, o2 = 200, l2 = "OK");
            } catch (r11) {
              404 === e10.status && "" === t11 ? (o2 = 204, l2 = "No Content") : n10 = { message: t11 };
            }
            if (n10 && this.shouldThrowOnError) throw new tM(n10);
          }
          return { success: null === n10, error: n10, data: i2, count: a2, status: o2, statusText: l2 };
        }
        returns() {
          return this;
        }
        overrideTypes() {
          return this;
        }
      }, tH = class extends tB {
        select(e10) {
          let t10 = false, r10 = (null != e10 ? e10 : "*").split("").map((e11) => /\s/.test(e11) && !t10 ? "" : ('"' === e11 && (t10 = !t10), e11)).join("");
          return this.url.searchParams.set("select", r10), this.headers.append("Prefer", "return=representation"), this;
        }
        order(e10, { ascending: t10 = true, nullsFirst: r10, foreignTable: s10, referencedTable: n10 = s10 } = {}) {
          let i2 = n10 ? `${n10}.order` : "order", a2 = this.url.searchParams.get(i2);
          return this.url.searchParams.set(i2, `${a2 ? `${a2},` : ""}${e10}.${t10 ? "asc" : "desc"}${void 0 === r10 ? "" : r10 ? ".nullsfirst" : ".nullslast"}`), this;
        }
        limit(e10, { foreignTable: t10, referencedTable: r10 = t10 } = {}) {
          let s10 = void 0 === r10 ? "limit" : `${r10}.limit`;
          return this.url.searchParams.set(s10, `${e10}`), this;
        }
        range(e10, t10, { foreignTable: r10, referencedTable: s10 = r10 } = {}) {
          let n10 = void 0 === s10 ? "offset" : `${s10}.offset`, i2 = void 0 === s10 ? "limit" : `${s10}.limit`;
          return this.url.searchParams.set(n10, `${e10}`), this.url.searchParams.set(i2, `${t10 - e10 + 1}`), this;
        }
        abortSignal(e10) {
          return this.signal = e10, this;
        }
        single() {
          return this.headers.set("Accept", "application/vnd.pgrst.object+json"), this;
        }
        maybeSingle() {
          return this.isMaybeSingle = true, this;
        }
        csv() {
          return this.headers.set("Accept", "text/csv"), this;
        }
        geojson() {
          return this.headers.set("Accept", "application/geo+json"), this;
        }
        explain({ analyze: e10 = false, verbose: t10 = false, settings: r10 = false, buffers: s10 = false, wal: n10 = false, format: i2 = "text" } = {}) {
          var a2;
          let o2 = [e10 ? "analyze" : null, t10 ? "verbose" : null, r10 ? "settings" : null, s10 ? "buffers" : null, n10 ? "wal" : null].filter(Boolean).join("|"), l2 = null != (a2 = this.headers.get("Accept")) ? a2 : "application/json";
          return this.headers.set("Accept", `application/vnd.pgrst.plan+${i2}; for="${l2}"; options=${o2};`), this;
        }
        rollback() {
          return this.headers.append("Prefer", "tx=rollback"), this;
        }
        returns() {
          return this;
        }
        maxAffected(e10) {
          return this.headers.append("Prefer", "handling=strict"), this.headers.append("Prefer", `max-affected=${e10}`), this;
        }
      };
      let tW = RegExp("[,()]");
      var tV = class extends tH {
        eq(e10, t10) {
          return this.url.searchParams.append(e10, `eq.${t10}`), this;
        }
        neq(e10, t10) {
          return this.url.searchParams.append(e10, `neq.${t10}`), this;
        }
        gt(e10, t10) {
          return this.url.searchParams.append(e10, `gt.${t10}`), this;
        }
        gte(e10, t10) {
          return this.url.searchParams.append(e10, `gte.${t10}`), this;
        }
        lt(e10, t10) {
          return this.url.searchParams.append(e10, `lt.${t10}`), this;
        }
        lte(e10, t10) {
          return this.url.searchParams.append(e10, `lte.${t10}`), this;
        }
        like(e10, t10) {
          return this.url.searchParams.append(e10, `like.${t10}`), this;
        }
        likeAllOf(e10, t10) {
          return this.url.searchParams.append(e10, `like(all).{${t10.join(",")}}`), this;
        }
        likeAnyOf(e10, t10) {
          return this.url.searchParams.append(e10, `like(any).{${t10.join(",")}}`), this;
        }
        ilike(e10, t10) {
          return this.url.searchParams.append(e10, `ilike.${t10}`), this;
        }
        ilikeAllOf(e10, t10) {
          return this.url.searchParams.append(e10, `ilike(all).{${t10.join(",")}}`), this;
        }
        ilikeAnyOf(e10, t10) {
          return this.url.searchParams.append(e10, `ilike(any).{${t10.join(",")}}`), this;
        }
        regexMatch(e10, t10) {
          return this.url.searchParams.append(e10, `match.${t10}`), this;
        }
        regexIMatch(e10, t10) {
          return this.url.searchParams.append(e10, `imatch.${t10}`), this;
        }
        is(e10, t10) {
          return this.url.searchParams.append(e10, `is.${t10}`), this;
        }
        isDistinct(e10, t10) {
          return this.url.searchParams.append(e10, `isdistinct.${t10}`), this;
        }
        in(e10, t10) {
          let r10 = Array.from(new Set(t10)).map((e11) => "string" == typeof e11 && tW.test(e11) ? `"${e11}"` : `${e11}`).join(",");
          return this.url.searchParams.append(e10, `in.(${r10})`), this;
        }
        notIn(e10, t10) {
          let r10 = Array.from(new Set(t10)).map((e11) => "string" == typeof e11 && tW.test(e11) ? `"${e11}"` : `${e11}`).join(",");
          return this.url.searchParams.append(e10, `not.in.(${r10})`), this;
        }
        contains(e10, t10) {
          return "string" == typeof t10 ? this.url.searchParams.append(e10, `cs.${t10}`) : Array.isArray(t10) ? this.url.searchParams.append(e10, `cs.{${t10.join(",")}}`) : this.url.searchParams.append(e10, `cs.${JSON.stringify(t10)}`), this;
        }
        containedBy(e10, t10) {
          return "string" == typeof t10 ? this.url.searchParams.append(e10, `cd.${t10}`) : Array.isArray(t10) ? this.url.searchParams.append(e10, `cd.{${t10.join(",")}}`) : this.url.searchParams.append(e10, `cd.${JSON.stringify(t10)}`), this;
        }
        rangeGt(e10, t10) {
          return this.url.searchParams.append(e10, `sr.${t10}`), this;
        }
        rangeGte(e10, t10) {
          return this.url.searchParams.append(e10, `nxl.${t10}`), this;
        }
        rangeLt(e10, t10) {
          return this.url.searchParams.append(e10, `sl.${t10}`), this;
        }
        rangeLte(e10, t10) {
          return this.url.searchParams.append(e10, `nxr.${t10}`), this;
        }
        rangeAdjacent(e10, t10) {
          return this.url.searchParams.append(e10, `adj.${t10}`), this;
        }
        overlaps(e10, t10) {
          return "string" == typeof t10 ? this.url.searchParams.append(e10, `ov.${t10}`) : this.url.searchParams.append(e10, `ov.{${t10.join(",")}}`), this;
        }
        textSearch(e10, t10, { config: r10, type: s10 } = {}) {
          let n10 = "";
          "plain" === s10 ? n10 = "pl" : "phrase" === s10 ? n10 = "ph" : "websearch" === s10 && (n10 = "w");
          let i2 = void 0 === r10 ? "" : `(${r10})`;
          return this.url.searchParams.append(e10, `${n10}fts${i2}.${t10}`), this;
        }
        match(e10) {
          return Object.entries(e10).filter(([e11, t10]) => void 0 !== t10).forEach(([e11, t10]) => {
            this.url.searchParams.append(e11, `eq.${t10}`);
          }), this;
        }
        not(e10, t10, r10) {
          return this.url.searchParams.append(e10, `not.${t10}.${r10}`), this;
        }
        or(e10, { foreignTable: t10, referencedTable: r10 = t10 } = {}) {
          let s10 = r10 ? `${r10}.or` : "or";
          return this.url.searchParams.append(s10, `(${e10})`), this;
        }
        filter(e10, t10, r10) {
          return this.url.searchParams.append(e10, `${t10}.${r10}`), this;
        }
      }, tz = class {
        constructor(e10, { headers: t10 = {}, schema: r10, fetch: s10, urlLengthLimit: n10 = 8e3, retry: i2 }) {
          this.url = e10, this.headers = new Headers(t10), this.schema = r10, this.fetch = s10, this.urlLengthLimit = n10, this.retry = i2;
        }
        cloneRequestState() {
          return { url: new URL(this.url.toString()), headers: new Headers(this.headers) };
        }
        select(e10, t10) {
          let { head: r10 = false, count: s10 } = null != t10 ? t10 : {}, n10 = false, i2 = (null != e10 ? e10 : "*").split("").map((e11) => /\s/.test(e11) && !n10 ? "" : ('"' === e11 && (n10 = !n10), e11)).join(""), { url: a2, headers: o2 } = this.cloneRequestState();
          return a2.searchParams.set("select", i2), s10 && o2.append("Prefer", `count=${s10}`), new tV({ method: r10 ? "HEAD" : "GET", url: a2, headers: o2, schema: this.schema, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        insert(e10, { count: t10, defaultToNull: r10 = true } = {}) {
          var s10;
          let { url: n10, headers: i2 } = this.cloneRequestState();
          if (t10 && i2.append("Prefer", `count=${t10}`), r10 || i2.append("Prefer", "missing=default"), Array.isArray(e10)) {
            let t11 = e10.reduce((e11, t12) => e11.concat(Object.keys(t12)), []);
            if (t11.length > 0) {
              let e11 = [...new Set(t11)].map((e12) => `"${e12}"`);
              n10.searchParams.set("columns", e11.join(","));
            }
          }
          return new tV({ method: "POST", url: n10, headers: i2, schema: this.schema, body: e10, fetch: null != (s10 = this.fetch) ? s10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        upsert(e10, { onConflict: t10, ignoreDuplicates: r10 = false, count: s10, defaultToNull: n10 = true } = {}) {
          var i2;
          let { url: a2, headers: o2 } = this.cloneRequestState();
          if (o2.append("Prefer", `resolution=${r10 ? "ignore" : "merge"}-duplicates`), void 0 !== t10 && a2.searchParams.set("on_conflict", t10), s10 && o2.append("Prefer", `count=${s10}`), n10 || o2.append("Prefer", "missing=default"), Array.isArray(e10)) {
            let t11 = e10.reduce((e11, t12) => e11.concat(Object.keys(t12)), []);
            if (t11.length > 0) {
              let e11 = [...new Set(t11)].map((e12) => `"${e12}"`);
              a2.searchParams.set("columns", e11.join(","));
            }
          }
          return new tV({ method: "POST", url: a2, headers: o2, schema: this.schema, body: e10, fetch: null != (i2 = this.fetch) ? i2 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        update(e10, { count: t10 } = {}) {
          var r10;
          let { url: s10, headers: n10 } = this.cloneRequestState();
          return t10 && n10.append("Prefer", `count=${t10}`), new tV({ method: "PATCH", url: s10, headers: n10, schema: this.schema, body: e10, fetch: null != (r10 = this.fetch) ? r10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        delete({ count: e10 } = {}) {
          var t10;
          let { url: r10, headers: s10 } = this.cloneRequestState();
          return e10 && s10.append("Prefer", `count=${e10}`), new tV({ method: "DELETE", url: r10, headers: s10, schema: this.schema, fetch: null != (t10 = this.fetch) ? t10 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
      };
      function tG(e10) {
        return (tG = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e11) {
          return typeof e11;
        } : function(e11) {
          return e11 && "function" == typeof Symbol && e11.constructor === Symbol && e11 !== Symbol.prototype ? "symbol" : typeof e11;
        })(e10);
      }
      function tK(e10, t10) {
        var r10 = Object.keys(e10);
        if (Object.getOwnPropertySymbols) {
          var s10 = Object.getOwnPropertySymbols(e10);
          t10 && (s10 = s10.filter(function(t11) {
            return Object.getOwnPropertyDescriptor(e10, t11).enumerable;
          })), r10.push.apply(r10, s10);
        }
        return r10;
      }
      function tF(e10) {
        for (var t10 = 1; t10 < arguments.length; t10++) {
          var r10 = null != arguments[t10] ? arguments[t10] : {};
          t10 % 2 ? tK(Object(r10), true).forEach(function(t11) {
            !function(e11, t12, r11) {
              var s10;
              (s10 = function(e12, t13) {
                if ("object" != tG(e12) || !e12) return e12;
                var r12 = e12[Symbol.toPrimitive];
                if (void 0 !== r12) {
                  var s11 = r12.call(e12, t13 || "default");
                  if ("object" != tG(s11)) return s11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === t13 ? String : Number)(e12);
              }(t12, "string"), (t12 = "symbol" == tG(s10) ? s10 : s10 + "") in e11) ? Object.defineProperty(e11, t12, { value: r11, enumerable: true, configurable: true, writable: true }) : e11[t12] = r11;
            }(e10, t11, r10[t11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e10, Object.getOwnPropertyDescriptors(r10)) : tK(Object(r10)).forEach(function(t11) {
            Object.defineProperty(e10, t11, Object.getOwnPropertyDescriptor(r10, t11));
          });
        }
        return e10;
      }
      var tJ = class e10 {
        constructor(e11, { headers: t10 = {}, schema: r10, fetch: s10, timeout: n10, urlLengthLimit: i2 = 8e3, retry: a2 } = {}) {
          this.url = e11, this.headers = new Headers(t10), this.schemaName = r10, this.urlLengthLimit = i2;
          let o2 = null != s10 ? s10 : globalThis.fetch;
          void 0 !== n10 && n10 > 0 ? this.fetch = (e12, t11) => {
            let r11 = new AbortController(), s11 = setTimeout(() => r11.abort(), n10), i3 = null == t11 ? void 0 : t11.signal;
            if (i3) {
              if (i3.aborted) return clearTimeout(s11), o2(e12, t11);
              let n11 = () => {
                clearTimeout(s11), r11.abort();
              };
              return i3.addEventListener("abort", n11, { once: true }), o2(e12, tF(tF({}, t11), {}, { signal: r11.signal })).finally(() => {
                clearTimeout(s11), i3.removeEventListener("abort", n11);
              });
            }
            return o2(e12, tF(tF({}, t11), {}, { signal: r11.signal })).finally(() => clearTimeout(s11));
          } : this.fetch = o2, this.retry = a2;
        }
        from(e11) {
          if (!e11 || "string" != typeof e11 || "" === e11.trim()) throw Error("Invalid relation name: relation must be a non-empty string.");
          return new tz(new URL(`${this.url}/${e11}`), { headers: new Headers(this.headers), schema: this.schemaName, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        schema(t10) {
          return new e10(this.url, { headers: this.headers, schema: t10, fetch: this.fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
        rpc(e11, t10 = {}, { head: r10 = false, get: s10 = false, count: n10 } = {}) {
          var i2;
          let a2, o2, l2 = new URL(`${this.url}/rpc/${e11}`), u2 = (e12) => null !== e12 && "object" == typeof e12 && (!Array.isArray(e12) || e12.some(u2)), c2 = r10 && Object.values(t10).some(u2);
          c2 ? (a2 = "POST", o2 = t10) : r10 || s10 ? (a2 = r10 ? "HEAD" : "GET", Object.entries(t10).filter(([e12, t11]) => void 0 !== t11).map(([e12, t11]) => [e12, Array.isArray(t11) ? `{${t11.join(",")}}` : `${t11}`]).forEach(([e12, t11]) => {
            l2.searchParams.append(e12, t11);
          })) : (a2 = "POST", o2 = t10);
          let h2 = new Headers(this.headers);
          return c2 ? h2.set("Prefer", n10 ? `count=${n10},return=minimal` : "return=minimal") : n10 && h2.set("Prefer", `count=${n10}`), new tV({ method: a2, url: l2, headers: h2, schema: this.schemaName, body: o2, fetch: null != (i2 = this.fetch) ? i2 : fetch, urlLengthLimit: this.urlLengthLimit, retry: this.retry });
        }
      };
      class tX {
        constructor() {
        }
        static detectEnvironment() {
          var e10;
          if ("undefined" != typeof WebSocket) return { type: "native", constructor: WebSocket };
          if ("undefined" != typeof globalThis && void 0 !== globalThis.WebSocket) return { type: "native", constructor: globalThis.WebSocket };
          if (void 0 !== r.g && void 0 !== r.g.WebSocket) return { type: "native", constructor: r.g.WebSocket };
          if ("undefined" != typeof globalThis && void 0 !== globalThis.WebSocketPair && void 0 === globalThis.WebSocket) return { type: "cloudflare", error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.", workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime." };
          if ("undefined" != typeof globalThis && globalThis.EdgeRuntime || "undefined" != typeof navigator && (null == (e10 = navigator.userAgent) ? void 0 : e10.includes("Vercel-Edge"))) return { type: "unsupported", error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.", workaround: "Use serverless functions or a different deployment target for WebSocket functionality." };
          let t10 = globalThis.process;
          if (t10) {
            let e11 = t10.versions;
            if (e11 && e11.node) {
              let t11 = parseInt(e11.node.replace(/^v/, "").split(".")[0]);
              return t11 >= 22 ? void 0 !== globalThis.WebSocket ? { type: "native", constructor: globalThis.WebSocket } : { type: "unsupported", error: `Node.js ${t11} detected but native WebSocket not found.`, workaround: "Provide a WebSocket implementation via the transport option." } : { type: "unsupported", error: `Node.js ${t11} detected without native WebSocket support.`, workaround: 'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })' };
            }
          }
          return { type: "unsupported", error: "Unknown JavaScript runtime without WebSocket support.", workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation." };
        }
        static getWebSocketConstructor() {
          let e10 = this.detectEnvironment();
          if (e10.constructor) return e10.constructor;
          let t10 = e10.error || "WebSocket not supported in this environment.";
          throw e10.workaround && (t10 += `

Suggested solution: ${e10.workaround}`), Error(t10);
        }
        static isWebSocketSupported() {
          try {
            let e10 = this.detectEnvironment();
            return "native" === e10.type || "ws" === e10.type;
          } catch (e10) {
            return false;
          }
        }
      }
      let tY = "2.0.0", tQ = { closed: "closed", errored: "errored", joined: "joined", joining: "joining", leaving: "leaving" }, tZ = { close: "phx_close", error: "phx_error", join: "phx_join", reply: "phx_reply", leave: "phx_leave", access_token: "access_token" }, t0 = { connecting: "connecting", closing: "closing", closed: "closed" };
      class t1 {
        constructor(e10) {
          this.HEADER_LENGTH = 1, this.USER_BROADCAST_PUSH_META_LENGTH = 6, this.KINDS = { userBroadcastPush: 3, userBroadcast: 4 }, this.BINARY_ENCODING = 0, this.JSON_ENCODING = 1, this.BROADCAST_EVENT = "broadcast", this.allowedMetadataKeys = [], this.allowedMetadataKeys = null != e10 ? e10 : [];
        }
        encode(e10, t10) {
          return e10.event !== this.BROADCAST_EVENT || e10.payload instanceof ArrayBuffer || "string" != typeof e10.payload.event ? t10(JSON.stringify([e10.join_ref, e10.ref, e10.topic, e10.event, e10.payload])) : t10(this._binaryEncodeUserBroadcastPush(e10));
        }
        _binaryEncodeUserBroadcastPush(e10) {
          var t10;
          return this._isArrayBuffer(null == (t10 = e10.payload) ? void 0 : t10.payload) ? this._encodeBinaryUserBroadcastPush(e10) : this._encodeJsonUserBroadcastPush(e10);
        }
        _encodeBinaryUserBroadcastPush(e10) {
          var t10, r10;
          let s10 = null != (r10 = null == (t10 = e10.payload) ? void 0 : t10.payload) ? r10 : new ArrayBuffer(0);
          return this._encodeUserBroadcastPush(e10, this.BINARY_ENCODING, s10);
        }
        _encodeJsonUserBroadcastPush(e10) {
          var t10, r10;
          let s10 = null != (r10 = null == (t10 = e10.payload) ? void 0 : t10.payload) ? r10 : {}, n10 = new TextEncoder().encode(JSON.stringify(s10)).buffer;
          return this._encodeUserBroadcastPush(e10, this.JSON_ENCODING, n10);
        }
        _encodeUserBroadcastPush(e10, t10, r10) {
          let s10 = e10.topic, n10 = null != (p2 = e10.ref) ? p2 : "", i2 = null != (f2 = e10.join_ref) ? f2 : "", a2 = e10.payload.event, o2 = this.allowedMetadataKeys ? this._pick(e10.payload, this.allowedMetadataKeys) : {}, l2 = 0 === Object.keys(o2).length ? "" : JSON.stringify(o2);
          if (i2.length > 255) throw Error(`joinRef length ${i2.length} exceeds maximum of 255`);
          if (n10.length > 255) throw Error(`ref length ${n10.length} exceeds maximum of 255`);
          if (s10.length > 255) throw Error(`topic length ${s10.length} exceeds maximum of 255`);
          if (a2.length > 255) throw Error(`userEvent length ${a2.length} exceeds maximum of 255`);
          if (l2.length > 255) throw Error(`metadata length ${l2.length} exceeds maximum of 255`);
          let u2 = this.USER_BROADCAST_PUSH_META_LENGTH + i2.length + n10.length + s10.length + a2.length + l2.length, c2 = new ArrayBuffer(this.HEADER_LENGTH + u2), h2 = new DataView(c2), d2 = 0;
          h2.setUint8(d2++, this.KINDS.userBroadcastPush), h2.setUint8(d2++, i2.length), h2.setUint8(d2++, n10.length), h2.setUint8(d2++, s10.length), h2.setUint8(d2++, a2.length), h2.setUint8(d2++, l2.length), h2.setUint8(d2++, t10), Array.from(i2, (e11) => h2.setUint8(d2++, e11.charCodeAt(0))), Array.from(n10, (e11) => h2.setUint8(d2++, e11.charCodeAt(0))), Array.from(s10, (e11) => h2.setUint8(d2++, e11.charCodeAt(0))), Array.from(a2, (e11) => h2.setUint8(d2++, e11.charCodeAt(0))), Array.from(l2, (e11) => h2.setUint8(d2++, e11.charCodeAt(0)));
          var p2, f2, g2 = new Uint8Array(c2.byteLength + r10.byteLength);
          return g2.set(new Uint8Array(c2), 0), g2.set(new Uint8Array(r10), c2.byteLength), g2.buffer;
        }
        decode(e10, t10) {
          if (this._isArrayBuffer(e10)) return t10(this._binaryDecode(e10));
          if ("string" == typeof e10) {
            let [r10, s10, n10, i2, a2] = JSON.parse(e10);
            return t10({ join_ref: r10, ref: s10, topic: n10, event: i2, payload: a2 });
          }
          return t10({});
        }
        _binaryDecode(e10) {
          let t10 = new DataView(e10), r10 = t10.getUint8(0), s10 = new TextDecoder();
          if (r10 === this.KINDS.userBroadcast) return this._decodeUserBroadcast(e10, t10, s10);
        }
        _decodeUserBroadcast(e10, t10, r10) {
          let s10 = t10.getUint8(1), n10 = t10.getUint8(2), i2 = t10.getUint8(3), a2 = t10.getUint8(4), o2 = this.HEADER_LENGTH + 4, l2 = r10.decode(e10.slice(o2, o2 + s10));
          o2 += s10;
          let u2 = r10.decode(e10.slice(o2, o2 + n10));
          o2 += n10;
          let c2 = r10.decode(e10.slice(o2, o2 + i2));
          o2 += i2;
          let h2 = e10.slice(o2, e10.byteLength), d2 = a2 === this.JSON_ENCODING ? JSON.parse(r10.decode(h2)) : h2, p2 = { type: this.BROADCAST_EVENT, event: u2, payload: d2 };
          return i2 > 0 && (p2.meta = JSON.parse(c2)), { join_ref: null, ref: null, topic: l2, event: this.BROADCAST_EVENT, payload: p2 };
        }
        _isArrayBuffer(e10) {
          var t10;
          return e10 instanceof ArrayBuffer || (null == (t10 = null == e10 ? void 0 : e10.constructor) ? void 0 : t10.name) === "ArrayBuffer";
        }
        _pick(e10, t10) {
          return e10 && "object" == typeof e10 ? Object.fromEntries(Object.entries(e10).filter(([e11]) => t10.includes(e11))) : {};
        }
      }
      !function(e10) {
        e10.abstime = "abstime", e10.bool = "bool", e10.date = "date", e10.daterange = "daterange", e10.float4 = "float4", e10.float8 = "float8", e10.int2 = "int2", e10.int4 = "int4", e10.int4range = "int4range", e10.int8 = "int8", e10.int8range = "int8range", e10.json = "json", e10.jsonb = "jsonb", e10.money = "money", e10.numeric = "numeric", e10.oid = "oid", e10.reltime = "reltime", e10.text = "text", e10.time = "time", e10.timestamp = "timestamp", e10.timestamptz = "timestamptz", e10.timetz = "timetz", e10.tsrange = "tsrange", e10.tstzrange = "tstzrange";
      }(a || (a = {}));
      let t2 = (e10, t10, r10 = {}) => {
        var s10;
        let n10 = null != (s10 = r10.skipTypes) ? s10 : [];
        return t10 ? Object.keys(t10).reduce((r11, s11) => (r11[s11] = t3(s11, e10, t10, n10), r11), {}) : {};
      }, t3 = (e10, t10, r10, s10) => {
        let n10 = t10.find((t11) => t11.name === e10), i2 = null == n10 ? void 0 : n10.type, a2 = r10[e10];
        return i2 && !s10.includes(i2) ? t5(i2, a2) : t4(a2);
      }, t5 = (e10, t10) => {
        if ("_" === e10.charAt(0)) return t7(t10, e10.slice(1, e10.length));
        switch (e10) {
          case a.bool:
            return t6(t10);
          case a.float4:
          case a.float8:
          case a.int2:
          case a.int4:
          case a.int8:
          case a.numeric:
          case a.oid:
            return t8(t10);
          case a.json:
          case a.jsonb:
            return t9(t10);
          case a.timestamp:
            return re(t10);
          case a.abstime:
          case a.date:
          case a.daterange:
          case a.int4range:
          case a.int8range:
          case a.money:
          case a.reltime:
          case a.text:
          case a.time:
          case a.timestamptz:
          case a.timetz:
          case a.tsrange:
          case a.tstzrange:
          default:
            return t4(t10);
        }
      }, t4 = (e10) => e10, t6 = (e10) => {
        switch (e10) {
          case "t":
            return true;
          case "f":
            return false;
          default:
            return e10;
        }
      }, t8 = (e10) => {
        if ("string" == typeof e10) {
          let t10 = parseFloat(e10);
          if (!Number.isNaN(t10)) return t10;
        }
        return e10;
      }, t9 = (e10) => {
        if ("string" == typeof e10) try {
          return JSON.parse(e10);
        } catch (e11) {
        }
        return e10;
      }, t7 = (e10, t10) => {
        if ("string" != typeof e10) return e10;
        let r10 = e10.length - 1, s10 = e10[r10];
        if ("{" === e10[0] && "}" === s10) {
          let s11, n10 = e10.slice(1, r10);
          try {
            s11 = JSON.parse("[" + n10 + "]");
          } catch (e11) {
            s11 = n10 ? n10.split(",") : [];
          }
          return s11.map((e11) => t5(t10, e11));
        }
        return e10;
      }, re = (e10) => "string" == typeof e10 ? e10.replace(" ", "T") : e10, rt = (e10) => {
        let t10 = new URL(e10);
        return t10.protocol = t10.protocol.replace(/^ws/i, "http"), t10.pathname = t10.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, ""), "" === t10.pathname || "/" === t10.pathname ? t10.pathname = "/api/broadcast" : t10.pathname = t10.pathname + "/api/broadcast", t10.href;
      };
      var rr = (e10) => "function" == typeof e10 ? e10 : function() {
        return e10;
      }, rs = "undefined" != typeof window ? window : null, rn = ("undefined" != typeof self ? self : null) || rs || globalThis, ri = { connecting: 0, open: 1, closing: 2, closed: 3 }, ra = { closed: "closed", errored: "errored", joined: "joined", joining: "joining", leaving: "leaving" }, ro = { close: "phx_close", error: "phx_error", join: "phx_join", reply: "phx_reply", leave: "phx_leave" }, rl = { longpoll: "longpoll", websocket: "websocket" }, ru = { complete: 4 }, rc = "base64url.bearer.phx.", rh = class {
        constructor(e10, t10, r10, s10) {
          this.channel = e10, this.event = t10, this.payload = r10 || function() {
            return {};
          }, this.receivedResp = null, this.timeout = s10, this.timeoutTimer = null, this.recHooks = [], this.sent = false, this.ref = void 0;
        }
        resend(e10) {
          this.timeout = e10, this.reset(), this.send();
        }
        send() {
          this.hasReceived("timeout") || (this.startTimeout(), this.sent = true, this.channel.socket.push({ topic: this.channel.topic, event: this.event, payload: this.payload(), ref: this.ref, join_ref: this.channel.joinRef() }));
        }
        receive(e10, t10) {
          return this.hasReceived(e10) && t10(this.receivedResp.response), this.recHooks.push({ status: e10, callback: t10 }), this;
        }
        reset() {
          this.cancelRefEvent(), this.ref = null, this.refEvent = null, this.receivedResp = null, this.sent = false;
        }
        destroy() {
          this.cancelRefEvent(), this.cancelTimeout();
        }
        matchReceive({ status: e10, response: t10, _ref: r10 }) {
          this.recHooks.filter((t11) => t11.status === e10).forEach((e11) => e11.callback(t10));
        }
        cancelRefEvent() {
          this.refEvent && this.channel.off(this.refEvent);
        }
        cancelTimeout() {
          clearTimeout(this.timeoutTimer), this.timeoutTimer = null;
        }
        startTimeout() {
          this.timeoutTimer && this.cancelTimeout(), this.ref = this.channel.socket.makeRef(), this.refEvent = this.channel.replyEventName(this.ref), this.channel.on(this.refEvent, (e10) => {
            this.cancelRefEvent(), this.cancelTimeout(), this.receivedResp = e10, this.matchReceive(e10);
          }), this.timeoutTimer = setTimeout(() => {
            this.trigger("timeout", {});
          }, this.timeout);
        }
        hasReceived(e10) {
          return this.receivedResp && this.receivedResp.status === e10;
        }
        trigger(e10, t10) {
          this.channel.trigger(this.refEvent, { status: e10, response: t10 });
        }
      }, rd = class {
        constructor(e10, t10) {
          this.callback = e10, this.timerCalc = t10, this.timer = void 0, this.tries = 0;
        }
        reset() {
          this.tries = 0, clearTimeout(this.timer);
        }
        scheduleTimeout() {
          clearTimeout(this.timer), this.timer = setTimeout(() => {
            this.tries = this.tries + 1, this.callback();
          }, this.timerCalc(this.tries + 1));
        }
      }, rp = class {
        constructor(e10, t10, r10) {
          this.state = ra.closed, this.topic = e10, this.params = rr(t10 || {}), this.socket = r10, this.bindings = [], this.bindingRef = 0, this.timeout = this.socket.timeout, this.joinedOnce = false, this.joinPush = new rh(this, ro.join, this.params, this.timeout), this.pushBuffer = [], this.stateChangeRefs = [], this.rejoinTimer = new rd(() => {
            this.socket.isConnected() && this.rejoin();
          }, this.socket.rejoinAfterMs), this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset())), this.stateChangeRefs.push(this.socket.onOpen(() => {
            this.rejoinTimer.reset(), this.isErrored() && this.rejoin();
          })), this.joinPush.receive("ok", () => {
            this.state = ra.joined, this.rejoinTimer.reset(), this.pushBuffer.forEach((e11) => e11.send()), this.pushBuffer = [];
          }), this.joinPush.receive("error", (e11) => {
            this.state = ra.errored, this.socket.hasLogger() && this.socket.log("channel", `error ${this.topic}`, e11), this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
          }), this.onClose(() => {
            this.rejoinTimer.reset(), this.socket.hasLogger() && this.socket.log("channel", `close ${this.topic}`), this.state = ra.closed, this.socket.remove(this);
          }), this.onError((e11) => {
            this.socket.hasLogger() && this.socket.log("channel", `error ${this.topic}`, e11), this.isJoining() && this.joinPush.reset(), this.state = ra.errored, this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
          }), this.joinPush.receive("timeout", () => {
            this.socket.hasLogger() && this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), new rh(this, ro.leave, rr({}), this.timeout).send(), this.state = ra.errored, this.joinPush.reset(), this.socket.isConnected() && this.rejoinTimer.scheduleTimeout();
          }), this.on(ro.reply, (e11, t11) => {
            this.trigger(this.replyEventName(t11), e11);
          });
        }
        join(e10 = this.timeout) {
          if (!this.joinedOnce) return this.timeout = e10, this.joinedOnce = true, this.rejoin(), this.joinPush;
          throw Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
        }
        teardown() {
          this.pushBuffer.forEach((e10) => e10.destroy()), this.pushBuffer = [], this.rejoinTimer.reset(), this.joinPush.destroy(), this.state = ra.closed, this.bindings = [];
        }
        onClose(e10) {
          this.on(ro.close, e10);
        }
        onError(e10) {
          return this.on(ro.error, (t10) => e10(t10));
        }
        on(e10, t10) {
          let r10 = this.bindingRef++;
          return this.bindings.push({ event: e10, ref: r10, callback: t10 }), r10;
        }
        off(e10, t10) {
          this.bindings = this.bindings.filter((r10) => r10.event !== e10 || void 0 !== t10 && t10 !== r10.ref);
        }
        canPush() {
          return this.socket.isConnected() && this.isJoined();
        }
        push(e10, t10, r10 = this.timeout) {
          if (t10 = t10 || {}, !this.joinedOnce) throw Error(`tried to push '${e10}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
          let s10 = new rh(this, e10, function() {
            return t10;
          }, r10);
          return this.canPush() ? s10.send() : (s10.startTimeout(), this.pushBuffer.push(s10)), s10;
        }
        leave(e10 = this.timeout) {
          this.rejoinTimer.reset(), this.joinPush.cancelTimeout(), this.state = ra.leaving;
          let t10 = () => {
            this.socket.hasLogger() && this.socket.log("channel", `leave ${this.topic}`), this.trigger(ro.close, "leave");
          }, r10 = new rh(this, ro.leave, rr({}), e10);
          return r10.receive("ok", () => t10()).receive("timeout", () => t10()), r10.send(), this.canPush() || r10.trigger("ok", {}), r10;
        }
        onMessage(e10, t10, r10) {
          return t10;
        }
        filterBindings(e10, t10, r10) {
          return true;
        }
        isMember(e10, t10, r10, s10) {
          return this.topic === e10 && (!s10 || s10 === this.joinRef() || (this.socket.hasLogger() && this.socket.log("channel", "dropping outdated message", { topic: e10, event: t10, payload: r10, joinRef: s10 }), false));
        }
        joinRef() {
          return this.joinPush.ref;
        }
        rejoin(e10 = this.timeout) {
          this.isLeaving() || (this.socket.leaveOpenTopic(this.topic), this.state = ra.joining, this.joinPush.resend(e10));
        }
        trigger(e10, t10, r10, s10) {
          let n10 = this.onMessage(e10, t10, r10, s10);
          if (t10 && !n10) throw Error("channel onMessage callbacks must return the payload, modified or unmodified");
          let i2 = this.bindings.filter((s11) => s11.event === e10 && this.filterBindings(s11, t10, r10));
          for (let e11 = 0; e11 < i2.length; e11++) i2[e11].callback(n10, r10, s10 || this.joinRef());
        }
        replyEventName(e10) {
          return `chan_reply_${e10}`;
        }
        isClosed() {
          return this.state === ra.closed;
        }
        isErrored() {
          return this.state === ra.errored;
        }
        isJoined() {
          return this.state === ra.joined;
        }
        isJoining() {
          return this.state === ra.joining;
        }
        isLeaving() {
          return this.state === ra.leaving;
        }
      }, rf = class {
        static request(e10, t10, r10, s10, n10, i2, a2) {
          if (rn.XDomainRequest) {
            let r11 = new rn.XDomainRequest();
            return this.xdomainRequest(r11, e10, t10, s10, n10, i2, a2);
          }
          if (rn.XMLHttpRequest) {
            let o2 = new rn.XMLHttpRequest();
            return this.xhrRequest(o2, e10, t10, r10, s10, n10, i2, a2);
          }
          if (rn.fetch && rn.AbortController) return this.fetchRequest(e10, t10, r10, s10, n10, i2, a2);
          throw Error("No suitable XMLHttpRequest implementation found");
        }
        static fetchRequest(e10, t10, r10, s10, n10, i2, a2) {
          let o2 = { method: e10, headers: r10, body: s10 }, l2 = null;
          return n10 && (l2 = new AbortController(), setTimeout(() => l2.abort(), n10), o2.signal = l2.signal), rn.fetch(t10, o2).then((e11) => e11.text()).then((e11) => this.parseJSON(e11)).then((e11) => a2 && a2(e11)).catch((e11) => {
            "AbortError" === e11.name && i2 ? i2() : a2 && a2(null);
          }), l2;
        }
        static xdomainRequest(e10, t10, r10, s10, n10, i2, a2) {
          return e10.timeout = n10, e10.open(t10, r10), e10.onload = () => {
            let t11 = this.parseJSON(e10.responseText);
            a2 && a2(t11);
          }, i2 && (e10.ontimeout = i2), e10.onprogress = () => {
          }, e10.send(s10), e10;
        }
        static xhrRequest(e10, t10, r10, s10, n10, i2, a2, o2) {
          for (let [n11, a3] of (e10.open(t10, r10, true), e10.timeout = i2, Object.entries(s10))) e10.setRequestHeader(n11, a3);
          return e10.onerror = () => o2 && o2(null), e10.onreadystatechange = () => {
            e10.readyState === ru.complete && o2 && o2(this.parseJSON(e10.responseText));
          }, a2 && (e10.ontimeout = a2), e10.send(n10), e10;
        }
        static parseJSON(e10) {
          if (!e10 || "" === e10) return null;
          try {
            return JSON.parse(e10);
          } catch {
            return console && console.log("failed to parse JSON response", e10), null;
          }
        }
        static serialize(e10, t10) {
          let r10 = [];
          for (var s10 in e10) {
            if (!Object.prototype.hasOwnProperty.call(e10, s10)) continue;
            let n10 = t10 ? `${t10}[${s10}]` : s10, i2 = e10[s10];
            "object" == typeof i2 ? r10.push(this.serialize(i2, n10)) : r10.push(encodeURIComponent(n10) + "=" + encodeURIComponent(i2));
          }
          return r10.join("&");
        }
        static appendParams(e10, t10) {
          if (0 === Object.keys(t10).length) return e10;
          let r10 = e10.match(/\?/) ? "&" : "?";
          return `${e10}${r10}${this.serialize(t10)}`;
        }
      }, rg = (e10) => {
        let t10 = "", r10 = new Uint8Array(e10), s10 = r10.byteLength;
        for (let e11 = 0; e11 < s10; e11++) t10 += String.fromCharCode(r10[e11]);
        return btoa(t10);
      }, rm = class {
        constructor(e10, t10) {
          t10 && 2 === t10.length && t10[1].startsWith(rc) && (this.authToken = atob(t10[1].slice(rc.length))), this.endPoint = null, this.token = null, this.skipHeartbeat = true, this.reqs = /* @__PURE__ */ new Set(), this.awaitingBatchAck = false, this.currentBatch = null, this.currentBatchTimer = null, this.batchBuffer = [], this.onopen = function() {
          }, this.onerror = function() {
          }, this.onmessage = function() {
          }, this.onclose = function() {
          }, this.pollEndpoint = this.normalizeEndpoint(e10), this.readyState = ri.connecting, setTimeout(() => this.poll(), 0);
        }
        normalizeEndpoint(e10) {
          return e10.replace("ws://", "http://").replace("wss://", "https://").replace(RegExp("(.*)/" + rl.websocket), "$1/" + rl.longpoll);
        }
        endpointURL() {
          return rf.appendParams(this.pollEndpoint, { token: this.token });
        }
        closeAndRetry(e10, t10, r10) {
          this.close(e10, t10, r10), this.readyState = ri.connecting;
        }
        ontimeout() {
          this.onerror("timeout"), this.closeAndRetry(1005, "timeout", false);
        }
        isActive() {
          return this.readyState === ri.open || this.readyState === ri.connecting;
        }
        poll() {
          let e10 = { Accept: "application/json" };
          this.authToken && (e10["X-Phoenix-AuthToken"] = this.authToken), this.ajax("GET", e10, null, () => this.ontimeout(), (e11) => {
            if (e11) {
              var { status: t10, token: r10, messages: s10 } = e11;
              if (410 === t10 && null !== this.token) {
                this.onerror(410), this.closeAndRetry(3410, "session_gone", false);
                return;
              }
              this.token = r10;
            } else t10 = 0;
            switch (t10) {
              case 200:
                s10.forEach((e12) => {
                  setTimeout(() => this.onmessage({ data: e12 }), 0);
                }), this.poll();
                break;
              case 204:
                this.poll();
                break;
              case 410:
                this.readyState = ri.open, this.onopen({}), this.poll();
                break;
              case 403:
                this.onerror(403), this.close(1008, "forbidden", false);
                break;
              case 0:
              case 500:
                this.onerror(500), this.closeAndRetry(1011, "internal server error", 500);
                break;
              default:
                throw Error(`unhandled poll status ${t10}`);
            }
          });
        }
        send(e10) {
          "string" != typeof e10 && (e10 = rg(e10)), this.currentBatch ? this.currentBatch.push(e10) : this.awaitingBatchAck ? this.batchBuffer.push(e10) : (this.currentBatch = [e10], this.currentBatchTimer = setTimeout(() => {
            this.batchSend(this.currentBatch), this.currentBatch = null;
          }, 0));
        }
        batchSend(e10) {
          this.awaitingBatchAck = true, this.ajax("POST", { "Content-Type": "application/x-ndjson" }, e10.join("\n"), () => this.onerror("timeout"), (e11) => {
            this.awaitingBatchAck = false, e11 && 200 === e11.status ? this.batchBuffer.length > 0 && (this.batchSend(this.batchBuffer), this.batchBuffer = []) : (this.onerror(e11 && e11.status), this.closeAndRetry(1011, "internal server error", false));
          });
        }
        close(e10, t10, r10) {
          for (let e11 of this.reqs) e11.abort();
          this.readyState = ri.closed;
          let s10 = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code: e10, reason: t10, wasClean: r10 });
          this.batchBuffer = [], clearTimeout(this.currentBatchTimer), this.currentBatchTimer = null, "undefined" != typeof CloseEvent ? this.onclose(new CloseEvent("close", s10)) : this.onclose(s10);
        }
        ajax(e10, t10, r10, s10, n10) {
          let i2;
          i2 = rf.request(e10, this.endpointURL(), t10, r10, this.timeout, () => {
            this.reqs.delete(i2), s10();
          }, (e11) => {
            this.reqs.delete(i2), this.isActive() && n10(e11);
          }), this.reqs.add(i2);
        }
      }, rb = class e10 {
        constructor(t10, r10 = {}) {
          let s10 = r10.events || { state: "presence_state", diff: "presence_diff" };
          this.state = {}, this.pendingDiffs = [], this.channel = t10, this.joinRef = null, this.caller = { onJoin: function() {
          }, onLeave: function() {
          }, onSync: function() {
          } }, this.channel.on(s10.state, (t11) => {
            let { onJoin: r11, onLeave: s11, onSync: n10 } = this.caller;
            this.joinRef = this.channel.joinRef(), this.state = e10.syncState(this.state, t11, r11, s11), this.pendingDiffs.forEach((t12) => {
              this.state = e10.syncDiff(this.state, t12, r11, s11);
            }), this.pendingDiffs = [], n10();
          }), this.channel.on(s10.diff, (t11) => {
            let { onJoin: r11, onLeave: s11, onSync: n10 } = this.caller;
            this.inPendingSyncState() ? this.pendingDiffs.push(t11) : (this.state = e10.syncDiff(this.state, t11, r11, s11), n10());
          });
        }
        onJoin(e11) {
          this.caller.onJoin = e11;
        }
        onLeave(e11) {
          this.caller.onLeave = e11;
        }
        onSync(e11) {
          this.caller.onSync = e11;
        }
        list(t10) {
          return e10.list(this.state, t10);
        }
        inPendingSyncState() {
          return !this.joinRef || this.joinRef !== this.channel.joinRef();
        }
        static syncState(e11, t10, r10, s10) {
          let n10 = this.clone(e11), i2 = {}, a2 = {};
          return this.map(n10, (e12, r11) => {
            t10[e12] || (a2[e12] = r11);
          }), this.map(t10, (e12, t11) => {
            let r11 = n10[e12];
            if (r11) {
              let s11 = t11.metas.map((e13) => e13.phx_ref), n11 = r11.metas.map((e13) => e13.phx_ref), o2 = t11.metas.filter((e13) => 0 > n11.indexOf(e13.phx_ref)), l2 = r11.metas.filter((e13) => 0 > s11.indexOf(e13.phx_ref));
              o2.length > 0 && (i2[e12] = t11, i2[e12].metas = o2), l2.length > 0 && (a2[e12] = this.clone(r11), a2[e12].metas = l2);
            } else i2[e12] = t11;
          }), this.syncDiff(n10, { joins: i2, leaves: a2 }, r10, s10);
        }
        static syncDiff(e11, t10, r10, s10) {
          let { joins: n10, leaves: i2 } = this.clone(t10);
          return r10 || (r10 = function() {
          }), s10 || (s10 = function() {
          }), this.map(n10, (t11, s11) => {
            let n11 = e11[t11];
            if (e11[t11] = this.clone(s11), n11) {
              let r11 = e11[t11].metas.map((e12) => e12.phx_ref), s12 = n11.metas.filter((e12) => 0 > r11.indexOf(e12.phx_ref));
              e11[t11].metas.unshift(...s12);
            }
            r10(t11, n11, s11);
          }), this.map(i2, (t11, r11) => {
            let n11 = e11[t11];
            if (!n11) return;
            let i3 = r11.metas.map((e12) => e12.phx_ref);
            n11.metas = n11.metas.filter((e12) => 0 > i3.indexOf(e12.phx_ref)), s10(t11, n11, r11), 0 === n11.metas.length && delete e11[t11];
          }), e11;
        }
        static list(e11, t10) {
          return t10 || (t10 = function(e12, t11) {
            return t11;
          }), this.map(e11, (e12, r10) => t10(e12, r10));
        }
        static map(e11, t10) {
          return Object.getOwnPropertyNames(e11).map((r10) => t10(r10, e11[r10]));
        }
        static clone(e11) {
          return JSON.parse(JSON.stringify(e11));
        }
      }, ry = { HEADER_LENGTH: 1, META_LENGTH: 4, KINDS: { push: 0, reply: 1, broadcast: 2 }, encode(e10, t10) {
        return e10.payload.constructor === ArrayBuffer ? t10(this.binaryEncode(e10)) : t10(JSON.stringify([e10.join_ref, e10.ref, e10.topic, e10.event, e10.payload]));
      }, decode(e10, t10) {
        if (e10.constructor === ArrayBuffer) return t10(this.binaryDecode(e10));
        {
          let [r10, s10, n10, i2, a2] = JSON.parse(e10);
          return t10({ join_ref: r10, ref: s10, topic: n10, event: i2, payload: a2 });
        }
      }, binaryEncode(e10) {
        let { join_ref: t10, ref: r10, event: s10, topic: n10, payload: i2 } = e10, a2 = this.META_LENGTH + t10.length + r10.length + n10.length + s10.length, o2 = new ArrayBuffer(this.HEADER_LENGTH + a2), l2 = new DataView(o2), u2 = 0;
        l2.setUint8(u2++, this.KINDS.push), l2.setUint8(u2++, t10.length), l2.setUint8(u2++, r10.length), l2.setUint8(u2++, n10.length), l2.setUint8(u2++, s10.length), Array.from(t10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0))), Array.from(r10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0))), Array.from(n10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0))), Array.from(s10, (e11) => l2.setUint8(u2++, e11.charCodeAt(0)));
        var c2 = new Uint8Array(o2.byteLength + i2.byteLength);
        return c2.set(new Uint8Array(o2), 0), c2.set(new Uint8Array(i2), o2.byteLength), c2.buffer;
      }, binaryDecode(e10) {
        let t10 = new DataView(e10), r10 = t10.getUint8(0), s10 = new TextDecoder();
        switch (r10) {
          case this.KINDS.push:
            return this.decodePush(e10, t10, s10);
          case this.KINDS.reply:
            return this.decodeReply(e10, t10, s10);
          case this.KINDS.broadcast:
            return this.decodeBroadcast(e10, t10, s10);
        }
      }, decodePush(e10, t10, r10) {
        let s10 = t10.getUint8(1), n10 = t10.getUint8(2), i2 = t10.getUint8(3), a2 = this.HEADER_LENGTH + this.META_LENGTH - 1, o2 = r10.decode(e10.slice(a2, a2 + s10));
        a2 += s10;
        let l2 = r10.decode(e10.slice(a2, a2 + n10));
        a2 += n10;
        let u2 = r10.decode(e10.slice(a2, a2 + i2));
        return a2 += i2, { join_ref: o2, ref: null, topic: l2, event: u2, payload: e10.slice(a2, e10.byteLength) };
      }, decodeReply(e10, t10, r10) {
        let s10 = t10.getUint8(1), n10 = t10.getUint8(2), i2 = t10.getUint8(3), a2 = t10.getUint8(4), o2 = this.HEADER_LENGTH + this.META_LENGTH, l2 = r10.decode(e10.slice(o2, o2 + s10));
        o2 += s10;
        let u2 = r10.decode(e10.slice(o2, o2 + n10));
        o2 += n10;
        let c2 = r10.decode(e10.slice(o2, o2 + i2));
        o2 += i2;
        let h2 = r10.decode(e10.slice(o2, o2 + a2));
        o2 += a2;
        let d2 = e10.slice(o2, e10.byteLength);
        return { join_ref: l2, ref: u2, topic: c2, event: ro.reply, payload: { status: h2, response: d2 } };
      }, decodeBroadcast(e10, t10, r10) {
        let s10 = t10.getUint8(1), n10 = t10.getUint8(2), i2 = this.HEADER_LENGTH + 2, a2 = r10.decode(e10.slice(i2, i2 + s10));
        i2 += s10;
        let o2 = r10.decode(e10.slice(i2, i2 + n10));
        return i2 += n10, { join_ref: null, ref: null, topic: a2, event: o2, payload: e10.slice(i2, e10.byteLength) };
      } }, rw = class {
        constructor(e10, t10 = {}) {
          this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] }, this.channels = [], this.sendBuffer = [], this.ref = 0, this.fallbackRef = null, this.timeout = t10.timeout || 1e4, this.transport = t10.transport || rn.WebSocket || rm, this.conn = void 0, this.primaryPassedHealthCheck = false, this.longPollFallbackMs = t10.longPollFallbackMs, this.fallbackTimer = null, this.sessionStore = t10.sessionStorage || rn && rn.sessionStorage, this.establishedConnections = 0, this.defaultEncoder = ry.encode.bind(ry), this.defaultDecoder = ry.decode.bind(ry), this.closeWasClean = true, this.disconnecting = false, this.binaryType = t10.binaryType || "arraybuffer", this.connectClock = 1, this.pageHidden = false, this.encode = void 0, this.decode = void 0, this.transport !== rm ? (this.encode = t10.encode || this.defaultEncoder, this.decode = t10.decode || this.defaultDecoder) : (this.encode = this.defaultEncoder, this.decode = this.defaultDecoder);
          let r10 = null;
          rs && rs.addEventListener && (rs.addEventListener("pagehide", (e11) => {
            this.conn && (this.disconnect(), r10 = this.connectClock);
          }), rs.addEventListener("pageshow", (e11) => {
            r10 === this.connectClock && (r10 = null, this.connect());
          }), rs.addEventListener("visibilitychange", () => {
            "hidden" === document.visibilityState ? this.pageHidden = true : (this.pageHidden = false, this.isConnected() || this.closeWasClean || this.teardown(() => this.connect()));
          })), this.heartbeatIntervalMs = t10.heartbeatIntervalMs || 3e4, this.autoSendHeartbeat = t10.autoSendHeartbeat ?? true, this.heartbeatCallback = t10.heartbeatCallback ?? (() => {
          }), this.rejoinAfterMs = (e11) => t10.rejoinAfterMs ? t10.rejoinAfterMs(e11) : [1e3, 2e3, 5e3][e11 - 1] || 1e4, this.reconnectAfterMs = (e11) => t10.reconnectAfterMs ? t10.reconnectAfterMs(e11) : [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][e11 - 1] || 5e3, this.logger = t10.logger || null, !this.logger && t10.debug && (this.logger = (e11, t11, r11) => {
            console.log(`${e11}: ${t11}`, r11);
          }), this.longpollerTimeout = t10.longpollerTimeout || 2e4, this.params = rr(t10.params || {}), this.endPoint = `${e10}/${rl.websocket}`, this.vsn = t10.vsn || "2.0.0", this.heartbeatTimeoutTimer = null, this.heartbeatTimer = null, this.heartbeatSentAt = null, this.pendingHeartbeatRef = null, this.reconnectTimer = new rd(() => {
            if (this.pageHidden) {
              this.log("Not reconnecting as page is hidden!"), this.teardown();
              return;
            }
            this.teardown(async () => {
              t10.beforeReconnect && await t10.beforeReconnect(), this.connect();
            });
          }, this.reconnectAfterMs), this.authToken = t10.authToken;
        }
        getLongPollTransport() {
          return rm;
        }
        replaceTransport(e10) {
          this.connectClock++, this.closeWasClean = true, clearTimeout(this.fallbackTimer), this.reconnectTimer.reset(), this.conn && (this.conn.close(), this.conn = null), this.transport = e10;
        }
        protocol() {
          return location.protocol.match(/^https/) ? "wss" : "ws";
        }
        endPointURL() {
          let e10 = rf.appendParams(rf.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
          return "/" !== e10.charAt(0) ? e10 : "/" === e10.charAt(1) ? `${this.protocol()}:${e10}` : `${this.protocol()}://${location.host}${e10}`;
        }
        disconnect(e10, t10, r10) {
          this.connectClock++, this.disconnecting = true, this.closeWasClean = true, clearTimeout(this.fallbackTimer), this.reconnectTimer.reset(), this.teardown(() => {
            this.disconnecting = false, e10 && e10();
          }, t10, r10);
        }
        connect(e10) {
          e10 && (console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"), this.params = rr(e10)), (!this.conn || this.disconnecting) && (this.longPollFallbackMs && this.transport !== rm ? this.connectWithFallback(rm, this.longPollFallbackMs) : this.transportConnect());
        }
        log(e10, t10, r10) {
          this.logger && this.logger(e10, t10, r10);
        }
        hasLogger() {
          return null !== this.logger;
        }
        onOpen(e10) {
          let t10 = this.makeRef();
          return this.stateChangeCallbacks.open.push([t10, e10]), t10;
        }
        onClose(e10) {
          let t10 = this.makeRef();
          return this.stateChangeCallbacks.close.push([t10, e10]), t10;
        }
        onError(e10) {
          let t10 = this.makeRef();
          return this.stateChangeCallbacks.error.push([t10, e10]), t10;
        }
        onMessage(e10) {
          let t10 = this.makeRef();
          return this.stateChangeCallbacks.message.push([t10, e10]), t10;
        }
        onHeartbeat(e10) {
          this.heartbeatCallback = e10;
        }
        ping(e10) {
          if (!this.isConnected()) return false;
          let t10 = this.makeRef(), r10 = Date.now();
          this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: t10 });
          let s10 = this.onMessage((n10) => {
            n10.ref === t10 && (this.off([s10]), e10(Date.now() - r10));
          });
          return true;
        }
        transportName(e10) {
          return e10 === rm ? "LongPoll" : e10.name;
        }
        transportConnect() {
          let e10;
          this.connectClock++, this.closeWasClean = false, this.authToken && (e10 = ["phoenix", `${rc}${btoa(this.authToken).replace(/=/g, "")}`]), this.conn = new this.transport(this.endPointURL(), e10), this.conn.binaryType = this.binaryType, this.conn.timeout = this.longpollerTimeout, this.conn.onopen = () => this.onConnOpen(), this.conn.onerror = (e11) => this.onConnError(e11), this.conn.onmessage = (e11) => this.onConnMessage(e11), this.conn.onclose = (e11) => this.onConnClose(e11);
        }
        getSession(e10) {
          return this.sessionStore && this.sessionStore.getItem(e10);
        }
        storeSession(e10, t10) {
          this.sessionStore && this.sessionStore.setItem(e10, t10);
        }
        connectWithFallback(e10, t10 = 2500) {
          let r10, s10;
          clearTimeout(this.fallbackTimer);
          let n10 = false, i2 = true, a2 = this.transportName(e10), o2 = (t11) => {
            this.log("transport", `falling back to ${a2}...`, t11), this.off([r10, s10]), i2 = false, this.replaceTransport(e10), this.transportConnect();
          };
          if (this.getSession(`phx:fallback:${a2}`)) return o2("memorized");
          this.fallbackTimer = setTimeout(o2, t10), s10 = this.onError((e11) => {
            this.log("transport", "error", e11), i2 && !n10 && (clearTimeout(this.fallbackTimer), o2(e11));
          }), this.fallbackRef && this.off([this.fallbackRef]), this.fallbackRef = this.onOpen(() => {
            if (n10 = true, !i2) {
              let t11 = this.transportName(e10);
              return this.primaryPassedHealthCheck || this.storeSession(`phx:fallback:${t11}`, "true"), this.log("transport", `established ${t11} fallback`);
            }
            clearTimeout(this.fallbackTimer), this.fallbackTimer = setTimeout(o2, t10), this.ping((e11) => {
              this.log("transport", "connected to primary after", e11), this.primaryPassedHealthCheck = true, clearTimeout(this.fallbackTimer);
            });
          }), this.transportConnect();
        }
        clearHeartbeats() {
          clearTimeout(this.heartbeatTimer), clearTimeout(this.heartbeatTimeoutTimer);
        }
        onConnOpen() {
          this.hasLogger() && this.log("transport", `connected to ${this.endPointURL()}`), this.closeWasClean = false, this.disconnecting = false, this.establishedConnections++, this.flushSendBuffer(), this.reconnectTimer.reset(), this.autoSendHeartbeat && this.resetHeartbeat(), this.triggerStateCallbacks("open");
        }
        heartbeatTimeout() {
          if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null, this.heartbeatSentAt = null, this.hasLogger() && this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
            try {
              this.heartbeatCallback("timeout");
            } catch (e10) {
              this.log("error", "error in heartbeat callback", e10);
            }
            this.triggerChanError(Error("heartbeat timeout")), this.closeWasClean = false, this.teardown(() => this.reconnectTimer.scheduleTimeout(), 1e3, "heartbeat timeout");
          }
        }
        resetHeartbeat() {
          this.conn && this.conn.skipHeartbeat || (this.pendingHeartbeatRef = null, this.clearHeartbeats(), this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs));
        }
        teardown(e10, t10, r10) {
          if (!this.conn) return e10 && e10();
          let s10 = this.conn;
          this.waitForBufferDone(s10, () => {
            t10 ? s10.close(t10, r10 || "") : s10.close(), this.waitForSocketClosed(s10, () => {
              this.conn === s10 && (this.conn.onopen = function() {
              }, this.conn.onerror = function() {
              }, this.conn.onmessage = function() {
              }, this.conn.onclose = function() {
              }, this.conn = null), e10 && e10();
            });
          });
        }
        waitForBufferDone(e10, t10, r10 = 1) {
          if (5 === r10 || !e10.bufferedAmount) return void t10();
          setTimeout(() => {
            this.waitForBufferDone(e10, t10, r10 + 1);
          }, 150 * r10);
        }
        waitForSocketClosed(e10, t10, r10 = 1) {
          if (5 === r10 || e10.readyState === ri.closed) return void t10();
          setTimeout(() => {
            this.waitForSocketClosed(e10, t10, r10 + 1);
          }, 150 * r10);
        }
        onConnClose(e10) {
          this.conn && (this.conn.onclose = () => {
          }), this.hasLogger() && this.log("transport", "close", e10), this.triggerChanError(e10), this.clearHeartbeats(), this.closeWasClean || this.reconnectTimer.scheduleTimeout(), this.triggerStateCallbacks("close", e10);
        }
        onConnError(e10) {
          this.hasLogger() && this.log("transport", "error", e10);
          let t10 = this.transport, r10 = this.establishedConnections;
          this.triggerStateCallbacks("error", e10, t10, r10), (t10 === this.transport || r10 > 0) && this.triggerChanError(e10);
        }
        triggerChanError(e10) {
          this.channels.forEach((t10) => {
            t10.isErrored() || t10.isLeaving() || t10.isClosed() || t10.trigger(ro.error, e10);
          });
        }
        connectionState() {
          switch (this.conn && this.conn.readyState) {
            case ri.connecting:
              return "connecting";
            case ri.open:
              return "open";
            case ri.closing:
              return "closing";
            default:
              return "closed";
          }
        }
        isConnected() {
          return "open" === this.connectionState();
        }
        remove(e10) {
          this.off(e10.stateChangeRefs), this.channels = this.channels.filter((t10) => t10 !== e10);
        }
        off(e10) {
          for (let t10 in this.stateChangeCallbacks) this.stateChangeCallbacks[t10] = this.stateChangeCallbacks[t10].filter(([t11]) => -1 === e10.indexOf(t11));
        }
        channel(e10, t10 = {}) {
          let r10 = new rp(e10, t10, this);
          return this.channels.push(r10), r10;
        }
        push(e10) {
          if (this.hasLogger()) {
            let { topic: t10, event: r10, payload: s10, ref: n10, join_ref: i2 } = e10;
            this.log("push", `${t10} ${r10} (${i2}, ${n10})`, s10);
          }
          this.isConnected() ? this.encode(e10, (e11) => this.conn.send(e11)) : this.sendBuffer.push(() => this.encode(e10, (e11) => this.conn.send(e11)));
        }
        makeRef() {
          let e10 = this.ref + 1;
          return e10 === this.ref ? this.ref = 0 : this.ref = e10, this.ref.toString();
        }
        sendHeartbeat() {
          if (!this.isConnected()) {
            try {
              this.heartbeatCallback("disconnected");
            } catch (e10) {
              this.log("error", "error in heartbeat callback", e10);
            }
            return;
          }
          if (this.pendingHeartbeatRef) return void this.heartbeatTimeout();
          this.pendingHeartbeatRef = this.makeRef(), this.heartbeatSentAt = Date.now(), this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
          try {
            this.heartbeatCallback("sent");
          } catch (e10) {
            this.log("error", "error in heartbeat callback", e10);
          }
          this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
        }
        flushSendBuffer() {
          this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((e10) => e10()), this.sendBuffer = []);
        }
        onConnMessage(e10) {
          this.decode(e10.data, (e11) => {
            let { topic: t10, event: r10, payload: s10, ref: n10, join_ref: i2 } = e11;
            if (n10 && n10 === this.pendingHeartbeatRef) {
              let e12 = this.heartbeatSentAt ? Date.now() - this.heartbeatSentAt : void 0;
              this.clearHeartbeats();
              try {
                this.heartbeatCallback("ok" === s10.status ? "ok" : "error", e12);
              } catch (e13) {
                this.log("error", "error in heartbeat callback", e13);
              }
              this.pendingHeartbeatRef = null, this.heartbeatSentAt = null, this.autoSendHeartbeat && (this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs));
            }
            this.hasLogger() && this.log("receive", `${s10.status || ""} ${t10} ${r10} ${n10 && "(" + n10 + ")" || ""}`.trim(), s10);
            for (let e12 = 0; e12 < this.channels.length; e12++) {
              let a2 = this.channels[e12];
              a2.isMember(t10, r10, s10, i2) && a2.trigger(r10, s10, n10, i2);
            }
            this.triggerStateCallbacks("message", e11);
          });
        }
        triggerStateCallbacks(e10, ...t10) {
          try {
            this.stateChangeCallbacks[e10].forEach(([r10, s10]) => {
              try {
                s10(...t10);
              } catch (t11) {
                this.log("error", `error in ${e10} callback`, t11);
              }
            });
          } catch (t11) {
            this.log("error", `error triggering ${e10} callbacks`, t11);
          }
        }
        leaveOpenTopic(e10) {
          let t10 = this.channels.find((t11) => t11.topic === e10 && (t11.isJoined() || t11.isJoining()));
          t10 && (this.hasLogger() && this.log("transport", `leaving duplicate topic "${e10}"`), t10.leave());
        }
      };
      class rv {
        constructor(e10, t10) {
          let r10 = function(e11) {
            return (null == e11 ? void 0 : e11.events) && { events: e11.events };
          }(t10);
          this.presence = new rb(e10.getChannel(), r10), this.presence.onJoin((t11, r11, s10) => {
            let n10 = rv.onJoinPayload(t11, r11, s10);
            e10.getChannel().trigger("presence", n10);
          }), this.presence.onLeave((t11, r11, s10) => {
            let n10 = rv.onLeavePayload(t11, r11, s10);
            e10.getChannel().trigger("presence", n10);
          }), this.presence.onSync(() => {
            e10.getChannel().trigger("presence", { event: "sync" });
          });
        }
        get state() {
          return rv.transformState(this.presence.state);
        }
        static transformState(e10) {
          return Object.getOwnPropertyNames(e10 = JSON.parse(JSON.stringify(e10))).reduce((t10, r10) => {
            let s10 = e10[r10];
            return t10[r10] = r_(s10), t10;
          }, {});
        }
        static onJoinPayload(e10, t10, r10) {
          return { event: "join", key: e10, currentPresences: rk(t10), newPresences: r_(r10) };
        }
        static onLeavePayload(e10, t10, r10) {
          return { event: "leave", key: e10, currentPresences: rk(t10), leftPresences: r_(r10) };
        }
      }
      function r_(e10) {
        return e10.metas.map((e11) => (e11.presence_ref = e11.phx_ref, delete e11.phx_ref, delete e11.phx_ref_prev, e11));
      }
      function rk(e10) {
        return (null == e10 ? void 0 : e10.metas) ? r_(e10) : [];
      }
      !function(e10) {
        e10.SYNC = "sync", e10.JOIN = "join", e10.LEAVE = "leave";
      }(o || (o = {}));
      class rS {
        get state() {
          return this.presenceAdapter.state;
        }
        constructor(e10, t10) {
          this.channel = e10, this.presenceAdapter = new rv(this.channel.channelAdapter, t10);
        }
      }
      class rE {
        constructor(e10, t10, r10) {
          let s10 = { config: Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "", enabled: false }, private: false }, r10.config) };
          this.channel = e10.getSocket().channel(t10, s10), this.socket = e10;
        }
        get state() {
          return this.channel.state;
        }
        set state(e10) {
          this.channel.state = e10;
        }
        get joinedOnce() {
          return this.channel.joinedOnce;
        }
        get joinPush() {
          return this.channel.joinPush;
        }
        get rejoinTimer() {
          return this.channel.rejoinTimer;
        }
        on(e10, t10) {
          return this.channel.on(e10, t10);
        }
        off(e10, t10) {
          this.channel.off(e10, t10);
        }
        subscribe(e10) {
          return this.channel.join(e10);
        }
        unsubscribe(e10) {
          return this.channel.leave(e10);
        }
        teardown() {
          this.channel.teardown();
        }
        onClose(e10) {
          this.channel.onClose(e10);
        }
        onError(e10) {
          return this.channel.onError(e10);
        }
        push(e10, t10, r10) {
          let s10;
          try {
            s10 = this.channel.push(e10, t10, r10);
          } catch (t11) {
            throw Error(`tried to push '${e10}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`);
          }
          if (this.channel.pushBuffer.length > 100) {
            let e11 = this.channel.pushBuffer.shift();
            e11.cancelTimeout(), this.socket.log("channel", `discarded push due to buffer overflow: ${e11.event}`, e11.payload());
          }
          return s10;
        }
        updateJoinPayload(e10) {
          let t10 = this.channel.joinPush.payload();
          this.channel.joinPush.payload = () => Object.assign(Object.assign({}, t10), e10);
        }
        canPush() {
          return this.socket.isConnected() && this.state === tQ.joined;
        }
        isJoined() {
          return this.state === tQ.joined;
        }
        isJoining() {
          return this.state === tQ.joining;
        }
        isClosed() {
          return this.state === tQ.closed;
        }
        isLeaving() {
          return this.state === tQ.leaving;
        }
        updateFilterBindings(e10) {
          this.channel.filterBindings = e10;
        }
        updatePayloadTransform(e10) {
          this.channel.onMessage = e10;
        }
        getChannel() {
          return this.channel;
        }
      }
      !function(e10) {
        e10.ALL = "*", e10.INSERT = "INSERT", e10.UPDATE = "UPDATE", e10.DELETE = "DELETE";
      }(l || (l = {})), function(e10) {
        e10.BROADCAST = "broadcast", e10.PRESENCE = "presence", e10.POSTGRES_CHANGES = "postgres_changes", e10.SYSTEM = "system";
      }(u || (u = {})), function(e10) {
        e10.SUBSCRIBED = "SUBSCRIBED", e10.TIMED_OUT = "TIMED_OUT", e10.CLOSED = "CLOSED", e10.CHANNEL_ERROR = "CHANNEL_ERROR";
      }(c || (c = {}));
      class rT {
        get state() {
          return this.channelAdapter.state;
        }
        set state(e10) {
          this.channelAdapter.state = e10;
        }
        get joinedOnce() {
          return this.channelAdapter.joinedOnce;
        }
        get timeout() {
          return this.socket.timeout;
        }
        get joinPush() {
          return this.channelAdapter.joinPush;
        }
        get rejoinTimer() {
          return this.channelAdapter.rejoinTimer;
        }
        constructor(e10, t10 = { config: {} }, r10) {
          var s10, n10;
          if (this.topic = e10, this.params = t10, this.socket = r10, this.bindings = {}, this.subTopic = e10.replace(/^realtime:/i, ""), this.params.config = Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "", enabled: false }, private: false }, t10.config), this.channelAdapter = new rE(this.socket.socketAdapter, e10, this.params), this.presence = new rS(this), this._onClose(() => {
            this.socket._remove(this);
          }), this._updateFilterTransform(), this.broadcastEndpointURL = rt(this.socket.socketAdapter.endPointURL()), this.private = this.params.config.private || false, !this.private && (null == (n10 = null == (s10 = this.params.config) ? void 0 : s10.broadcast) ? void 0 : n10.replay)) throw Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`);
        }
        subscribe(e10, t10 = this.timeout) {
          var r10, s10, n10;
          if (this.socket.isConnected() || this.socket.connect(), this.channelAdapter.isClosed()) {
            let { config: { broadcast: i2, presence: a2, private: o2 } } = this.params, l2 = null != (s10 = null == (r10 = this.bindings.postgres_changes) ? void 0 : r10.map((e11) => e11.filter)) ? s10 : [], h2 = !!this.bindings[u.PRESENCE] && this.bindings[u.PRESENCE].length > 0 || (null == (n10 = this.params.config.presence) ? void 0 : n10.enabled) === true, d2 = {}, p2 = { broadcast: i2, presence: Object.assign(Object.assign({}, a2), { enabled: h2 }), postgres_changes: l2, private: o2 };
            this.socket.accessTokenValue && (d2.access_token = this.socket.accessTokenValue), this._onError((t11) => {
              null == e10 || e10(c.CHANNEL_ERROR, function(e11) {
                if (e11 instanceof Error) return e11;
                if ("string" == typeof e11) return Error(e11);
                if (e11 && "object" == typeof e11) {
                  if ("number" == typeof e11.code) {
                    let t12 = "string" == typeof e11.reason && e11.reason ? ` (${e11.reason})` : "";
                    return Error(`socket closed: ${e11.code}${t12}`, { cause: e11 });
                  }
                  return Error("channel error: transport failure", { cause: e11 });
                }
                return Error("channel error: connection lost");
              }(t11));
            }), this._onClose(() => null == e10 ? void 0 : e10(c.CLOSED)), this.updateJoinPayload(Object.assign({ config: p2 }, d2)), this._updateFilterMessage(), this.channelAdapter.subscribe(t10).receive("ok", async ({ postgres_changes: t11 }) => {
              if (this.socket._isManualToken() || this.socket.setAuth(), void 0 === t11) {
                null == e10 || e10(c.SUBSCRIBED);
                return;
              }
              this._updatePostgresBindings(t11, e10);
            }).receive("error", (t11) => {
              this.state = tQ.errored;
              let r11 = Object.values(t11).join(", ") || "error";
              null == e10 || e10(c.CHANNEL_ERROR, Error(r11, { cause: t11 }));
            }).receive("timeout", () => {
              null == e10 || e10(c.TIMED_OUT);
            });
          }
          return this;
        }
        _updatePostgresBindings(e10, t10) {
          var r10;
          let s10 = this.bindings.postgres_changes, n10 = null != (r10 = null == s10 ? void 0 : s10.length) ? r10 : 0, i2 = [];
          for (let r11 = 0; r11 < n10; r11++) {
            let n11 = s10[r11], { filter: { event: a2, schema: o2, table: l2, filter: u2 } } = n11, h2 = e10 && e10[r11];
            if (h2 && h2.event === a2 && rT.isFilterValueEqual(h2.schema, o2) && rT.isFilterValueEqual(h2.table, l2) && rT.isFilterValueEqual(h2.filter, u2)) i2.push(Object.assign(Object.assign({}, n11), { id: h2.id }));
            else {
              this.unsubscribe(), this.state = tQ.errored, null == t10 || t10(c.CHANNEL_ERROR, Error("mismatch between server and client bindings for postgres changes"));
              return;
            }
          }
          this.bindings.postgres_changes = i2, this.state != tQ.errored && t10 && t10(c.SUBSCRIBED);
        }
        presenceState() {
          return this.presence.state;
        }
        async track(e10, t10 = {}) {
          return await this.send({ type: "presence", event: "track", payload: e10 }, t10.timeout || this.timeout);
        }
        async untrack(e10 = {}) {
          return await this.send({ type: "presence", event: "untrack" }, e10);
        }
        on(e10, t10, r10) {
          let s10 = this.channelAdapter.isJoined() || this.channelAdapter.isJoining(), n10 = e10 === u.PRESENCE || e10 === u.POSTGRES_CHANGES;
          if (s10 && n10) throw this.socket.log("channel", `cannot add \`${e10}\` callbacks for ${this.topic} after \`subscribe()\`.`), Error(`cannot add \`${e10}\` callbacks for ${this.topic} after \`subscribe()\`.`);
          return this._on(e10, t10, r10);
        }
        async httpSend(e10, t10, r10 = {}) {
          var s10;
          if (null == t10) return Promise.reject(Error("Payload is required for httpSend()"));
          let n10 = { apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" };
          this.socket.accessTokenValue && (n10.Authorization = `Bearer ${this.socket.accessTokenValue}`);
          let i2 = { method: "POST", headers: n10, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: e10, payload: t10, private: this.private }] }) }, a2 = await this._fetchWithTimeout(this.broadcastEndpointURL, i2, null != (s10 = r10.timeout) ? s10 : this.timeout);
          if (202 === a2.status) return { success: true };
          let o2 = a2.statusText;
          try {
            let e11 = await a2.json();
            o2 = e11.error || e11.message || o2;
          } catch (e11) {
          }
          return Promise.reject(Error(o2));
        }
        async send(e10, t10 = {}) {
          var r10, s10;
          if (this.channelAdapter.canPush() || "broadcast" !== e10.type) return new Promise((r11) => {
            var s11, n10, i2;
            let a2 = this.channelAdapter.push(e10.type, e10, t10.timeout || this.timeout);
            "broadcast" !== e10.type || (null == (i2 = null == (n10 = null == (s11 = this.params) ? void 0 : s11.config) ? void 0 : n10.broadcast) ? void 0 : i2.ack) || r11("ok"), a2.receive("ok", () => r11("ok")), a2.receive("error", () => r11("error")), a2.receive("timeout", () => r11("timed out"));
          });
          {
            console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");
            let { event: n10, payload: i2 } = e10, a2 = { apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" };
            this.socket.accessTokenValue && (a2.Authorization = `Bearer ${this.socket.accessTokenValue}`);
            let o2 = { method: "POST", headers: a2, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: n10, payload: i2, private: this.private }] }) };
            try {
              let e11 = await this._fetchWithTimeout(this.broadcastEndpointURL, o2, null != (r10 = t10.timeout) ? r10 : this.timeout);
              return await (null == (s10 = e11.body) ? void 0 : s10.cancel()), e11.ok ? "ok" : "error";
            } catch (e11) {
              if ("AbortError" === e11.name) return "timed out";
              return "error";
            }
          }
        }
        updateJoinPayload(e10) {
          this.channelAdapter.updateJoinPayload(e10);
        }
        async unsubscribe(e10 = this.timeout) {
          return new Promise((t10) => {
            this.channelAdapter.unsubscribe(e10).receive("ok", () => t10("ok")).receive("timeout", () => t10("timed out")).receive("error", () => t10("error"));
          });
        }
        teardown() {
          this.channelAdapter.teardown();
        }
        async _fetchWithTimeout(e10, t10, r10) {
          let s10 = new AbortController(), n10 = setTimeout(() => s10.abort(), r10), i2 = await this.socket.fetch(e10, Object.assign(Object.assign({}, t10), { signal: s10.signal }));
          return clearTimeout(n10), i2;
        }
        _on(e10, t10, r10) {
          let s10 = e10.toLocaleLowerCase(), n10 = this.channelAdapter.on(e10, r10), i2 = { type: s10, filter: t10, callback: r10, ref: n10 };
          return this.bindings[s10] ? this.bindings[s10].push(i2) : this.bindings[s10] = [i2], this._updateFilterMessage(), this;
        }
        _onClose(e10) {
          this.channelAdapter.onClose(e10);
        }
        _onError(e10) {
          this.channelAdapter.onError(e10);
        }
        _updateFilterMessage() {
          this.channelAdapter.updateFilterBindings((e10, t10, r10) => {
            var s10, n10, i2, a2, o2, l2, u2;
            let c2 = e10.event.toLocaleLowerCase();
            if (this._notThisChannelEvent(c2, r10)) return false;
            let h2 = null == (s10 = this.bindings[c2]) ? void 0 : s10.find((t11) => t11.ref === e10.ref);
            if (!h2) return true;
            if (!["broadcast", "presence", "postgres_changes"].includes(c2)) return h2.type.toLocaleLowerCase() === c2;
            if ("id" in h2) {
              let e11 = h2.id, r11 = null == (n10 = h2.filter) ? void 0 : n10.event;
              return e11 && (null == (i2 = t10.ids) ? void 0 : i2.includes(e11)) && ("*" === r11 || (null == r11 ? void 0 : r11.toLocaleLowerCase()) === (null == (a2 = t10.data) ? void 0 : a2.type.toLocaleLowerCase()));
            }
            {
              let e11 = null == (l2 = null == (o2 = null == h2 ? void 0 : h2.filter) ? void 0 : o2.event) ? void 0 : l2.toLocaleLowerCase();
              return "*" === e11 || e11 === (null == (u2 = null == t10 ? void 0 : t10.event) ? void 0 : u2.toLocaleLowerCase());
            }
          });
        }
        _notThisChannelEvent(e10, t10) {
          let { close: r10, error: s10, leave: n10, join: i2 } = tZ;
          return t10 && [r10, s10, n10, i2].includes(e10) && t10 !== this.joinPush.ref;
        }
        _updateFilterTransform() {
          this.channelAdapter.updatePayloadTransform((e10, t10, r10) => {
            if ("object" == typeof t10 && "ids" in t10) {
              let e11 = t10.data, { schema: r11, table: s10, commit_timestamp: n10, type: i2, errors: a2 } = e11;
              return Object.assign(Object.assign({}, { schema: r11, table: s10, commit_timestamp: n10, eventType: i2, new: {}, old: {}, errors: a2 }), this._getPayloadRecords(e11));
            }
            return t10;
          });
        }
        copyBindings(e10) {
          if (this.joinedOnce) throw Error("cannot copy bindings into joined channel");
          for (let t10 in e10.bindings) for (let r10 of e10.bindings[t10]) this._on(r10.type, r10.filter, r10.callback);
        }
        static isFilterValueEqual(e10, t10) {
          return (null != e10 ? e10 : void 0) === (null != t10 ? t10 : void 0);
        }
        _getPayloadRecords(e10) {
          let t10 = { new: {}, old: {} };
          return ("INSERT" === e10.type || "UPDATE" === e10.type) && (t10.new = t2(e10.columns, e10.record)), ("UPDATE" === e10.type || "DELETE" === e10.type) && (t10.old = t2(e10.columns, e10.old_record)), t10;
        }
      }
      class rR {
        constructor(e10, t10) {
          this.socket = new rw(e10, t10);
        }
        get timeout() {
          return this.socket.timeout;
        }
        get endPoint() {
          return this.socket.endPoint;
        }
        get transport() {
          return this.socket.transport;
        }
        get heartbeatIntervalMs() {
          return this.socket.heartbeatIntervalMs;
        }
        get heartbeatCallback() {
          return this.socket.heartbeatCallback;
        }
        set heartbeatCallback(e10) {
          this.socket.heartbeatCallback = e10;
        }
        get heartbeatTimer() {
          return this.socket.heartbeatTimer;
        }
        get pendingHeartbeatRef() {
          return this.socket.pendingHeartbeatRef;
        }
        get reconnectTimer() {
          return this.socket.reconnectTimer;
        }
        get vsn() {
          return this.socket.vsn;
        }
        get encode() {
          return this.socket.encode;
        }
        get decode() {
          return this.socket.decode;
        }
        get reconnectAfterMs() {
          return this.socket.reconnectAfterMs;
        }
        get sendBuffer() {
          return this.socket.sendBuffer;
        }
        get stateChangeCallbacks() {
          return this.socket.stateChangeCallbacks;
        }
        connect() {
          this.socket.connect();
        }
        disconnect(e10, t10, r10, s10 = 1e4) {
          return new Promise((n10) => {
            setTimeout(() => n10("timeout"), s10), this.socket.disconnect(() => {
              e10(), n10("ok");
            }, t10, r10);
          });
        }
        push(e10) {
          this.socket.push(e10);
        }
        log(e10, t10, r10) {
          this.socket.log(e10, t10, r10);
        }
        makeRef() {
          return this.socket.makeRef();
        }
        onOpen(e10) {
          this.socket.onOpen(e10);
        }
        onClose(e10) {
          this.socket.onClose(e10);
        }
        onError(e10) {
          this.socket.onError(e10);
        }
        onMessage(e10) {
          this.socket.onMessage(e10);
        }
        isConnected() {
          return this.socket.isConnected();
        }
        isConnecting() {
          return this.socket.connectionState() == t0.connecting;
        }
        isDisconnecting() {
          return this.socket.connectionState() == t0.closing;
        }
        connectionState() {
          return this.socket.connectionState();
        }
        endPointURL() {
          return this.socket.endPointURL();
        }
        sendHeartbeat() {
          this.socket.sendHeartbeat();
        }
        getSocket() {
          return this.socket;
        }
      }
      let rO = { HEARTBEAT_INTERVAL: 25e3 }, rC = [1e3, 2e3, 5e3, 1e4], rP = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
      class rx {
        get endPoint() {
          return this.socketAdapter.endPoint;
        }
        get timeout() {
          return this.socketAdapter.timeout;
        }
        get transport() {
          return this.socketAdapter.transport;
        }
        get heartbeatCallback() {
          return this.socketAdapter.heartbeatCallback;
        }
        get heartbeatIntervalMs() {
          return this.socketAdapter.heartbeatIntervalMs;
        }
        get heartbeatTimer() {
          return this.worker ? this._workerHeartbeatTimer : this.socketAdapter.heartbeatTimer;
        }
        get pendingHeartbeatRef() {
          return this.worker ? this._pendingWorkerHeartbeatRef : this.socketAdapter.pendingHeartbeatRef;
        }
        get reconnectTimer() {
          return this.socketAdapter.reconnectTimer;
        }
        get vsn() {
          return this.socketAdapter.vsn;
        }
        get encode() {
          return this.socketAdapter.encode;
        }
        get decode() {
          return this.socketAdapter.decode;
        }
        get reconnectAfterMs() {
          return this.socketAdapter.reconnectAfterMs;
        }
        get sendBuffer() {
          return this.socketAdapter.sendBuffer;
        }
        get stateChangeCallbacks() {
          return this.socketAdapter.stateChangeCallbacks;
        }
        constructor(e10, t10) {
          var r10;
          if (this.channels = [], this.accessTokenValue = null, this.accessToken = null, this.apiKey = null, this.httpEndpoint = "", this.headers = {}, this.params = {}, this.ref = 0, this.serializer = new t1(), this._manuallySetToken = false, this._authPromise = null, this._workerHeartbeatTimer = void 0, this._pendingWorkerHeartbeatRef = null, this._pendingDisconnectTimer = null, this._disconnectOnEmptyChannelsAfterMs = 0, this._resolveFetch = (e11) => e11 ? (...t11) => e11(...t11) : (...e12) => fetch(...e12), !(null == (r10 = null == t10 ? void 0 : t10.params) ? void 0 : r10.apikey)) throw Error("API key is required to connect to Realtime");
          this.apiKey = t10.params.apikey;
          let s10 = this._initializeOptions(t10);
          this.socketAdapter = new rR(e10, s10), this.httpEndpoint = rt(e10), this.fetch = this._resolveFetch(null == t10 ? void 0 : t10.fetch);
        }
        connect() {
          if (!(this.isConnecting() || this.isDisconnecting() || this.isConnected())) {
            this.accessToken && !this._authPromise && this._setAuthSafely("connect"), this._setupConnectionHandlers();
            try {
              this.socketAdapter.connect();
            } catch (t10) {
              let e10 = t10.message;
              if (e10.includes("Node.js")) throw Error(`${e10}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`);
              throw Error(`WebSocket not available: ${e10}`);
            }
            this._handleNodeJsRaceCondition();
          }
        }
        endpointURL() {
          return this.socketAdapter.endPointURL();
        }
        async disconnect(e10, t10) {
          return (this._cancelPendingDisconnect(), this.isDisconnecting()) ? "ok" : await this.socketAdapter.disconnect(() => {
            clearInterval(this._workerHeartbeatTimer), this._terminateWorker();
          }, e10, t10);
        }
        getChannels() {
          return this.channels;
        }
        async removeChannel(e10) {
          let t10 = await e10.unsubscribe();
          return "ok" === t10 && e10.teardown(), t10;
        }
        async removeAllChannels() {
          let e10 = this.channels.map(async (e11) => {
            let t11 = await e11.unsubscribe();
            return e11.teardown(), t11;
          }), t10 = await Promise.all(e10);
          return await this.disconnect(), t10;
        }
        log(e10, t10, r10) {
          this.socketAdapter.log(e10, t10, r10);
        }
        connectionState() {
          return this.socketAdapter.connectionState() || t0.closed;
        }
        isConnected() {
          return this.socketAdapter.isConnected();
        }
        isConnecting() {
          return this.socketAdapter.isConnecting();
        }
        isDisconnecting() {
          return this.socketAdapter.isDisconnecting();
        }
        channel(e10, t10 = { config: {} }) {
          let r10 = `realtime:${e10}`, s10 = this.getChannels().find((e11) => e11.topic === r10);
          if (s10) return s10;
          {
            let r11 = new rT(`realtime:${e10}`, t10, this);
            return this._cancelPendingDisconnect(), this.channels.push(r11), r11;
          }
        }
        push(e10) {
          this.socketAdapter.push(e10);
        }
        async setAuth(e10 = null) {
          this._authPromise = this._performAuth(e10);
          try {
            await this._authPromise;
          } finally {
            this._authPromise = null;
          }
        }
        _isManualToken() {
          return this._manuallySetToken;
        }
        async sendHeartbeat() {
          this.socketAdapter.sendHeartbeat();
        }
        onHeartbeat(e10) {
          this.socketAdapter.heartbeatCallback = this._wrapHeartbeatCallback(e10);
        }
        _makeRef() {
          return this.socketAdapter.makeRef();
        }
        _remove(e10) {
          this.channels = this.channels.filter((t10) => t10.topic !== e10.topic), 0 === this.channels.length && (this.log("transport", "no channels remaining, scheduling disconnect"), this._schedulePendingDisconnect());
        }
        _schedulePendingDisconnect() {
          if (this._cancelPendingDisconnect(), 0 === this._disconnectOnEmptyChannelsAfterMs) {
            this.log("transport", "disconnecting immediately - no channels"), this.disconnect();
            return;
          }
          this._pendingDisconnectTimer = setTimeout(() => {
            this._pendingDisconnectTimer = null, 0 === this.channels.length && (this.log("transport", "deferred disconnect fired - no channels, disconnecting"), this.disconnect());
          }, this._disconnectOnEmptyChannelsAfterMs), this.log("transport", `deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`);
        }
        _cancelPendingDisconnect() {
          null !== this._pendingDisconnectTimer && (this.log("transport", "pending disconnect cancelled - channel activity detected"), clearTimeout(this._pendingDisconnectTimer), this._pendingDisconnectTimer = null);
        }
        async _performAuth(e10 = null) {
          let t10, r10 = false;
          if (e10) t10 = e10, r10 = true;
          else if (this.accessToken) try {
            t10 = await this.accessToken();
          } catch (e11) {
            this.log("error", "Error fetching access token from callback", e11), t10 = this.accessTokenValue;
          }
          else t10 = this.accessTokenValue;
          r10 ? this._manuallySetToken = true : this.accessToken && (this._manuallySetToken = false), this.accessTokenValue != t10 && (this.accessTokenValue = t10, this.channels.forEach((e11) => {
            let r11 = { access_token: t10, version: "realtime-js/2.105.1" };
            t10 && e11.updateJoinPayload(r11), e11.joinedOnce && e11.channelAdapter.isJoined() && e11.channelAdapter.push(tZ.access_token, { access_token: t10 });
          }));
        }
        async _waitForAuthIfNeeded() {
          this._authPromise && await this._authPromise;
        }
        _setAuthSafely(e10 = "general") {
          this._isManualToken() || this.setAuth().catch((t10) => {
            this.log("error", `Error setting auth in ${e10}`, t10);
          });
        }
        _setupConnectionHandlers() {
          this.socketAdapter.onOpen(() => {
            (this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve())).catch((e10) => {
              this.log("error", "error waiting for auth on connect", e10);
            }), this.worker && !this.workerRef && this._startWorkerHeartbeat();
          }), this.socketAdapter.onClose(() => {
            this.worker && this.workerRef && this._terminateWorker();
          }), this.socketAdapter.onMessage((e10) => {
            e10.ref && e10.ref === this._pendingWorkerHeartbeatRef && (this._pendingWorkerHeartbeatRef = null);
          });
        }
        _handleNodeJsRaceCondition() {
          this.socketAdapter.isConnected() && this.socketAdapter.getSocket().onConnOpen();
        }
        _wrapHeartbeatCallback(e10) {
          return (t10, r10) => {
            "sent" == t10 && this._setAuthSafely(), e10 && e10(t10, r10);
          };
        }
        _startWorkerHeartbeat() {
          this.workerUrl ? this.log("worker", `starting worker for from ${this.workerUrl}`) : this.log("worker", "starting default worker");
          let e10 = this._workerObjectUrl(this.workerUrl);
          this.workerRef = new Worker(e10), this.workerRef.onerror = (e11) => {
            this.log("worker", "worker error", e11.message), this._terminateWorker(), this.disconnect();
          }, this.workerRef.onmessage = (e11) => {
            "keepAlive" === e11.data.event && this.sendHeartbeat();
          }, this.workerRef.postMessage({ event: "start", interval: this.heartbeatIntervalMs });
        }
        _terminateWorker() {
          this.workerRef && (this.log("worker", "terminating worker"), this.workerRef.terminate(), this.workerRef = void 0);
        }
        _workerObjectUrl(e10) {
          let t10;
          if (e10) t10 = e10;
          else {
            let e11 = new Blob([rP], { type: "application/javascript" });
            t10 = URL.createObjectURL(e11);
          }
          return t10;
        }
        _initializeOptions(e10) {
          var t10, r10, s10, n10, i2, a2, o2, l2, u2, c2, h2;
          let d2, p2;
          this.worker = null != (t10 = null == e10 ? void 0 : e10.worker) && t10, this.accessToken = null != (r10 = null == e10 ? void 0 : e10.accessToken) ? r10 : null;
          let f2 = {};
          f2.timeout = null != (s10 = null == e10 ? void 0 : e10.timeout) ? s10 : 1e4, f2.heartbeatIntervalMs = null != (n10 = null == e10 ? void 0 : e10.heartbeatIntervalMs) ? n10 : rO.HEARTBEAT_INTERVAL, this._disconnectOnEmptyChannelsAfterMs = null != (i2 = null == e10 ? void 0 : e10.disconnectOnEmptyChannelsAfterMs) ? i2 : 2 * (null != (a2 = null == e10 ? void 0 : e10.heartbeatIntervalMs) ? a2 : rO.HEARTBEAT_INTERVAL), f2.transport = null != (o2 = null == e10 ? void 0 : e10.transport) ? o2 : tX.getWebSocketConstructor(), f2.params = null == e10 ? void 0 : e10.params, f2.logger = null == e10 ? void 0 : e10.logger, f2.heartbeatCallback = this._wrapHeartbeatCallback(null == e10 ? void 0 : e10.heartbeatCallback), f2.reconnectAfterMs = null != (l2 = null == e10 ? void 0 : e10.reconnectAfterMs) ? l2 : (e11) => rC[e11 - 1] || 1e4;
          let g2 = null != (u2 = null == e10 ? void 0 : e10.vsn) ? u2 : tY;
          switch (g2) {
            case "1.0.0":
              d2 = (e11, t11) => t11(JSON.stringify(e11)), p2 = (e11, t11) => t11(JSON.parse(e11));
              break;
            case tY:
              d2 = this.serializer.encode.bind(this.serializer), p2 = this.serializer.decode.bind(this.serializer);
              break;
            default:
              throw Error(`Unsupported serializer version: ${f2.vsn}`);
          }
          if (f2.vsn = g2, f2.encode = null != (c2 = null == e10 ? void 0 : e10.encode) ? c2 : d2, f2.decode = null != (h2 = null == e10 ? void 0 : e10.decode) ? h2 : p2, f2.beforeReconnect = this._reconnectAuth.bind(this), ((null == e10 ? void 0 : e10.logLevel) || (null == e10 ? void 0 : e10.log_level)) && (this.logLevel = e10.logLevel || e10.log_level, f2.params = Object.assign(Object.assign({}, f2.params), { log_level: this.logLevel })), this.worker) {
            if ("undefined" != typeof window && !window.Worker) throw Error("Web Worker is not supported");
            this.workerUrl = null == e10 ? void 0 : e10.workerUrl, f2.autoSendHeartbeat = !this.worker;
          }
          return f2;
        }
        async _reconnectAuth() {
          await this._waitForAuthIfNeeded(), this.isConnected() || this.connect();
        }
      }
      var rA = class extends Error {
        constructor(e10, t10) {
          super(e10), this.name = "IcebergError", this.status = t10.status, this.icebergType = t10.icebergType, this.icebergCode = t10.icebergCode, this.details = t10.details, this.isCommitStateUnknown = "CommitStateUnknownException" === t10.icebergType || [500, 502, 504].includes(t10.status) && t10.icebergType?.includes("CommitState") === true;
        }
        isNotFound() {
          return 404 === this.status;
        }
        isConflict() {
          return 409 === this.status;
        }
        isAuthenticationTimeout() {
          return 419 === this.status;
        }
      };
      async function rj(e10) {
        return e10 && "none" !== e10.type ? "bearer" === e10.type ? { Authorization: `Bearer ${e10.token}` } : "header" === e10.type ? { [e10.name]: e10.value } : "custom" === e10.type ? await e10.getHeaders() : {} : {};
      }
      function rI(e10) {
        return e10.join("");
      }
      var rN = class {
        constructor(e10, t10 = "") {
          this.client = e10, this.prefix = t10;
        }
        async listNamespaces(e10) {
          let t10 = e10 ? { parent: rI(e10.namespace) } : void 0;
          return (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces`, query: t10 })).data.namespaces.map((e11) => ({ namespace: e11 }));
        }
        async createNamespace(e10, t10) {
          let r10 = { namespace: e10.namespace, properties: t10?.properties };
          return (await this.client.request({ method: "POST", path: `${this.prefix}/namespaces`, body: r10 })).data;
        }
        async dropNamespace(e10) {
          await this.client.request({ method: "DELETE", path: `${this.prefix}/namespaces/${rI(e10.namespace)}` });
        }
        async loadNamespaceMetadata(e10) {
          return { properties: (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${rI(e10.namespace)}` })).data.properties };
        }
        async namespaceExists(e10) {
          try {
            return await this.client.request({ method: "HEAD", path: `${this.prefix}/namespaces/${rI(e10.namespace)}` }), true;
          } catch (e11) {
            if (e11 instanceof rA && 404 === e11.status) return false;
            throw e11;
          }
        }
        async createNamespaceIfNotExists(e10, t10) {
          try {
            return await this.createNamespace(e10, t10);
          } catch (e11) {
            if (e11 instanceof rA && 409 === e11.status) return;
            throw e11;
          }
        }
      };
      function r$(e10) {
        return e10.join("");
      }
      var rL = class {
        constructor(e10, t10 = "", r10) {
          this.client = e10, this.prefix = t10, this.accessDelegation = r10;
        }
        async listTables(e10) {
          return (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${r$(e10.namespace)}/tables` })).data.identifiers;
        }
        async createTable(e10, t10) {
          let r10 = {};
          return this.accessDelegation && (r10["X-Iceberg-Access-Delegation"] = this.accessDelegation), (await this.client.request({ method: "POST", path: `${this.prefix}/namespaces/${r$(e10.namespace)}/tables`, body: t10, headers: r10 })).data.metadata;
        }
        async updateTable(e10, t10) {
          let r10 = await this.client.request({ method: "POST", path: `${this.prefix}/namespaces/${r$(e10.namespace)}/tables/${e10.name}`, body: t10 });
          return { "metadata-location": r10.data["metadata-location"], metadata: r10.data.metadata };
        }
        async dropTable(e10, t10) {
          await this.client.request({ method: "DELETE", path: `${this.prefix}/namespaces/${r$(e10.namespace)}/tables/${e10.name}`, query: { purgeRequested: String(t10?.purge ?? false) } });
        }
        async loadTable(e10) {
          let t10 = {};
          return this.accessDelegation && (t10["X-Iceberg-Access-Delegation"] = this.accessDelegation), (await this.client.request({ method: "GET", path: `${this.prefix}/namespaces/${r$(e10.namespace)}/tables/${e10.name}`, headers: t10 })).data.metadata;
        }
        async tableExists(e10) {
          let t10 = {};
          this.accessDelegation && (t10["X-Iceberg-Access-Delegation"] = this.accessDelegation);
          try {
            return await this.client.request({ method: "HEAD", path: `${this.prefix}/namespaces/${r$(e10.namespace)}/tables/${e10.name}`, headers: t10 }), true;
          } catch (e11) {
            if (e11 instanceof rA && 404 === e11.status) return false;
            throw e11;
          }
        }
        async createTableIfNotExists(e10, t10) {
          try {
            return await this.createTable(e10, t10);
          } catch (r10) {
            if (r10 instanceof rA && 409 === r10.status) return await this.loadTable({ namespace: e10.namespace, name: t10.name });
            throw r10;
          }
        }
      }, rD = class {
        constructor(e10) {
          let t10 = "v1";
          e10.catalogName && (t10 += `/${e10.catalogName}`);
          let r10 = e10.baseUrl.endsWith("/") ? e10.baseUrl : `${e10.baseUrl}/`;
          this.client = function(e11) {
            let t11 = e11.fetchImpl ?? globalThis.fetch;
            return { async request({ method: r11, path: s10, query: n10, body: i2, headers: a2 }) {
              let o2 = function(e12, t12, r12) {
                let s11 = new URL(t12, e12);
                if (r12) for (let [e13, t13] of Object.entries(r12)) void 0 !== t13 && s11.searchParams.set(e13, t13);
                return s11.toString();
              }(e11.baseUrl, s10, n10), l2 = await rj(e11.auth), u2 = await t11(o2, { method: r11, headers: { ...i2 ? { "Content-Type": "application/json" } : {}, ...l2, ...a2 }, body: i2 ? JSON.stringify(i2) : void 0 }), c2 = await u2.text(), h2 = (u2.headers.get("content-type") || "").includes("application/json"), d2 = h2 && c2 ? JSON.parse(c2) : c2;
              if (!u2.ok) {
                let e12 = h2 ? d2 : void 0, t12 = e12?.error;
                throw new rA(t12?.message ?? `Request failed with status ${u2.status}`, { status: u2.status, icebergType: t12?.type, icebergCode: t12?.code, details: e12 });
              }
              return { status: u2.status, headers: u2.headers, data: d2 };
            } };
          }({ baseUrl: r10, auth: e10.auth, fetchImpl: e10.fetch }), this.accessDelegation = e10.accessDelegation?.join(","), this.namespaceOps = new rN(this.client, t10), this.tableOps = new rL(this.client, t10, this.accessDelegation);
        }
        async listNamespaces(e10) {
          return this.namespaceOps.listNamespaces(e10);
        }
        async createNamespace(e10, t10) {
          return this.namespaceOps.createNamespace(e10, t10);
        }
        async dropNamespace(e10) {
          await this.namespaceOps.dropNamespace(e10);
        }
        async loadNamespaceMetadata(e10) {
          return this.namespaceOps.loadNamespaceMetadata(e10);
        }
        async listTables(e10) {
          return this.tableOps.listTables(e10);
        }
        async createTable(e10, t10) {
          return this.tableOps.createTable(e10, t10);
        }
        async updateTable(e10, t10) {
          return this.tableOps.updateTable(e10, t10);
        }
        async dropTable(e10, t10) {
          await this.tableOps.dropTable(e10, t10);
        }
        async loadTable(e10) {
          return this.tableOps.loadTable(e10);
        }
        async namespaceExists(e10) {
          return this.namespaceOps.namespaceExists(e10);
        }
        async tableExists(e10) {
          return this.tableOps.tableExists(e10);
        }
        async createNamespaceIfNotExists(e10, t10) {
          return this.namespaceOps.createNamespaceIfNotExists(e10, t10);
        }
        async createTableIfNotExists(e10, t10) {
          return this.tableOps.createTableIfNotExists(e10, t10);
        }
      }, rU = /^decimal\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)$/, rM = /^fixed\s*\[\s*(\d+)\s*\]$/, rq = r(356).Buffer;
      function rB(e10) {
        return (rB = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e11) {
          return typeof e11;
        } : function(e11) {
          return e11 && "function" == typeof Symbol && e11.constructor === Symbol && e11 !== Symbol.prototype ? "symbol" : typeof e11;
        })(e10);
      }
      function rH(e10, t10) {
        var r10 = Object.keys(e10);
        if (Object.getOwnPropertySymbols) {
          var s10 = Object.getOwnPropertySymbols(e10);
          t10 && (s10 = s10.filter(function(t11) {
            return Object.getOwnPropertyDescriptor(e10, t11).enumerable;
          })), r10.push.apply(r10, s10);
        }
        return r10;
      }
      function rW(e10) {
        for (var t10 = 1; t10 < arguments.length; t10++) {
          var r10 = null != arguments[t10] ? arguments[t10] : {};
          t10 % 2 ? rH(Object(r10), true).forEach(function(t11) {
            !function(e11, t12, r11) {
              var s10;
              (s10 = function(e12, t13) {
                if ("object" != rB(e12) || !e12) return e12;
                var r12 = e12[Symbol.toPrimitive];
                if (void 0 !== r12) {
                  var s11 = r12.call(e12, t13 || "default");
                  if ("object" != rB(s11)) return s11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === t13 ? String : Number)(e12);
              }(t12, "string"), (t12 = "symbol" == rB(s10) ? s10 : s10 + "") in e11) ? Object.defineProperty(e11, t12, { value: r11, enumerable: true, configurable: true, writable: true }) : e11[t12] = r11;
            }(e10, t11, r10[t11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e10, Object.getOwnPropertyDescriptors(r10)) : rH(Object(r10)).forEach(function(t11) {
            Object.defineProperty(e10, t11, Object.getOwnPropertyDescriptor(r10, t11));
          });
        }
        return e10;
      }
      var rV = class extends Error {
        constructor(e10, t10 = "storage", r10, s10) {
          super(e10), this.__isStorageError = true, this.namespace = t10, this.name = "vectors" === t10 ? "StorageVectorsError" : "StorageError", this.status = r10, this.statusCode = s10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, statusCode: this.statusCode };
        }
      };
      function rz(e10) {
        return "object" == typeof e10 && null !== e10 && "__isStorageError" in e10;
      }
      var rG = class extends rV {
        constructor(e10, t10, r10, s10 = "storage") {
          super(e10, s10, t10, r10), this.name = "vectors" === s10 ? "StorageVectorsApiError" : "StorageApiError", this.status = t10, this.statusCode = r10;
        }
        toJSON() {
          return rW({}, super.toJSON());
        }
      }, rK = class extends rV {
        constructor(e10, t10, r10 = "storage") {
          super(e10, r10), this.name = "vectors" === r10 ? "StorageVectorsUnknownError" : "StorageUnknownError", this.originalError = t10;
        }
      };
      function rF(e10, t10, r10) {
        let s10 = rW({}, e10), n10 = t10.toLowerCase();
        for (let e11 of Object.keys(s10)) e11.toLowerCase() === n10 && delete s10[e11];
        return s10[n10] = r10, s10;
      }
      let rJ = (e10) => e10 ? (...t10) => e10(...t10) : (...e11) => fetch(...e11), rX = (e10) => {
        if ("object" != typeof e10 || null === e10) return false;
        let t10 = Object.getPrototypeOf(e10);
        return (null === t10 || t10 === Object.prototype || null === Object.getPrototypeOf(t10)) && !(Symbol.toStringTag in e10) && !(Symbol.iterator in e10);
      }, rY = (e10) => {
        if (Array.isArray(e10)) return e10.map((e11) => rY(e11));
        if ("function" == typeof e10 || e10 !== Object(e10)) return e10;
        let t10 = {};
        return Object.entries(e10).forEach(([e11, r10]) => {
          t10[e11.replace(/([-_][a-z])/gi, (e12) => e12.toUpperCase().replace(/[-_]/g, ""))] = rY(r10);
        }), t10;
      }, rQ = (e10) => !(!e10 || "string" != typeof e10 || 0 === e10.length || e10.length > 100 || e10.trim() !== e10 || e10.includes("/") || e10.includes("\\")) && /^[\w!.\*'() &$@=;:+,?-]+$/.test(e10), rZ = (e10) => {
        var t10;
        return e10.msg || e10.message || e10.error_description || ("string" == typeof e10.error ? e10.error : null == (t10 = e10.error) ? void 0 : t10.message) || JSON.stringify(e10);
      }, r0 = async (e10, t10, r10, s10) => {
        if (null !== e10 && "object" == typeof e10 && "function" == typeof e10.json) {
          let r11 = parseInt(e10.status, 10);
          Number.isFinite(r11) || (r11 = 500), e10.json().then((e11) => {
            let n10 = (null == e11 ? void 0 : e11.statusCode) || (null == e11 ? void 0 : e11.code) || r11 + "";
            t10(new rG(rZ(e11), r11, n10, s10));
          }).catch(() => {
            let n10 = r11 + "";
            t10(new rG(e10.statusText || `HTTP ${r11} error`, r11, n10, s10));
          });
        } else t10(new rK(rZ(e10), e10, s10));
      }, r1 = (e10, t10, r10, s10) => {
        let n10 = { method: e10, headers: (null == t10 ? void 0 : t10.headers) || {} };
        if ("GET" === e10 || "HEAD" === e10 || !s10) return rW(rW({}, n10), r10);
        if (rX(s10)) {
          var i2;
          let e11, r11 = (null == t10 ? void 0 : t10.headers) || {};
          for (let [t11, s11] of Object.entries(r11)) "content-type" === t11.toLowerCase() && (e11 = s11);
          n10.headers = rF(r11, "Content-Type", null != (i2 = e11) ? i2 : "application/json"), n10.body = JSON.stringify(s10);
        } else n10.body = s10;
        return (null == t10 ? void 0 : t10.duplex) && (n10.duplex = t10.duplex), rW(rW({}, n10), r10);
      };
      async function r2(e10, t10, r10, s10, n10, i2, a2) {
        return new Promise((o2, l2) => {
          e10(r10, r1(t10, s10, n10, i2)).then((e11) => {
            if (!e11.ok) throw e11;
            if (null == s10 ? void 0 : s10.noResolveJson) return e11;
            if ("vectors" === a2) {
              let t11 = e11.headers.get("content-type");
              if ("0" === e11.headers.get("content-length") || 204 === e11.status || !t11 || !t11.includes("application/json")) return {};
            }
            return e11.json();
          }).then((e11) => o2(e11)).catch((e11) => r0(e11, l2, s10, a2));
        });
      }
      function r3(e10 = "storage") {
        return { get: async (t10, r10, s10, n10) => r2(t10, "GET", r10, s10, n10, void 0, e10), post: async (t10, r10, s10, n10, i2) => r2(t10, "POST", r10, n10, i2, s10, e10), put: async (t10, r10, s10, n10, i2) => r2(t10, "PUT", r10, n10, i2, s10, e10), head: async (t10, r10, s10, n10) => r2(t10, "HEAD", r10, rW(rW({}, s10), {}, { noResolveJson: true }), n10, void 0, e10), remove: async (t10, r10, s10, n10, i2) => r2(t10, "DELETE", r10, n10, i2, s10, e10) };
      }
      let { get: r5, post: r4, put: r6, head: r8, remove: r9 } = r3("storage"), r7 = r3("vectors");
      var se = class {
        constructor(e10, t10 = {}, r10, s10 = "storage") {
          this.shouldThrowOnError = false, this.url = e10, this.headers = function(e11) {
            let t11 = {};
            for (let [r11, s11] of Object.entries(e11)) t11[r11.toLowerCase()] = s11;
            return t11;
          }(t10), this.fetch = rJ(r10), this.namespace = s10;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        setHeader(e10, t10) {
          return this.headers = rF(this.headers, e10, t10), this;
        }
        async handleOperation(e10) {
          try {
            return { data: await e10(), error: null };
          } catch (e11) {
            if (this.shouldThrowOnError) throw e11;
            if (rz(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      }, st = class {
        constructor(e10, t10) {
          this.downloadFn = e10, this.shouldThrowOnError = t10;
        }
        then(e10, t10) {
          return this.execute().then(e10, t10);
        }
        async execute() {
          try {
            return { data: (await this.downloadFn()).body, error: null };
          } catch (e10) {
            if (this.shouldThrowOnError) throw e10;
            if (rz(e10)) return { data: null, error: e10 };
            throw e10;
          }
        }
      };
      n = Symbol.toStringTag;
      var sr = class {
        constructor(e10, t10) {
          this.downloadFn = e10, this.shouldThrowOnError = t10, this[n] = "BlobDownloadBuilder", this.promise = null;
        }
        asStream() {
          return new st(this.downloadFn, this.shouldThrowOnError);
        }
        then(e10, t10) {
          return this.getPromise().then(e10, t10);
        }
        catch(e10) {
          return this.getPromise().catch(e10);
        }
        finally(e10) {
          return this.getPromise().finally(e10);
        }
        getPromise() {
          return this.promise || (this.promise = this.execute()), this.promise;
        }
        async execute() {
          try {
            return { data: await (await this.downloadFn()).blob(), error: null };
          } catch (e10) {
            if (this.shouldThrowOnError) throw e10;
            if (rz(e10)) return { data: null, error: e10 };
            throw e10;
          }
        }
      };
      let ss = { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }, sn = { cacheControl: "3600", contentType: "text/plain;charset=UTF-8", upsert: false };
      var si = class extends se {
        constructor(e10, t10 = {}, r10, s10) {
          super(e10, t10, s10, "storage"), this.bucketId = r10;
        }
        async uploadOrUpdate(e10, t10, r10, s10) {
          var n10 = this;
          return n10.handleOperation(async () => {
            let i2, a2 = rW(rW({}, sn), s10), o2 = rW(rW({}, n10.headers), "POST" === e10 && { "x-upsert": String(a2.upsert) }), l2 = a2.metadata;
            if ("undefined" != typeof Blob && r10 instanceof Blob ? ((i2 = new FormData()).append("cacheControl", a2.cacheControl), l2 && i2.append("metadata", n10.encodeMetadata(l2)), i2.append("", r10)) : "undefined" != typeof FormData && r10 instanceof FormData ? ((i2 = r10).has("cacheControl") || i2.append("cacheControl", a2.cacheControl), l2 && !i2.has("metadata") && i2.append("metadata", n10.encodeMetadata(l2))) : (i2 = r10, o2["cache-control"] = `max-age=${a2.cacheControl}`, o2["content-type"] = a2.contentType, l2 && (o2["x-metadata"] = n10.toBase64(n10.encodeMetadata(l2))), ("undefined" != typeof ReadableStream && i2 instanceof ReadableStream || i2 && "object" == typeof i2 && "pipe" in i2 && "function" == typeof i2.pipe) && !a2.duplex && (a2.duplex = "half")), null == s10 ? void 0 : s10.headers) for (let [e11, t11] of Object.entries(s10.headers)) o2 = rF(o2, e11, t11);
            let u2 = n10._removeEmptyFolders(t10), c2 = n10._getFinalPath(u2), h2 = await ("PUT" == e10 ? r6 : r4)(n10.fetch, `${n10.url}/object/${c2}`, i2, rW({ headers: o2 }, (null == a2 ? void 0 : a2.duplex) ? { duplex: a2.duplex } : {}));
            return { path: u2, id: h2.Id, fullPath: h2.Key };
          });
        }
        async upload(e10, t10, r10) {
          return this.uploadOrUpdate("POST", e10, t10, r10);
        }
        async uploadToSignedUrl(e10, t10, r10, s10) {
          var n10 = this;
          let i2 = n10._removeEmptyFolders(e10), a2 = n10._getFinalPath(i2), o2 = new URL(n10.url + `/object/upload/sign/${a2}`);
          return o2.searchParams.set("token", t10), n10.handleOperation(async () => {
            let e11, t11 = rW(rW({}, sn), s10), a3 = rW(rW({}, n10.headers), { "x-upsert": String(t11.upsert) }), l2 = t11.metadata;
            if ("undefined" != typeof Blob && r10 instanceof Blob ? ((e11 = new FormData()).append("cacheControl", t11.cacheControl), l2 && e11.append("metadata", n10.encodeMetadata(l2)), e11.append("", r10)) : "undefined" != typeof FormData && r10 instanceof FormData ? ((e11 = r10).has("cacheControl") || e11.append("cacheControl", t11.cacheControl), l2 && !e11.has("metadata") && e11.append("metadata", n10.encodeMetadata(l2))) : (e11 = r10, a3["cache-control"] = `max-age=${t11.cacheControl}`, a3["content-type"] = t11.contentType, l2 && (a3["x-metadata"] = n10.toBase64(n10.encodeMetadata(l2))), ("undefined" != typeof ReadableStream && e11 instanceof ReadableStream || e11 && "object" == typeof e11 && "pipe" in e11 && "function" == typeof e11.pipe) && !t11.duplex && (t11.duplex = "half")), null == s10 ? void 0 : s10.headers) for (let [e12, t12] of Object.entries(s10.headers)) a3 = rF(a3, e12, t12);
            return { path: i2, fullPath: (await r6(n10.fetch, o2.toString(), e11, rW({ headers: a3 }, (null == t11 ? void 0 : t11.duplex) ? { duplex: t11.duplex } : {}))).Key };
          });
        }
        async createSignedUploadUrl(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => {
            let s10 = r10._getFinalPath(e10), n10 = rW({}, r10.headers);
            (null == t10 ? void 0 : t10.upsert) && (n10["x-upsert"] = "true");
            let i2 = await r4(r10.fetch, `${r10.url}/object/upload/sign/${s10}`, {}, { headers: n10 }), a2 = new URL(r10.url + i2.url), o2 = a2.searchParams.get("token");
            if (!o2) throw new rV("No token returned by API");
            return { signedUrl: a2.toString(), path: e10, token: o2 };
          });
        }
        async update(e10, t10, r10) {
          return this.uploadOrUpdate("PUT", e10, t10, r10);
        }
        async move(e10, t10, r10) {
          var s10 = this;
          return s10.handleOperation(async () => await r4(s10.fetch, `${s10.url}/object/move`, { bucketId: s10.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r10 ? void 0 : r10.destinationBucket }, { headers: s10.headers }));
        }
        async copy(e10, t10, r10) {
          var s10 = this;
          return s10.handleOperation(async () => ({ path: (await r4(s10.fetch, `${s10.url}/object/copy`, { bucketId: s10.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r10 ? void 0 : r10.destinationBucket }, { headers: s10.headers })).Key }));
        }
        async createSignedUrl(e10, t10, r10) {
          var s10 = this;
          return s10.handleOperation(async () => {
            let n10 = s10._getFinalPath(e10), i2 = "object" == typeof (null == r10 ? void 0 : r10.transform) && null !== r10.transform && Object.keys(r10.transform).length > 0, a2 = await r4(s10.fetch, `${s10.url}/object/sign/${n10}`, rW({ expiresIn: t10 }, i2 ? { transform: r10.transform } : {}), { headers: s10.headers }), o2 = new URLSearchParams();
            (null == r10 ? void 0 : r10.download) && o2.set("download", true === r10.download ? "" : r10.download), (null == r10 ? void 0 : r10.cacheNonce) != null && o2.set("cacheNonce", String(r10.cacheNonce));
            let l2 = o2.toString();
            return { signedUrl: encodeURI(`${s10.url}${a2.signedURL}${l2 ? `&${l2}` : ""}`) };
          });
        }
        async createSignedUrls(e10, t10, r10) {
          var s10 = this;
          return s10.handleOperation(async () => {
            let n10 = await r4(s10.fetch, `${s10.url}/object/sign/${s10.bucketId}`, { expiresIn: t10, paths: e10 }, { headers: s10.headers }), i2 = new URLSearchParams();
            (null == r10 ? void 0 : r10.download) && i2.set("download", true === r10.download ? "" : r10.download), (null == r10 ? void 0 : r10.cacheNonce) != null && i2.set("cacheNonce", String(r10.cacheNonce));
            let a2 = i2.toString();
            return n10.map((e11) => rW(rW({}, e11), {}, { signedUrl: e11.signedURL ? encodeURI(`${s10.url}${e11.signedURL}${a2 ? `&${a2}` : ""}`) : null }));
          });
        }
        download(e10, t10, r10) {
          let s10 = "object" == typeof (null == t10 ? void 0 : t10.transform) && null !== t10.transform && Object.keys(t10.transform).length > 0 ? "render/image/authenticated" : "object", n10 = new URLSearchParams();
          (null == t10 ? void 0 : t10.transform) && this.applyTransformOptsToQuery(n10, t10.transform), (null == t10 ? void 0 : t10.cacheNonce) != null && n10.set("cacheNonce", String(t10.cacheNonce));
          let i2 = n10.toString(), a2 = this._getFinalPath(e10);
          return new sr(() => r5(this.fetch, `${this.url}/${s10}/${a2}${i2 ? `?${i2}` : ""}`, { headers: this.headers, noResolveJson: true }, r10), this.shouldThrowOnError);
        }
        async info(e10) {
          var t10 = this;
          let r10 = t10._getFinalPath(e10);
          return t10.handleOperation(async () => rY(await r5(t10.fetch, `${t10.url}/object/info/${r10}`, { headers: t10.headers })));
        }
        async exists(e10) {
          var t10;
          let r10 = this._getFinalPath(e10);
          try {
            return await r8(this.fetch, `${this.url}/object/${r10}`, { headers: this.headers }), { data: true, error: null };
          } catch (e11) {
            if (this.shouldThrowOnError) throw e11;
            if (rz(e11)) {
              let r11 = e11 instanceof rG ? e11.status : e11 instanceof rK ? null == (t10 = e11.originalError) ? void 0 : t10.status : void 0;
              if (void 0 !== r11 && [400, 404].includes(r11)) return { data: false, error: e11 };
            }
            throw e11;
          }
        }
        getPublicUrl(e10, t10) {
          let r10 = this._getFinalPath(e10), s10 = new URLSearchParams();
          (null == t10 ? void 0 : t10.download) && s10.set("download", true === t10.download ? "" : t10.download), (null == t10 ? void 0 : t10.transform) && this.applyTransformOptsToQuery(s10, t10.transform), (null == t10 ? void 0 : t10.cacheNonce) != null && s10.set("cacheNonce", String(t10.cacheNonce));
          let n10 = s10.toString(), i2 = "object" == typeof (null == t10 ? void 0 : t10.transform) && null !== t10.transform && Object.keys(t10.transform).length > 0 ? "render/image" : "object";
          return { data: { publicUrl: encodeURI(`${this.url}/${i2}/public/${r10}`) + (n10 ? `?${n10}` : "") } };
        }
        async remove(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r9(t10.fetch, `${t10.url}/object/${t10.bucketId}`, { prefixes: e10 }, { headers: t10.headers }));
        }
        async list(e10, t10, r10) {
          var s10 = this;
          return s10.handleOperation(async () => {
            let n10 = rW(rW(rW({}, ss), t10), {}, { prefix: e10 || "" });
            return await r4(s10.fetch, `${s10.url}/object/list/${s10.bucketId}`, n10, { headers: s10.headers }, r10);
          });
        }
        async listV2(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => {
            let s10 = rW({}, e10);
            return await r4(r10.fetch, `${r10.url}/object/list-v2/${r10.bucketId}`, s10, { headers: r10.headers }, t10);
          });
        }
        encodeMetadata(e10) {
          return JSON.stringify(e10);
        }
        toBase64(e10) {
          return void 0 !== rq ? rq.from(e10).toString("base64") : btoa(e10);
        }
        _getFinalPath(e10) {
          return `${this.bucketId}/${e10.replace(/^\/+/, "")}`;
        }
        _removeEmptyFolders(e10) {
          return e10.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
        }
        applyTransformOptsToQuery(e10, t10) {
          return t10.width && e10.set("width", t10.width.toString()), t10.height && e10.set("height", t10.height.toString()), t10.resize && e10.set("resize", t10.resize), t10.format && e10.set("format", t10.format), t10.quality && e10.set("quality", t10.quality.toString()), e10;
        }
      };
      let sa = { "X-Client-Info": "storage-js/2.105.1" };
      var so = class extends se {
        constructor(e10, t10 = {}, r10, s10) {
          let n10 = new URL(e10);
          (null == s10 ? void 0 : s10.useNewHostname) && /supabase\.(co|in|red)$/.test(n10.hostname) && !n10.hostname.includes("storage.supabase.") && (n10.hostname = n10.hostname.replace("supabase.", "storage.supabase.")), super(n10.href.replace(/\/$/, ""), rW(rW({}, sa), t10), r10, "storage");
        }
        async listBuckets(e10) {
          var t10 = this;
          return t10.handleOperation(async () => {
            let r10 = t10.listBucketOptionsToQueryString(e10);
            return await r5(t10.fetch, `${t10.url}/bucket${r10}`, { headers: t10.headers });
          });
        }
        async getBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r5(t10.fetch, `${t10.url}/bucket/${e10}`, { headers: t10.headers }));
        }
        async createBucket(e10, t10 = { public: false }) {
          var r10 = this;
          return r10.handleOperation(async () => await r4(r10.fetch, `${r10.url}/bucket`, { id: e10, name: e10, type: t10.type, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: r10.headers }));
        }
        async updateBucket(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => await r6(r10.fetch, `${r10.url}/bucket/${e10}`, { id: e10, name: e10, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: r10.headers }));
        }
        async emptyBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r4(t10.fetch, `${t10.url}/bucket/${e10}/empty`, {}, { headers: t10.headers }));
        }
        async deleteBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r9(t10.fetch, `${t10.url}/bucket/${e10}`, {}, { headers: t10.headers }));
        }
        listBucketOptionsToQueryString(e10) {
          let t10 = {};
          return e10 && ("limit" in e10 && (t10.limit = String(e10.limit)), "offset" in e10 && (t10.offset = String(e10.offset)), e10.search && (t10.search = e10.search), e10.sortColumn && (t10.sortColumn = e10.sortColumn), e10.sortOrder && (t10.sortOrder = e10.sortOrder)), Object.keys(t10).length > 0 ? "?" + new URLSearchParams(t10).toString() : "";
        }
      }, sl = class extends se {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), rW(rW({}, sa), t10), r10, "storage");
        }
        async createBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r4(t10.fetch, `${t10.url}/bucket`, { name: e10 }, { headers: t10.headers }));
        }
        async listBuckets(e10) {
          var t10 = this;
          return t10.handleOperation(async () => {
            let r10 = new URLSearchParams();
            (null == e10 ? void 0 : e10.limit) !== void 0 && r10.set("limit", e10.limit.toString()), (null == e10 ? void 0 : e10.offset) !== void 0 && r10.set("offset", e10.offset.toString()), (null == e10 ? void 0 : e10.sortColumn) && r10.set("sortColumn", e10.sortColumn), (null == e10 ? void 0 : e10.sortOrder) && r10.set("sortOrder", e10.sortOrder), (null == e10 ? void 0 : e10.search) && r10.set("search", e10.search);
            let s10 = r10.toString(), n10 = s10 ? `${t10.url}/bucket?${s10}` : `${t10.url}/bucket`;
            return await r5(t10.fetch, n10, { headers: t10.headers });
          });
        }
        async deleteBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r9(t10.fetch, `${t10.url}/bucket/${e10}`, {}, { headers: t10.headers }));
        }
        from(e10) {
          var t10 = this;
          if (!rQ(e10)) throw new rV("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");
          let r10 = new rD({ baseUrl: this.url, catalogName: e10, auth: { type: "custom", getHeaders: async () => t10.headers }, fetch: this.fetch }), s10 = this.shouldThrowOnError;
          return new Proxy(r10, { get(e11, t11) {
            let r11 = e11[t11];
            return "function" != typeof r11 ? r11 : async (...t12) => {
              try {
                return { data: await r11.apply(e11, t12), error: null };
              } catch (e12) {
                if (s10) throw e12;
                return { data: null, error: e12 };
              }
            };
          } });
        }
      }, su = class extends se {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), rW(rW({}, sa), {}, { "Content-Type": "application/json" }, t10), r10, "vectors");
        }
        async createIndex(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/CreateIndex`, e10, { headers: t10.headers }) || {});
        }
        async getIndex(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => await r7.post(r10.fetch, `${r10.url}/GetIndex`, { vectorBucketName: e10, indexName: t10 }, { headers: r10.headers }));
        }
        async listIndexes(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/ListIndexes`, e10, { headers: t10.headers }));
        }
        async deleteIndex(e10, t10) {
          var r10 = this;
          return r10.handleOperation(async () => await r7.post(r10.fetch, `${r10.url}/DeleteIndex`, { vectorBucketName: e10, indexName: t10 }, { headers: r10.headers }) || {});
        }
      }, sc = class extends se {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), rW(rW({}, sa), {}, { "Content-Type": "application/json" }, t10), r10, "vectors");
        }
        async putVectors(e10) {
          var t10 = this;
          if (e10.vectors.length < 1 || e10.vectors.length > 500) throw Error("Vector batch size must be between 1 and 500 items");
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/PutVectors`, e10, { headers: t10.headers }) || {});
        }
        async getVectors(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/GetVectors`, e10, { headers: t10.headers }));
        }
        async listVectors(e10) {
          var t10 = this;
          if (void 0 !== e10.segmentCount) {
            if (e10.segmentCount < 1 || e10.segmentCount > 16) throw Error("segmentCount must be between 1 and 16");
            if (void 0 !== e10.segmentIndex && (e10.segmentIndex < 0 || e10.segmentIndex >= e10.segmentCount)) throw Error(`segmentIndex must be between 0 and ${e10.segmentCount - 1}`);
          }
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/ListVectors`, e10, { headers: t10.headers }));
        }
        async queryVectors(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/QueryVectors`, e10, { headers: t10.headers }));
        }
        async deleteVectors(e10) {
          var t10 = this;
          if (e10.keys.length < 1 || e10.keys.length > 500) throw Error("Keys batch size must be between 1 and 500 items");
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/DeleteVectors`, e10, { headers: t10.headers }) || {});
        }
      }, sh = class extends se {
        constructor(e10, t10 = {}, r10) {
          super(e10.replace(/\/$/, ""), rW(rW({}, sa), {}, { "Content-Type": "application/json" }, t10), r10, "vectors");
        }
        async createBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/CreateVectorBucket`, { vectorBucketName: e10 }, { headers: t10.headers }) || {});
        }
        async getBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/GetVectorBucket`, { vectorBucketName: e10 }, { headers: t10.headers }));
        }
        async listBuckets(e10 = {}) {
          var t10 = this;
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/ListVectorBuckets`, e10, { headers: t10.headers }));
        }
        async deleteBucket(e10) {
          var t10 = this;
          return t10.handleOperation(async () => await r7.post(t10.fetch, `${t10.url}/DeleteVectorBucket`, { vectorBucketName: e10 }, { headers: t10.headers }) || {});
        }
      }, sd = class extends sh {
        constructor(e10, t10 = {}) {
          super(e10, t10.headers || {}, t10.fetch);
        }
        from(e10) {
          return new sp(this.url, this.headers, e10, this.fetch);
        }
        async createBucket(e10) {
          return super.createBucket.call(this, e10);
        }
        async getBucket(e10) {
          return super.getBucket.call(this, e10);
        }
        async listBuckets(e10 = {}) {
          return super.listBuckets.call(this, e10);
        }
        async deleteBucket(e10) {
          return super.deleteBucket.call(this, e10);
        }
      }, sp = class extends su {
        constructor(e10, t10, r10, s10) {
          super(e10, t10, s10), this.vectorBucketName = r10;
        }
        async createIndex(e10) {
          return super.createIndex.call(this, rW(rW({}, e10), {}, { vectorBucketName: this.vectorBucketName }));
        }
        async listIndexes(e10 = {}) {
          return super.listIndexes.call(this, rW(rW({}, e10), {}, { vectorBucketName: this.vectorBucketName }));
        }
        async getIndex(e10) {
          return super.getIndex.call(this, this.vectorBucketName, e10);
        }
        async deleteIndex(e10) {
          return super.deleteIndex.call(this, this.vectorBucketName, e10);
        }
        index(e10) {
          return new sf(this.url, this.headers, this.vectorBucketName, e10, this.fetch);
        }
      }, sf = class extends sc {
        constructor(e10, t10, r10, s10, n10) {
          super(e10, t10, n10), this.vectorBucketName = r10, this.indexName = s10;
        }
        async putVectors(e10) {
          return super.putVectors.call(this, rW(rW({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async getVectors(e10) {
          return super.getVectors.call(this, rW(rW({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async listVectors(e10 = {}) {
          return super.listVectors.call(this, rW(rW({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async queryVectors(e10) {
          return super.queryVectors.call(this, rW(rW({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
        async deleteVectors(e10) {
          return super.deleteVectors.call(this, rW(rW({}, e10), {}, { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        }
      }, sg = class extends so {
        constructor(e10, t10 = {}, r10, s10) {
          super(e10, t10, r10, s10);
        }
        from(e10) {
          return new si(this.url, this.headers, e10, this.fetch);
        }
        get vectors() {
          return new sd(this.url + "/vector", { headers: this.headers, fetch: this.fetch });
        }
        get analytics() {
          return new sl(this.url + "/iceberg", this.headers, this.fetch);
        }
      };
      let sm = "2.105.1", sb = { "X-Client-Info": `gotrue-js/${sm}` }, sy = "X-Supabase-Api-Version", sw = { "2024-01-01": { timestamp: Date.parse("2024-01-01T00:00:00.0Z"), name: "2024-01-01" } }, sv = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
      class s_ extends Error {
        constructor(e10, t10, r10) {
          super(e10), this.__isAuthError = true, this.name = "AuthError", this.status = t10, this.code = r10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, code: this.code };
        }
      }
      function sk(e10) {
        return "object" == typeof e10 && null !== e10 && "__isAuthError" in e10;
      }
      class sS extends s_ {
        constructor(e10, t10, r10) {
          super(e10, t10, r10), this.name = "AuthApiError", this.status = t10, this.code = r10;
        }
      }
      class sE extends s_ {
        constructor(e10, t10) {
          super(e10), this.name = "AuthUnknownError", this.originalError = t10;
        }
      }
      class sT extends s_ {
        constructor(e10, t10, r10, s10) {
          super(e10, r10, s10), this.name = t10, this.status = r10;
        }
      }
      class sR extends sT {
        constructor() {
          super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
        }
      }
      function sO(e10) {
        return sk(e10) && "AuthSessionMissingError" === e10.name;
      }
      class sC extends sT {
        constructor() {
          super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
        }
      }
      class sP extends sT {
        constructor(e10) {
          super(e10, "AuthInvalidCredentialsError", 400, void 0);
        }
      }
      class sx extends sT {
        constructor(e10, t10 = null) {
          super(e10, "AuthImplicitGrantRedirectError", 500, void 0), this.details = null, this.details = t10;
        }
        toJSON() {
          return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
        }
      }
      class sA extends sT {
        constructor(e10, t10 = null) {
          super(e10, "AuthPKCEGrantCodeExchangeError", 500, void 0), this.details = null, this.details = t10;
        }
        toJSON() {
          return Object.assign(Object.assign({}, super.toJSON()), { details: this.details });
        }
      }
      class sj extends sT {
        constructor() {
          super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.", "AuthPKCECodeVerifierMissingError", 400, "pkce_code_verifier_not_found");
        }
      }
      class sI extends sT {
        constructor(e10, t10) {
          super(e10, "AuthRetryableFetchError", t10, void 0);
        }
      }
      function sN(e10) {
        return sk(e10) && "AuthRetryableFetchError" === e10.name;
      }
      class s$ extends sT {
        constructor(e10, t10, r10) {
          super(e10, "AuthWeakPasswordError", t10, "weak_password"), this.reasons = r10;
        }
        toJSON() {
          return Object.assign(Object.assign({}, super.toJSON()), { reasons: this.reasons });
        }
      }
      class sL extends sT {
        constructor(e10) {
          super(e10, "AuthInvalidJwtError", 400, "invalid_jwt");
        }
      }
      let sD = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), sU = " 	\n\r=".split(""), sM = (() => {
        let e10 = Array(128);
        for (let t10 = 0; t10 < e10.length; t10 += 1) e10[t10] = -1;
        for (let t10 = 0; t10 < sU.length; t10 += 1) e10[sU[t10].charCodeAt(0)] = -2;
        for (let t10 = 0; t10 < sD.length; t10 += 1) e10[sD[t10].charCodeAt(0)] = t10;
        return e10;
      })();
      function sq(e10, t10, r10) {
        if (null !== e10) for (t10.queue = t10.queue << 8 | e10, t10.queuedBits += 8; t10.queuedBits >= 6; ) r10(sD[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
        else if (t10.queuedBits > 0) for (t10.queue = t10.queue << 6 - t10.queuedBits, t10.queuedBits = 6; t10.queuedBits >= 6; ) r10(sD[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
      }
      function sB(e10, t10, r10) {
        let s10 = sM[e10];
        if (s10 > -1) for (t10.queue = t10.queue << 6 | s10, t10.queuedBits += 6; t10.queuedBits >= 8; ) r10(t10.queue >> t10.queuedBits - 8 & 255), t10.queuedBits -= 8;
        else if (-2 === s10) return;
        else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e10)}"`);
      }
      function sH(e10) {
        let t10 = [], r10 = (e11) => {
          t10.push(String.fromCodePoint(e11));
        }, s10 = { utf8seq: 0, codepoint: 0 }, n10 = { queue: 0, queuedBits: 0 }, i2 = (e11) => {
          !function(e12, t11, r11) {
            if (0 === t11.utf8seq) {
              if (e12 <= 127) return r11(e12);
              for (let r12 = 1; r12 < 6; r12 += 1) if ((e12 >> 7 - r12 & 1) == 0) {
                t11.utf8seq = r12;
                break;
              }
              if (2 === t11.utf8seq) t11.codepoint = 31 & e12;
              else if (3 === t11.utf8seq) t11.codepoint = 15 & e12;
              else if (4 === t11.utf8seq) t11.codepoint = 7 & e12;
              else throw Error("Invalid UTF-8 sequence");
              t11.utf8seq -= 1;
            } else if (t11.utf8seq > 0) {
              if (e12 <= 127) throw Error("Invalid UTF-8 sequence");
              t11.codepoint = t11.codepoint << 6 | 63 & e12, t11.utf8seq -= 1, 0 === t11.utf8seq && r11(t11.codepoint);
            }
          }(e11, s10, r10);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) sB(e10.charCodeAt(t11), n10, i2);
        return t10.join("");
      }
      function sW(e10) {
        let t10 = [], r10 = { queue: 0, queuedBits: 0 }, s10 = (e11) => {
          t10.push(e11);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) sB(e10.charCodeAt(t11), r10, s10);
        return new Uint8Array(t10);
      }
      function sV(e10) {
        let t10 = [], r10 = { queue: 0, queuedBits: 0 }, s10 = (e11) => {
          t10.push(e11);
        };
        return e10.forEach((e11) => sq(e11, r10, s10)), sq(null, r10, s10), t10.join("");
      }
      let sz = () => "undefined" != typeof window && "undefined" != typeof document, sG = { tested: false, writable: false }, sK = () => {
        if (!sz()) return false;
        try {
          if ("object" != typeof globalThis.localStorage) return false;
        } catch (e11) {
          return false;
        }
        if (sG.tested) return sG.writable;
        let e10 = `lswt-${Math.random()}${Math.random()}`;
        try {
          globalThis.localStorage.setItem(e10, e10), globalThis.localStorage.removeItem(e10), sG.tested = true, sG.writable = true;
        } catch (e11) {
          sG.tested = true, sG.writable = false;
        }
        return sG.writable;
      }, sF = (e10) => e10 ? (...t10) => e10(...t10) : (...e11) => fetch(...e11), sJ = (e10) => "object" == typeof e10 && null !== e10 && "status" in e10 && "ok" in e10 && "json" in e10 && "function" == typeof e10.json, sX = async (e10, t10, r10) => {
        await e10.setItem(t10, JSON.stringify(r10));
      }, sY = async (e10, t10) => {
        let r10 = await e10.getItem(t10);
        if (!r10) return null;
        try {
          return JSON.parse(r10);
        } catch (e11) {
          return r10;
        }
      }, sQ = async (e10, t10) => {
        await e10.removeItem(t10);
      };
      class sZ {
        constructor() {
          this.promise = new sZ.promiseConstructor((e10, t10) => {
            this.resolve = e10, this.reject = t10;
          });
        }
      }
      function s0(e10) {
        let t10 = e10.split(".");
        if (3 !== t10.length) throw new sL("Invalid JWT structure");
        for (let e11 = 0; e11 < t10.length; e11++) if (!sv.test(t10[e11])) throw new sL("JWT not in base64url format");
        return { header: JSON.parse(sH(t10[0])), payload: JSON.parse(sH(t10[1])), signature: sW(t10[2]), raw: { header: t10[0], payload: t10[1] } };
      }
      async function s1(e10) {
        return await new Promise((t10) => {
          setTimeout(() => t10(null), e10);
        });
      }
      function s2(e10) {
        return ("0" + e10.toString(16)).substr(-2);
      }
      async function s3(e10) {
        let t10 = new TextEncoder().encode(e10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", t10))).map((e11) => String.fromCharCode(e11)).join("");
      }
      async function s5(e10) {
        return "undefined" == typeof crypto || void 0 === crypto.subtle || "undefined" == typeof TextEncoder ? (console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), e10) : btoa(await s3(e10)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      }
      async function s4(e10, t10, r10 = false) {
        let s10 = function() {
          let e11 = new Uint32Array(56);
          if ("undefined" == typeof crypto) {
            let e12 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", t11 = e12.length, r11 = "";
            for (let s11 = 0; s11 < 56; s11++) r11 += e12.charAt(Math.floor(Math.random() * t11));
            return r11;
          }
          return crypto.getRandomValues(e11), Array.from(e11, s2).join("");
        }(), n10 = s10;
        r10 && (n10 += "/recovery"), await sX(e10, `${t10}-code-verifier`, n10);
        let i2 = await s5(s10), a2 = s10 === i2 ? "plain" : "s256";
        return [i2, a2];
      }
      sZ.promiseConstructor = Promise;
      let s6 = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i, s8 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      function s9(e10) {
        if (!s8.test(e10)) throw Error("@supabase/auth-js: Expected parameter to be UUID but is not");
      }
      function s7(e10) {
        if (!e10.passkey) throw Error("@supabase/auth-js: the passkey API is experimental and disabled by default. Enable it by passing `auth: { experimental: { passkey: true } }` to createClient (or to the GoTrueClient constructor).");
      }
      function ne() {
        return new Proxy({}, { get: (e10, t10) => {
          if ("__isUserNotAvailableProxy" === t10) return true;
          if ("symbol" == typeof t10) {
            let e11 = t10.toString();
            if ("Symbol(Symbol.toPrimitive)" === e11 || "Symbol(Symbol.toStringTag)" === e11 || "Symbol(util.inspect.custom)" === e11) return;
          }
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t10}" property of the session object is not supported. Please use getUser() instead.`);
        }, set: (e10, t10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        }, deleteProperty: (e10, t10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        } });
      }
      function nt(e10) {
        return JSON.parse(JSON.stringify(e10));
      }
      let nr = (e10) => e10.msg || e10.message || e10.error_description || e10.error || JSON.stringify(e10), ns = [502, 503, 504, 520, 521, 522, 523, 524, 530];
      async function nn(e10) {
        var t10;
        let r10, s10;
        if (!sJ(e10)) throw new sI(nr(e10), 0);
        if (ns.includes(e10.status)) throw new sI(nr(e10), e10.status);
        try {
          r10 = await e10.json();
        } catch (e11) {
          throw new sE(nr(e11), e11);
        }
        let n10 = function(e11) {
          let t11 = e11.headers.get(sy);
          if (!t11 || !t11.match(s6)) return null;
          try {
            return /* @__PURE__ */ new Date(`${t11}T00:00:00.0Z`);
          } catch (e12) {
            return null;
          }
        }(e10);
        if (n10 && n10.getTime() >= sw["2024-01-01"].timestamp && "object" == typeof r10 && r10 && "string" == typeof r10.code ? s10 = r10.code : "object" == typeof r10 && r10 && "string" == typeof r10.error_code && (s10 = r10.error_code), s10) {
          if ("weak_password" === s10) throw new s$(nr(r10), e10.status, (null == (t10 = r10.weak_password) ? void 0 : t10.reasons) || []);
          else if ("session_not_found" === s10) throw new sR();
        } else if ("object" == typeof r10 && r10 && "object" == typeof r10.weak_password && r10.weak_password && Array.isArray(r10.weak_password.reasons) && r10.weak_password.reasons.length && r10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true)) throw new s$(nr(r10), e10.status, r10.weak_password.reasons);
        throw new sS(nr(r10), e10.status || 500, s10);
      }
      let ni = (e10, t10, r10, s10) => {
        let n10 = { method: e10, headers: (null == t10 ? void 0 : t10.headers) || {} };
        return "GET" === e10 ? n10 : (n10.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, null == t10 ? void 0 : t10.headers), n10.body = JSON.stringify(s10), Object.assign(Object.assign({}, n10), r10));
      };
      async function na(e10, t10, r10, s10) {
        var n10;
        let i2 = Object.assign({}, null == s10 ? void 0 : s10.headers);
        i2[sy] || (i2[sy] = sw["2024-01-01"].name), (null == s10 ? void 0 : s10.jwt) && (i2.Authorization = `Bearer ${s10.jwt}`);
        let a2 = null != (n10 = null == s10 ? void 0 : s10.query) ? n10 : {};
        (null == s10 ? void 0 : s10.redirectTo) && (a2.redirect_to = s10.redirectTo);
        let o2 = Object.keys(a2).length ? "?" + new URLSearchParams(a2).toString() : "", l2 = await no(e10, t10, r10 + o2, { headers: i2, noResolveJson: null == s10 ? void 0 : s10.noResolveJson }, {}, null == s10 ? void 0 : s10.body);
        return (null == s10 ? void 0 : s10.xform) ? null == s10 ? void 0 : s10.xform(l2) : { data: Object.assign({}, l2), error: null };
      }
      async function no(e10, t10, r10, s10, n10, i2) {
        let a2, o2 = ni(t10, s10, n10, i2);
        try {
          a2 = await e10(r10, Object.assign({}, o2));
        } catch (e11) {
          throw console.error(e11), new sI(nr(e11), 0);
        }
        if (a2.ok || await nn(a2), null == s10 ? void 0 : s10.noResolveJson) return a2;
        try {
          return await a2.json();
        } catch (e11) {
          await nn(e11);
        }
      }
      function nl(e10) {
        var t10, r10, s10;
        let n10 = null;
        (s10 = e10).access_token && s10.refresh_token && s10.expires_in && (n10 = Object.assign({}, e10), e10.expires_at || (n10.expires_at = (r10 = e10.expires_in, Math.round(Date.now() / 1e3) + r10)));
        return { data: { session: n10, user: null != (t10 = e10.user) ? t10 : e10 }, error: null };
      }
      function nu(e10) {
        let t10 = nl(e10);
        return !t10.error && e10.weak_password && "object" == typeof e10.weak_password && Array.isArray(e10.weak_password.reasons) && e10.weak_password.reasons.length && e10.weak_password.message && "string" == typeof e10.weak_password.message && e10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true) && (t10.data.weak_password = e10.weak_password), t10;
      }
      function nc(e10) {
        var t10;
        return { data: { user: null != (t10 = e10.user) ? t10 : e10 }, error: null };
      }
      function nh(e10) {
        return { data: e10, error: null };
      }
      function nd(e10) {
        let { action_link: t10, email_otp: r10, hashed_token: s10, redirect_to: n10, verification_type: i2 } = e10;
        return { data: { properties: { action_link: t10, email_otp: r10, hashed_token: s10, redirect_to: n10, verification_type: i2 }, user: Object.assign({}, tP(e10, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"])) }, error: null };
      }
      function np(e10) {
        return e10;
      }
      let nf = ["global", "local", "others"];
      class ng {
        constructor({ url: e10 = "", headers: t10 = {}, fetch: r10, experimental: s10 }) {
          this.url = e10, this.headers = t10, this.fetch = sF(r10), this.experimental = null != s10 ? s10 : {}, this.mfa = { listFactors: this._listFactors.bind(this), deleteFactor: this._deleteFactor.bind(this) }, this.oauth = { listClients: this._listOAuthClients.bind(this), createClient: this._createOAuthClient.bind(this), getClient: this._getOAuthClient.bind(this), updateClient: this._updateOAuthClient.bind(this), deleteClient: this._deleteOAuthClient.bind(this), regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this) }, this.customProviders = { listProviders: this._listCustomProviders.bind(this), createProvider: this._createCustomProvider.bind(this), getProvider: this._getCustomProvider.bind(this), updateProvider: this._updateCustomProvider.bind(this), deleteProvider: this._deleteCustomProvider.bind(this) }, this.passkey = { listPasskeys: this._adminListPasskeys.bind(this), deletePasskey: this._adminDeletePasskey.bind(this) };
        }
        async signOut(e10, t10 = nf[0]) {
          if (0 > nf.indexOf(t10)) throw Error(`@supabase/auth-js: Parameter scope must be one of ${nf.join(", ")}`);
          try {
            return await na(this.fetch, "POST", `${this.url}/logout?scope=${t10}`, { headers: this.headers, jwt: e10, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async inviteUserByEmail(e10, t10 = {}) {
          try {
            return await na(this.fetch, "POST", `${this.url}/invite`, { body: { email: e10, data: t10.data }, headers: this.headers, redirectTo: t10.redirectTo, xform: nc });
          } catch (e11) {
            if (sk(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async generateLink(e10) {
          try {
            let { options: t10 } = e10, r10 = tP(e10, ["options"]), s10 = Object.assign(Object.assign({}, r10), t10);
            return "newEmail" in r10 && (s10.new_email = null == r10 ? void 0 : r10.newEmail, delete s10.newEmail), await na(this.fetch, "POST", `${this.url}/admin/generate_link`, { body: s10, headers: this.headers, xform: nd, redirectTo: null == t10 ? void 0 : t10.redirectTo });
          } catch (e11) {
            if (sk(e11)) return { data: { properties: null, user: null }, error: e11 };
            throw e11;
          }
        }
        async createUser(e10) {
          try {
            return await na(this.fetch, "POST", `${this.url}/admin/users`, { body: e10, headers: this.headers, xform: nc });
          } catch (e11) {
            if (sk(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async listUsers(e10) {
          var t10, r10, s10, n10, i2, a2, o2;
          try {
            let l2 = { nextPage: null, lastPage: 0, total: 0 }, u2 = await na(this.fetch, "GET", `${this.url}/admin/users`, { headers: this.headers, noResolveJson: true, query: { page: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.page) ? void 0 : t10.toString()) ? r10 : "", per_page: null != (n10 = null == (s10 = null == e10 ? void 0 : e10.perPage) ? void 0 : s10.toString()) ? n10 : "" }, xform: np });
            if (u2.error) throw u2.error;
            let c2 = await u2.json(), h2 = null != (i2 = u2.headers.get("x-total-count")) ? i2 : 0, d2 = null != (o2 = null == (a2 = u2.headers.get("link")) ? void 0 : a2.split(",")) ? o2 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r11 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l2[`${r11}Page`] = t11;
            }), l2.total = parseInt(h2)), { data: Object.assign(Object.assign({}, c2), l2), error: null };
          } catch (e11) {
            if (sk(e11)) return { data: { users: [] }, error: e11 };
            throw e11;
          }
        }
        async getUserById(e10) {
          s9(e10);
          try {
            return await na(this.fetch, "GET", `${this.url}/admin/users/${e10}`, { headers: this.headers, xform: nc });
          } catch (e11) {
            if (sk(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async updateUserById(e10, t10) {
          s9(e10);
          try {
            return await na(this.fetch, "PUT", `${this.url}/admin/users/${e10}`, { body: t10, headers: this.headers, xform: nc });
          } catch (e11) {
            if (sk(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async deleteUser(e10, t10 = false) {
          s9(e10);
          try {
            return await na(this.fetch, "DELETE", `${this.url}/admin/users/${e10}`, { headers: this.headers, body: { should_soft_delete: t10 }, xform: nc });
          } catch (e11) {
            if (sk(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async _listFactors(e10) {
          s9(e10.userId);
          try {
            let { data: t10, error: r10 } = await na(this.fetch, "GET", `${this.url}/admin/users/${e10.userId}/factors`, { headers: this.headers, xform: (e11) => ({ data: { factors: e11 }, error: null }) });
            return { data: t10, error: r10 };
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteFactor(e10) {
          s9(e10.userId), s9(e10.id);
          try {
            return { data: await na(this.fetch, "DELETE", `${this.url}/admin/users/${e10.userId}/factors/${e10.id}`, { headers: this.headers }), error: null };
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _listOAuthClients(e10) {
          var t10, r10, s10, n10, i2, a2, o2;
          try {
            let l2 = { nextPage: null, lastPage: 0, total: 0 }, u2 = await na(this.fetch, "GET", `${this.url}/admin/oauth/clients`, { headers: this.headers, noResolveJson: true, query: { page: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.page) ? void 0 : t10.toString()) ? r10 : "", per_page: null != (n10 = null == (s10 = null == e10 ? void 0 : e10.perPage) ? void 0 : s10.toString()) ? n10 : "" }, xform: np });
            if (u2.error) throw u2.error;
            let c2 = await u2.json(), h2 = null != (i2 = u2.headers.get("x-total-count")) ? i2 : 0, d2 = null != (o2 = null == (a2 = u2.headers.get("link")) ? void 0 : a2.split(",")) ? o2 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r11 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l2[`${r11}Page`] = t11;
            }), l2.total = parseInt(h2)), { data: Object.assign(Object.assign({}, c2), l2), error: null };
          } catch (e11) {
            if (sk(e11)) return { data: { clients: [] }, error: e11 };
            throw e11;
          }
        }
        async _createOAuthClient(e10) {
          try {
            return await na(this.fetch, "POST", `${this.url}/admin/oauth/clients`, { body: e10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _getOAuthClient(e10) {
          try {
            return await na(this.fetch, "GET", `${this.url}/admin/oauth/clients/${e10}`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _updateOAuthClient(e10, t10) {
          try {
            return await na(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${e10}`, { body: t10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteOAuthClient(e10) {
          try {
            return await na(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${e10}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _regenerateOAuthClientSecret(e10) {
          try {
            return await na(this.fetch, "POST", `${this.url}/admin/oauth/clients/${e10}/regenerate_secret`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _listCustomProviders(e10) {
          try {
            let t10 = {};
            return (null == e10 ? void 0 : e10.type) && (t10.type = e10.type), await na(this.fetch, "GET", `${this.url}/admin/custom-providers`, { headers: this.headers, query: t10, xform: (e11) => {
              var t11;
              return { data: { providers: null != (t11 = null == e11 ? void 0 : e11.providers) ? t11 : [] }, error: null };
            } });
          } catch (e11) {
            if (sk(e11)) return { data: { providers: [] }, error: e11 };
            throw e11;
          }
        }
        async _createCustomProvider(e10) {
          try {
            return await na(this.fetch, "POST", `${this.url}/admin/custom-providers`, { body: e10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _getCustomProvider(e10) {
          try {
            return await na(this.fetch, "GET", `${this.url}/admin/custom-providers/${e10}`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _updateCustomProvider(e10, t10) {
          try {
            return await na(this.fetch, "PUT", `${this.url}/admin/custom-providers/${e10}`, { body: t10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteCustomProvider(e10) {
          try {
            return await na(this.fetch, "DELETE", `${this.url}/admin/custom-providers/${e10}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _adminListPasskeys(e10) {
          s7(this.experimental), s9(e10.userId);
          try {
            return await na(this.fetch, "GET", `${this.url}/admin/users/${e10.userId}/passkeys`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _adminDeletePasskey(e10) {
          s7(this.experimental), s9(e10.userId), s9(e10.passkeyId);
          try {
            return await na(this.fetch, "DELETE", `${this.url}/admin/users/${e10.userId}/passkeys/${e10.passkeyId}`, { headers: this.headers, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      }
      function nm(e10 = {}) {
        return { getItem: (t10) => e10[t10] || null, setItem: (t10, r10) => {
          e10[t10] = r10;
        }, removeItem: (t10) => {
          delete e10[t10];
        } };
      }
      let nb = { debug: !!(globalThis && sK() && globalThis.localStorage && "true" === globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")) };
      class ny extends Error {
        constructor(e10) {
          super(e10), this.isAcquireTimeout = true;
        }
      }
      class nw extends ny {
      }
      async function nv(e10, t10, r10) {
        let s10;
        nb.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire lock", e10, t10);
        let n10 = new globalThis.AbortController();
        t10 > 0 && (s10 = setTimeout(() => {
          n10.abort(), nb.debug && console.log("@supabase/gotrue-js: navigatorLock acquire timed out", e10);
        }, t10)), await Promise.resolve();
        try {
          return await globalThis.navigator.locks.request(e10, 0 === t10 ? { mode: "exclusive", ifAvailable: true } : { mode: "exclusive", signal: n10.signal }, async (n11) => {
            if (n11) {
              clearTimeout(s10), nb.debug && console.log("@supabase/gotrue-js: navigatorLock: acquired", e10, n11.name);
              try {
                return await r10();
              } finally {
                nb.debug && console.log("@supabase/gotrue-js: navigatorLock: released", e10, n11.name);
              }
            }
            if (0 === t10) throw nb.debug && console.log("@supabase/gotrue-js: navigatorLock: not immediately available", e10), new nw(`Acquiring an exclusive Navigator LockManager lock "${e10}" immediately failed`);
            if (nb.debug) try {
              let e11 = await globalThis.navigator.locks.query();
              console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(e11, null, "  "));
            } catch (e11) {
              console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", e11);
            }
            return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"), clearTimeout(s10), await r10();
          });
        } catch (i2) {
          if (t10 > 0 && clearTimeout(s10), (null == i2 ? void 0 : i2.name) === "AbortError" && t10 > 0) if (n10.signal.aborted) return nb.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire timeout, recovering by stealing lock", e10), console.warn(`@supabase/gotrue-js: Lock "${e10}" was not released within ${t10}ms. This may indicate an orphaned lock from a component unmount (e.g., React Strict Mode). Forcefully acquiring the lock to recover.`), await Promise.resolve().then(() => globalThis.navigator.locks.request(e10, { mode: "exclusive", steal: true }, async (t11) => {
            if (!t11) return console.warn("@supabase/gotrue-js: Navigator LockManager returned null lock even with steal: true"), await r10();
            nb.debug && console.log("@supabase/gotrue-js: navigatorLock: recovered (stolen)", e10, t11.name);
            try {
              return await r10();
            } finally {
              nb.debug && console.log("@supabase/gotrue-js: navigatorLock: released (stolen)", e10, t11.name);
            }
          }));
          else throw nb.debug && console.log("@supabase/gotrue-js: navigatorLock: lock was stolen by another request", e10), new nw(`Lock "${e10}" was released because another request stole it`);
          throw i2;
        }
      }
      function n_(e10) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(e10)) throw Error(`@supabase/auth-js: Address "${e10}" is invalid.`);
        return e10.toLowerCase();
      }
      class nk extends Error {
        constructor({ message: e10, code: t10, cause: r10, name: s10 }) {
          var n10;
          super(e10, { cause: r10 }), this.__isWebAuthnError = true, this.name = null != (n10 = null != s10 ? s10 : r10 instanceof Error ? r10.name : void 0) ? n10 : "Unknown Error", this.code = t10;
        }
      }
      class nS extends nk {
        constructor(e10, t10) {
          super({ code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: t10, message: e10 }), this.name = "WebAuthnUnknownError", this.originalError = t10;
        }
      }
      class nE {
        createNewAbortSignal() {
          if (this.controller) {
            let e11 = Error("Cancelling existing WebAuthn API call for new one");
            e11.name = "AbortError", this.controller.abort(e11);
          }
          let e10 = new AbortController();
          return this.controller = e10, e10.signal;
        }
        cancelCeremony() {
          if (this.controller) {
            let e10 = Error("Manually cancelling existing WebAuthn API call");
            e10.name = "AbortError", this.controller.abort(e10), this.controller = void 0;
          }
        }
      }
      let nT = new nE();
      function nR(e10) {
        if (!e10) throw Error("Credential creation options are required");
        if ("undefined" != typeof PublicKeyCredential && "parseCreationOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseCreationOptionsFromJSON) return PublicKeyCredential.parseCreationOptionsFromJSON(e10);
        let { challenge: t10, user: r10, excludeCredentials: s10 } = e10, n10 = tP(e10, ["challenge", "user", "excludeCredentials"]), i2 = sW(t10).buffer, a2 = Object.assign(Object.assign({}, r10), { id: sW(r10.id).buffer }), o2 = Object.assign(Object.assign({}, n10), { challenge: i2, user: a2 });
        if (s10 && s10.length > 0) {
          o2.excludeCredentials = Array(s10.length);
          for (let e11 = 0; e11 < s10.length; e11++) {
            let t11 = s10[e11];
            o2.excludeCredentials[e11] = Object.assign(Object.assign({}, t11), { id: sW(t11.id).buffer, type: t11.type || "public-key", transports: t11.transports });
          }
        }
        return o2;
      }
      function nO(e10) {
        if (!e10) throw Error("Credential request options are required");
        if ("undefined" != typeof PublicKeyCredential && "parseRequestOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseRequestOptionsFromJSON) return PublicKeyCredential.parseRequestOptionsFromJSON(e10);
        let { challenge: t10, allowCredentials: r10 } = e10, s10 = tP(e10, ["challenge", "allowCredentials"]), n10 = sW(t10).buffer, i2 = Object.assign(Object.assign({}, s10), { challenge: n10 });
        if (r10 && r10.length > 0) {
          i2.allowCredentials = Array(r10.length);
          for (let e11 = 0; e11 < r10.length; e11++) {
            let t11 = r10[e11];
            i2.allowCredentials[e11] = Object.assign(Object.assign({}, t11), { id: sW(t11.id).buffer, type: t11.type || "public-key", transports: t11.transports });
          }
        }
        return i2;
      }
      function nC(e10) {
        var t10;
        return "toJSON" in e10 && "function" == typeof e10.toJSON ? e10.toJSON() : { id: e10.id, rawId: e10.id, response: { attestationObject: sV(new Uint8Array(e10.response.attestationObject)), clientDataJSON: sV(new Uint8Array(e10.response.clientDataJSON)) }, type: "public-key", clientExtensionResults: e10.getClientExtensionResults(), authenticatorAttachment: null != (t10 = e10.authenticatorAttachment) ? t10 : void 0 };
      }
      function nP(e10) {
        var t10;
        if ("toJSON" in e10 && "function" == typeof e10.toJSON) return e10.toJSON();
        let r10 = e10.getClientExtensionResults(), s10 = e10.response;
        return { id: e10.id, rawId: e10.id, response: { authenticatorData: sV(new Uint8Array(s10.authenticatorData)), clientDataJSON: sV(new Uint8Array(s10.clientDataJSON)), signature: sV(new Uint8Array(s10.signature)), userHandle: s10.userHandle ? sV(new Uint8Array(s10.userHandle)) : void 0 }, type: "public-key", clientExtensionResults: r10, authenticatorAttachment: null != (t10 = e10.authenticatorAttachment) ? t10 : void 0 };
      }
      function nx(e10) {
        return "localhost" === e10 || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e10);
      }
      function nA() {
        var e10, t10;
        return !!(sz() && "PublicKeyCredential" in window && window.PublicKeyCredential && "credentials" in navigator && "function" == typeof (null == (e10 = null == navigator ? void 0 : navigator.credentials) ? void 0 : e10.create) && "function" == typeof (null == (t10 = null == navigator ? void 0 : navigator.credentials) ? void 0 : t10.get));
      }
      async function nj(e10) {
        try {
          let t10 = await navigator.credentials.create(e10);
          if (!t10) return { data: null, error: new nS("Empty credential response", t10) };
          if (!(t10 instanceof PublicKeyCredential)) return { data: null, error: new nS("Browser returned unexpected credential type", t10) };
          return { data: t10, error: null };
        } catch (t10) {
          return { data: null, error: function({ error: e11, options: t11 }) {
            var r10, s10, n10;
            let { publicKey: i2 } = t11;
            if (!i2) throw Error("options was missing required publicKey property");
            if ("AbortError" === e11.name) {
              if (t11.signal instanceof AbortSignal) return new nk({ message: "Registration ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: e11 });
            } else if ("ConstraintError" === e11.name) {
              if ((null == (r10 = i2.authenticatorSelection) ? void 0 : r10.requireResidentKey) === true) return new nk({ message: "Discoverable credentials were required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT", cause: e11 });
              else if ("conditional" === t11.mediation && (null == (s10 = i2.authenticatorSelection) ? void 0 : s10.userVerification) === "required") return new nk({ message: "User verification was required during automatic registration but it could not be performed", code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE", cause: e11 });
              else if ((null == (n10 = i2.authenticatorSelection) ? void 0 : n10.userVerification) === "required") return new nk({ message: "User verification was required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT", cause: e11 });
            } else if ("InvalidStateError" === e11.name) return new nk({ message: "The authenticator was previously registered", code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED", cause: e11 });
            else if ("NotAllowedError" === e11.name) return new nk({ message: e11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
            else if ("NotSupportedError" === e11.name) return new nk(0 === i2.pubKeyCredParams.filter((e12) => "public-key" === e12.type).length ? { message: 'No entry in pubKeyCredParams was of type "public-key"', code: "ERROR_MALFORMED_PUBKEYCREDPARAMS", cause: e11 } : { message: "No available authenticator supported any of the specified pubKeyCredParams algorithms", code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG", cause: e11 });
            else if ("SecurityError" === e11.name) {
              let t12 = window.location.hostname;
              if (!nx(t12)) return new nk({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: e11 });
              if (i2.rp.id !== t12) return new nk({ message: `The RP ID "${i2.rp.id}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: e11 });
            } else if ("TypeError" === e11.name) {
              if (i2.user.id.byteLength < 1 || i2.user.id.byteLength > 64) return new nk({ message: "User ID was not between 1 and 64 characters", code: "ERROR_INVALID_USER_ID_LENGTH", cause: e11 });
            } else if ("UnknownError" === e11.name) return new nk({ message: "The authenticator was unable to process the specified options, or could not create a new credential", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: e11 });
            return new nk({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
          }({ error: t10, options: e10 }) };
        }
      }
      async function nI(e10) {
        try {
          let t10 = await navigator.credentials.get(e10);
          if (!t10) return { data: null, error: new nS("Empty credential response", t10) };
          if (!(t10 instanceof PublicKeyCredential)) return { data: null, error: new nS("Browser returned unexpected credential type", t10) };
          return { data: t10, error: null };
        } catch (t10) {
          return { data: null, error: function({ error: e11, options: t11 }) {
            let { publicKey: r10 } = t11;
            if (!r10) throw Error("options was missing required publicKey property");
            if ("AbortError" === e11.name) {
              if (t11.signal instanceof AbortSignal) return new nk({ message: "Authentication ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: e11 });
            } else if ("NotAllowedError" === e11.name) return new nk({ message: e11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
            else if ("SecurityError" === e11.name) {
              let t12 = window.location.hostname;
              if (!nx(t12)) return new nk({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: e11 });
              if (r10.rpId !== t12) return new nk({ message: `The RP ID "${r10.rpId}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: e11 });
            } else if ("UnknownError" === e11.name) return new nk({ message: "The authenticator was unable to process the specified options, or could not create a new assertion signature", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: e11 });
            return new nk({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
          }({ error: t10, options: e10 }) };
        }
      }
      let nN = { hints: ["security-key"], authenticatorSelection: { authenticatorAttachment: "cross-platform", requireResidentKey: false, userVerification: "preferred", residentKey: "discouraged" }, attestation: "direct" }, n$ = { userVerification: "preferred", hints: ["security-key"], attestation: "direct" };
      function nL(...e10) {
        let t10 = (e11) => null !== e11 && "object" == typeof e11 && !Array.isArray(e11), r10 = (e11) => e11 instanceof ArrayBuffer || ArrayBuffer.isView(e11), s10 = {};
        for (let n10 of e10) if (n10) for (let e11 in n10) {
          let i2 = n10[e11];
          if (void 0 !== i2) if (Array.isArray(i2)) s10[e11] = i2;
          else if (r10(i2)) s10[e11] = i2;
          else if (t10(i2)) {
            let r11 = s10[e11];
            t10(r11) ? s10[e11] = nL(r11, i2) : s10[e11] = nL(i2);
          } else s10[e11] = i2;
        }
        return s10;
      }
      class nD {
        constructor(e10) {
          this.client = e10, this.enroll = this._enroll.bind(this), this.challenge = this._challenge.bind(this), this.verify = this._verify.bind(this), this.authenticate = this._authenticate.bind(this), this.register = this._register.bind(this);
        }
        async _enroll(e10) {
          return this.client.mfa.enroll(Object.assign(Object.assign({}, e10), { factorType: "webauthn" }));
        }
        async _challenge({ factorId: e10, webauthn: t10, friendlyName: r10, signal: s10 }, n10) {
          var i2, a2, o2, l2, u2;
          try {
            let { data: c2, error: h2 } = await this.client.mfa.challenge({ factorId: e10, webauthn: t10 });
            if (!c2) return { data: null, error: h2 };
            let d2 = null != s10 ? s10 : nT.createNewAbortSignal();
            if ("create" === c2.webauthn.type) {
              let { user: e11 } = c2.webauthn.credential_options.publicKey;
              if (!e11.name) if (r10) e11.name = `${e11.id}:${r10}`;
              else {
                let t11 = (await this.client.getUser()).data.user, r11 = (null == (i2 = null == t11 ? void 0 : t11.user_metadata) ? void 0 : i2.name) || (null == t11 ? void 0 : t11.email) || (null == t11 ? void 0 : t11.id) || "User";
                e11.name = `${e11.id}:${r11}`;
              }
              e11.displayName || (e11.displayName = e11.name);
            }
            switch (c2.webauthn.type) {
              case "create": {
                let t11 = (a2 = c2.webauthn.credential_options.publicKey, o2 = null == n10 ? void 0 : n10.create, nL(nN, a2, o2 || {})), { data: r11, error: s11 } = await nj({ publicKey: t11, signal: d2 });
                if (r11) return { data: { factorId: e10, challengeId: c2.id, webauthn: { type: c2.webauthn.type, credential_response: r11 } }, error: null };
                return { data: null, error: s11 };
              }
              case "request": {
                let t11 = (l2 = c2.webauthn.credential_options.publicKey, u2 = null == n10 ? void 0 : n10.request, nL(n$, l2, u2 || {})), { data: r11, error: s11 } = await nI(Object.assign(Object.assign({}, c2.webauthn.credential_options), { publicKey: t11, signal: d2 }));
                if (r11) return { data: { factorId: e10, challengeId: c2.id, webauthn: { type: c2.webauthn.type, credential_response: r11 } }, error: null };
                return { data: null, error: s11 };
              }
            }
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            return { data: null, error: new sE("Unexpected error in challenge", e11) };
          }
        }
        async _verify({ challengeId: e10, factorId: t10, webauthn: r10 }) {
          return this.client.mfa.verify({ factorId: t10, challengeId: e10, webauthn: r10 });
        }
        async _authenticate({ factorId: e10, webauthn: { rpId: t10 = "undefined" != typeof window ? window.location.hostname : void 0, rpOrigins: r10 = "undefined" != typeof window ? [window.location.origin] : void 0, signal: s10 } = {} }, n10) {
          if (!t10) return { data: null, error: new s_("rpId is required for WebAuthn authentication") };
          try {
            if (!nA()) return { data: null, error: new sE("Browser does not support WebAuthn", null) };
            let { data: i2, error: a2 } = await this.challenge({ factorId: e10, webauthn: { rpId: t10, rpOrigins: r10 }, signal: s10 }, { request: n10 });
            if (!i2) return { data: null, error: a2 };
            let { webauthn: o2 } = i2;
            return this._verify({ factorId: e10, challengeId: i2.challengeId, webauthn: { type: o2.type, rpId: t10, rpOrigins: r10, credential_response: o2.credential_response } });
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            return { data: null, error: new sE("Unexpected error in authenticate", e11) };
          }
        }
        async _register({ friendlyName: e10, webauthn: { rpId: t10 = "undefined" != typeof window ? window.location.hostname : void 0, rpOrigins: r10 = "undefined" != typeof window ? [window.location.origin] : void 0, signal: s10 } = {} }, n10) {
          if (!t10) return { data: null, error: new s_("rpId is required for WebAuthn registration") };
          try {
            if (!nA()) return { data: null, error: new sE("Browser does not support WebAuthn", null) };
            let { data: i2, error: a2 } = await this._enroll({ friendlyName: e10 });
            if (!i2) return await this.client.mfa.listFactors().then((t11) => {
              var r11;
              return null == (r11 = t11.data) ? void 0 : r11.all.find((t12) => "webauthn" === t12.factor_type && t12.friendly_name === e10 && "unverified" !== t12.status);
            }).then((e11) => e11 ? this.client.mfa.unenroll({ factorId: null == e11 ? void 0 : e11.id }) : void 0), { data: null, error: a2 };
            let { data: o2, error: l2 } = await this._challenge({ factorId: i2.id, friendlyName: i2.friendly_name, webauthn: { rpId: t10, rpOrigins: r10 }, signal: s10 }, { create: n10 });
            if (!o2) return { data: null, error: l2 };
            return this._verify({ factorId: i2.id, challengeId: o2.challengeId, webauthn: { rpId: t10, rpOrigins: r10, type: o2.webauthn.type, credential_response: o2.webauthn.credential_response } });
          } catch (e11) {
            if (sk(e11)) return { data: null, error: e11 };
            return { data: null, error: new sE("Unexpected error in register", e11) };
          }
        }
      }
      if ("object" != typeof globalThis) try {
        Object.defineProperty(Object.prototype, "__magic__", { get: function() {
          return this;
        }, configurable: true }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__;
      } catch (e10) {
        "undefined" != typeof self && (self.globalThis = self);
      }
      let nU = { url: "http://localhost:9999", storageKey: "supabase.auth.token", autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, headers: sb, flowType: "implicit", debug: false, hasCustomAuthorizationHeader: false, throwOnError: false, lockAcquireTimeout: 5e3, skipAutoInitialize: false, experimental: {} };
      async function nM(e10, t10, r10) {
        return await r10();
      }
      let nq = {};
      class nB {
        get jwks() {
          var e10, t10;
          return null != (t10 = null == (e10 = nq[this.storageKey]) ? void 0 : e10.jwks) ? t10 : { keys: [] };
        }
        set jwks(e10) {
          nq[this.storageKey] = Object.assign(Object.assign({}, nq[this.storageKey]), { jwks: e10 });
        }
        get jwks_cached_at() {
          var e10, t10;
          return null != (t10 = null == (e10 = nq[this.storageKey]) ? void 0 : e10.cachedAt) ? t10 : Number.MIN_SAFE_INTEGER;
        }
        set jwks_cached_at(e10) {
          nq[this.storageKey] = Object.assign(Object.assign({}, nq[this.storageKey]), { cachedAt: e10 });
        }
        constructor(e10) {
          var t10, r10, s10, n10;
          this.userStorage = null, this.memoryStorage = null, this.stateChangeEmitters = /* @__PURE__ */ new Map(), this.autoRefreshTicker = null, this.autoRefreshTickTimeout = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.initializePromise = null, this.detectSessionInUrl = true, this.hasCustomAuthorizationHeader = false, this.suppressGetSessionWarning = false, this.lockAcquired = false, this.pendingInLock = [], this.broadcastChannel = null, this.logger = console.log;
          let i2 = Object.assign(Object.assign({}, nU), e10);
          if (this.storageKey = i2.storageKey, this.instanceID = null != (t10 = nB.nextInstanceID[this.storageKey]) ? t10 : 0, nB.nextInstanceID[this.storageKey] = this.instanceID + 1, this.logDebugMessages = !!i2.debug, "function" == typeof i2.debug && (this.logger = i2.debug), this.instanceID > 0 && sz()) {
            let e11 = `${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;
            console.warn(e11), this.logDebugMessages && console.trace(e11);
          }
          if (this.persistSession = i2.persistSession, this.autoRefreshToken = i2.autoRefreshToken, this.experimental = null != (r10 = i2.experimental) ? r10 : {}, this.admin = new ng({ url: i2.url, headers: i2.headers, fetch: i2.fetch, experimental: this.experimental }), this.url = i2.url, this.headers = i2.headers, this.fetch = sF(i2.fetch), this.lock = i2.lock || nM, this.detectSessionInUrl = i2.detectSessionInUrl, this.flowType = i2.flowType, this.hasCustomAuthorizationHeader = i2.hasCustomAuthorizationHeader, this.throwOnError = i2.throwOnError, this.lockAcquireTimeout = i2.lockAcquireTimeout, i2.lock ? this.lock = i2.lock : this.persistSession && sz() && (null == (s10 = null == globalThis ? void 0 : globalThis.navigator) ? void 0 : s10.locks) ? this.lock = nv : this.lock = nM, this.jwks || (this.jwks = { keys: [] }, this.jwks_cached_at = Number.MIN_SAFE_INTEGER), this.mfa = { verify: this._verify.bind(this), enroll: this._enroll.bind(this), unenroll: this._unenroll.bind(this), challenge: this._challenge.bind(this), listFactors: this._listFactors.bind(this), challengeAndVerify: this._challengeAndVerify.bind(this), getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this), webauthn: new nD(this) }, this.oauth = { getAuthorizationDetails: this._getAuthorizationDetails.bind(this), approveAuthorization: this._approveAuthorization.bind(this), denyAuthorization: this._denyAuthorization.bind(this), listGrants: this._listOAuthGrants.bind(this), revokeGrant: this._revokeOAuthGrant.bind(this) }, this.passkey = { startRegistration: this._startPasskeyRegistration.bind(this), verifyRegistration: this._verifyPasskeyRegistration.bind(this), startAuthentication: this._startPasskeyAuthentication.bind(this), verifyAuthentication: this._verifyPasskeyAuthentication.bind(this), list: this._listPasskeys.bind(this), update: this._updatePasskey.bind(this), delete: this._deletePasskey.bind(this) }, this.persistSession ? (i2.storage ? this.storage = i2.storage : sK() ? this.storage = globalThis.localStorage : (this.memoryStorage = {}, this.storage = nm(this.memoryStorage)), i2.userStorage && (this.userStorage = i2.userStorage)) : (this.memoryStorage = {}, this.storage = nm(this.memoryStorage)), sz() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
            try {
              this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
            } catch (e11) {
              console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e11);
            }
            null == (n10 = this.broadcastChannel) || n10.addEventListener("message", async (e11) => {
              this._debug("received broadcast notification from other tab or client", e11);
              try {
                await this._notifyAllSubscribers(e11.data.event, e11.data.session, false);
              } catch (e12) {
                this._debug("#broadcastChannel", "error", e12);
              }
            });
          }
          i2.skipAutoInitialize || this.initialize().catch((e11) => {
            this._debug("#initialize()", "error", e11);
          });
        }
        isThrowOnErrorEnabled() {
          return this.throwOnError;
        }
        _returnResult(e10) {
          if (this.throwOnError && e10 && e10.error) throw e10.error;
          return e10;
        }
        _logPrefix() {
          return `GoTrueClient@${this.storageKey}:${this.instanceID} (${sm}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
        }
        _debug(...e10) {
          return this.logDebugMessages && this.logger(this._logPrefix(), ...e10), this;
        }
        async initialize() {
          return this.initializePromise || (this.initializePromise = (async () => await this._acquireLock(this.lockAcquireTimeout, async () => await this._initialize()))()), await this.initializePromise;
        }
        async _initialize() {
          var e10;
          try {
            let t10 = {}, r10 = "none";
            if (sz() && (t10 = function(e11) {
              let t11 = {}, r11 = new URL(e11);
              if (r11.hash && "#" === r11.hash[0]) try {
                new URLSearchParams(r11.hash.substring(1)).forEach((e12, r12) => {
                  t11[r12] = e12;
                });
              } catch (e12) {
              }
              return r11.searchParams.forEach((e12, r12) => {
                t11[r12] = e12;
              }), t11;
            }(window.location.href), this._isImplicitGrantCallback(t10) ? r10 = "implicit" : await this._isPKCECallback(t10) && (r10 = "pkce")), sz() && this.detectSessionInUrl && "none" !== r10) {
              let { data: s10, error: n10 } = await this._getSessionFromURL(t10, r10);
              if (n10) {
                if (this._debug("#_initialize()", "error detecting session from URL", n10), sk(n10) && "AuthImplicitGrantRedirectError" === n10.name) {
                  let t11 = null == (e10 = n10.details) ? void 0 : e10.code;
                }
                return { error: n10 };
              }
              let { session: i2, redirectType: a2 } = s10;
              return this._debug("#_initialize()", "detected session in URL", i2, "redirect type", a2), await this._saveSession(i2), setTimeout(async () => {
                "recovery" === a2 ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", i2) : await this._notifyAllSubscribers("SIGNED_IN", i2);
              }, 0), { error: null };
            }
            return await this._recoverAndRefresh(), { error: null };
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ error: e11 });
            return this._returnResult({ error: new sE("Unexpected error during initialization", e11) });
          } finally {
            await this._handleVisibilityChange(), this._debug("#_initialize()", "end");
          }
        }
        async signInAnonymously(e10) {
          var t10, r10, s10;
          try {
            let { data: n10, error: i2 } = await na(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { data: null != (r10 = null == (t10 = null == e10 ? void 0 : e10.options) ? void 0 : t10.data) ? r10 : {}, gotrue_meta_security: { captcha_token: null == (s10 = null == e10 ? void 0 : e10.options) ? void 0 : s10.captchaToken } }, xform: nl });
            if (i2 || !n10) return this._returnResult({ data: { user: null, session: null }, error: i2 });
            let a2 = n10.session, o2 = n10.user;
            return n10.session && (await this._saveSession(n10.session), await this._notifyAllSubscribers("SIGNED_IN", a2)), this._returnResult({ data: { user: o2, session: a2 }, error: null });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signUp(e10) {
          var t10, r10, s10;
          try {
            let n10;
            if ("email" in e10) {
              let { email: r11, password: s11, options: i3 } = e10, a3 = null, o3 = null;
              "pkce" === this.flowType && ([a3, o3] = await s4(this.storage, this.storageKey)), n10 = await na(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, redirectTo: null == i3 ? void 0 : i3.emailRedirectTo, body: { email: r11, password: s11, data: null != (t10 = null == i3 ? void 0 : i3.data) ? t10 : {}, gotrue_meta_security: { captcha_token: null == i3 ? void 0 : i3.captchaToken }, code_challenge: a3, code_challenge_method: o3 }, xform: nl });
            } else if ("phone" in e10) {
              let { phone: t11, password: i3, options: a3 } = e10;
              n10 = await na(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { phone: t11, password: i3, data: null != (r10 = null == a3 ? void 0 : a3.data) ? r10 : {}, channel: null != (s10 = null == a3 ? void 0 : a3.channel) ? s10 : "sms", gotrue_meta_security: { captcha_token: null == a3 ? void 0 : a3.captchaToken } }, xform: nl });
            } else throw new sP("You must provide either an email or phone number and a password");
            let { data: i2, error: a2 } = n10;
            if (a2 || !i2) return await sQ(this.storage, `${this.storageKey}-code-verifier`), this._returnResult({ data: { user: null, session: null }, error: a2 });
            let o2 = i2.session, l2 = i2.user;
            return i2.session && (await this._saveSession(i2.session), await this._notifyAllSubscribers("SIGNED_IN", o2)), this._returnResult({ data: { user: l2, session: o2 }, error: null });
          } catch (e11) {
            if (await sQ(this.storage, `${this.storageKey}-code-verifier`), sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithPassword(e10) {
          try {
            let t10;
            if ("email" in e10) {
              let { email: r11, password: s11, options: n10 } = e10;
              t10 = await na(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { email: r11, password: s11, gotrue_meta_security: { captcha_token: null == n10 ? void 0 : n10.captchaToken } }, xform: nu });
            } else if ("phone" in e10) {
              let { phone: r11, password: s11, options: n10 } = e10;
              t10 = await na(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { phone: r11, password: s11, gotrue_meta_security: { captcha_token: null == n10 ? void 0 : n10.captchaToken } }, xform: nu });
            } else throw new sP("You must provide either an email or phone number and a password");
            let { data: r10, error: s10 } = t10;
            if (s10) return this._returnResult({ data: { user: null, session: null }, error: s10 });
            if (!r10 || !r10.session || !r10.user) {
              let e11 = new sC();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return r10.session && (await this._saveSession(r10.session), await this._notifyAllSubscribers("SIGNED_IN", r10.session)), this._returnResult({ data: Object.assign({ user: r10.user, session: r10.session }, r10.weak_password ? { weakPassword: r10.weak_password } : null), error: s10 });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithOAuth(e10) {
          var t10, r10, s10, n10;
          return await this._handleProviderSignIn(e10.provider, { redirectTo: null == (t10 = e10.options) ? void 0 : t10.redirectTo, scopes: null == (r10 = e10.options) ? void 0 : r10.scopes, queryParams: null == (s10 = e10.options) ? void 0 : s10.queryParams, skipBrowserRedirect: null == (n10 = e10.options) ? void 0 : n10.skipBrowserRedirect });
        }
        async exchangeCodeForSession(e10) {
          return await this.initializePromise, this._acquireLock(this.lockAcquireTimeout, async () => this._exchangeCodeForSession(e10));
        }
        async signInWithWeb3(e10) {
          let { chain: t10 } = e10;
          switch (t10) {
            case "ethereum":
              return await this.signInWithEthereum(e10);
            case "solana":
              return await this.signInWithSolana(e10);
            default:
              throw Error(`@supabase/auth-js: Unsupported chain "${t10}"`);
          }
        }
        async signInWithEthereum(e10) {
          var t10, r10, s10, n10, i2, a2, o2, l2, u2, c2, h2, d2;
          let p2, f2;
          if ("message" in e10) p2 = e10.message, f2 = e10.signature;
          else {
            let c3, { chain: h3, wallet: g2, statement: m2, options: b2 } = e10;
            if (sz()) if ("object" == typeof g2) c3 = g2;
            else {
              let e11 = window;
              if ("ethereum" in e11 && "object" == typeof e11.ethereum && "request" in e11.ethereum && "function" == typeof e11.ethereum.request) c3 = e11.ethereum;
              else throw Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.");
            }
            else {
              if ("object" != typeof g2 || !(null == b2 ? void 0 : b2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
              c3 = g2;
            }
            let y2 = new URL(null != (t10 = null == b2 ? void 0 : b2.url) ? t10 : window.location.href), w2 = await c3.request({ method: "eth_requestAccounts" }).then((e11) => e11).catch(() => {
              throw Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid");
            });
            if (!w2 || 0 === w2.length) throw Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");
            let v2 = n_(w2[0]), _2 = null == (r10 = null == b2 ? void 0 : b2.signInWithEthereum) ? void 0 : r10.chainId;
            _2 || (_2 = parseInt(await c3.request({ method: "eth_chainId" }), 16)), p2 = function(e11) {
              var t11;
              let { chainId: r11, domain: s11, expirationTime: n11, issuedAt: i3 = /* @__PURE__ */ new Date(), nonce: a3, notBefore: o3, requestId: l3, resources: u3, scheme: c4, uri: h4, version: d3 } = e11;
              if (!Number.isInteger(r11)) throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r11}`);
              if (!s11) throw Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');
              if (a3 && a3.length < 8) throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a3}`);
              if (!h4) throw Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');
              if ("1" !== d3) throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d3}`);
              if (null == (t11 = e11.statement) ? void 0 : t11.includes("\n")) throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e11.statement}`);
              let p3 = n_(e11.address), f3 = c4 ? `${c4}://${s11}` : s11, g3 = e11.statement ? `${e11.statement}
` : "", m3 = `${f3} wants you to sign in with your Ethereum account:
${p3}

${g3}`, b3 = `URI: ${h4}
Version: ${d3}
Chain ID: ${r11}${a3 ? `
Nonce: ${a3}` : ""}
Issued At: ${i3.toISOString()}`;
              if (n11 && (b3 += `
Expiration Time: ${n11.toISOString()}`), o3 && (b3 += `
Not Before: ${o3.toISOString()}`), l3 && (b3 += `
Request ID: ${l3}`), u3) {
                let e12 = "\nResources:";
                for (let t12 of u3) {
                  if (!t12 || "string" != typeof t12) throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t12}`);
                  e12 += `
- ${t12}`;
                }
                b3 += e12;
              }
              return `${m3}
${b3}`;
            }({ domain: y2.host, address: v2, statement: m2, uri: y2.href, version: "1", chainId: _2, nonce: null == (s10 = null == b2 ? void 0 : b2.signInWithEthereum) ? void 0 : s10.nonce, issuedAt: null != (i2 = null == (n10 = null == b2 ? void 0 : b2.signInWithEthereum) ? void 0 : n10.issuedAt) ? i2 : /* @__PURE__ */ new Date(), expirationTime: null == (a2 = null == b2 ? void 0 : b2.signInWithEthereum) ? void 0 : a2.expirationTime, notBefore: null == (o2 = null == b2 ? void 0 : b2.signInWithEthereum) ? void 0 : o2.notBefore, requestId: null == (l2 = null == b2 ? void 0 : b2.signInWithEthereum) ? void 0 : l2.requestId, resources: null == (u2 = null == b2 ? void 0 : b2.signInWithEthereum) ? void 0 : u2.resources }), f2 = await c3.request({ method: "personal_sign", params: [(d2 = p2, "0x" + Array.from(new TextEncoder().encode(d2), (e11) => e11.toString(16).padStart(2, "0")).join("")), v2] });
          }
          try {
            let { data: t11, error: r11 } = await na(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "ethereum", message: p2, signature: f2 }, (null == (c2 = e10.options) ? void 0 : c2.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (h2 = e10.options) ? void 0 : h2.captchaToken } } : null), xform: nl });
            if (r11) throw r11;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new sC();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign({}, t11), error: r11 });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithSolana(e10) {
          var t10, r10, s10, n10, i2, a2, o2, l2, u2, c2, h2, d2;
          let p2, f2;
          if ("message" in e10) p2 = e10.message, f2 = e10.signature;
          else {
            let h3, { chain: d3, wallet: g2, statement: m2, options: b2 } = e10;
            if (sz()) if ("object" == typeof g2) h3 = g2;
            else {
              let e11 = window;
              if ("solana" in e11 && "object" == typeof e11.solana && ("signIn" in e11.solana && "function" == typeof e11.solana.signIn || "signMessage" in e11.solana && "function" == typeof e11.solana.signMessage)) h3 = e11.solana;
              else throw Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.");
            }
            else {
              if ("object" != typeof g2 || !(null == b2 ? void 0 : b2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
              h3 = g2;
            }
            let y2 = new URL(null != (t10 = null == b2 ? void 0 : b2.url) ? t10 : window.location.href);
            if ("signIn" in h3 && h3.signIn) {
              let e11, t11 = await h3.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, null == b2 ? void 0 : b2.signInWithSolana), { version: "1", domain: y2.host, uri: y2.href }), m2 ? { statement: m2 } : null));
              if (Array.isArray(t11) && t11[0] && "object" == typeof t11[0]) e11 = t11[0];
              else if (t11 && "object" == typeof t11 && "signedMessage" in t11 && "signature" in t11) e11 = t11;
              else throw Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
              if ("signedMessage" in e11 && "signature" in e11 && ("string" == typeof e11.signedMessage || e11.signedMessage instanceof Uint8Array) && e11.signature instanceof Uint8Array) p2 = "string" == typeof e11.signedMessage ? e11.signedMessage : new TextDecoder().decode(e11.signedMessage), f2 = e11.signature;
              else throw Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
            } else {
              if (!("signMessage" in h3) || "function" != typeof h3.signMessage || !("publicKey" in h3) || "object" != typeof h3 || !h3.publicKey || !("toBase58" in h3.publicKey) || "function" != typeof h3.publicKey.toBase58) throw Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
              p2 = [`${y2.host} wants you to sign in with your Solana account:`, h3.publicKey.toBase58(), ...m2 ? ["", m2, ""] : [""], "Version: 1", `URI: ${y2.href}`, `Issued At: ${null != (s10 = null == (r10 = null == b2 ? void 0 : b2.signInWithSolana) ? void 0 : r10.issuedAt) ? s10 : (/* @__PURE__ */ new Date()).toISOString()}`, ...(null == (n10 = null == b2 ? void 0 : b2.signInWithSolana) ? void 0 : n10.notBefore) ? [`Not Before: ${b2.signInWithSolana.notBefore}`] : [], ...(null == (i2 = null == b2 ? void 0 : b2.signInWithSolana) ? void 0 : i2.expirationTime) ? [`Expiration Time: ${b2.signInWithSolana.expirationTime}`] : [], ...(null == (a2 = null == b2 ? void 0 : b2.signInWithSolana) ? void 0 : a2.chainId) ? [`Chain ID: ${b2.signInWithSolana.chainId}`] : [], ...(null == (o2 = null == b2 ? void 0 : b2.signInWithSolana) ? void 0 : o2.nonce) ? [`Nonce: ${b2.signInWithSolana.nonce}`] : [], ...(null == (l2 = null == b2 ? void 0 : b2.signInWithSolana) ? void 0 : l2.requestId) ? [`Request ID: ${b2.signInWithSolana.requestId}`] : [], ...(null == (c2 = null == (u2 = null == b2 ? void 0 : b2.signInWithSolana) ? void 0 : u2.resources) ? void 0 : c2.length) ? ["Resources", ...b2.signInWithSolana.resources.map((e12) => `- ${e12}`)] : []].join("\n");
              let e11 = await h3.signMessage(new TextEncoder().encode(p2), "utf8");
              if (!e11 || !(e11 instanceof Uint8Array)) throw Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
              f2 = e11;
            }
          }
          try {
            let { data: t11, error: r11 } = await na(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "solana", message: p2, signature: sV(f2) }, (null == (h2 = e10.options) ? void 0 : h2.captchaToken) ? { gotrue_meta_security: { captcha_token: null == (d2 = e10.options) ? void 0 : d2.captchaToken } } : null), xform: nl });
            if (r11) throw r11;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new sC();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign({}, t11), error: r11 });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async _exchangeCodeForSession(e10) {
          let t10 = await sY(this.storage, `${this.storageKey}-code-verifier`), [r10, s10] = (null != t10 ? t10 : "").split("/");
          try {
            if (!r10 && "pkce" === this.flowType) throw new sj();
            let { data: t11, error: n10 } = await na(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, { headers: this.headers, body: { auth_code: e10, code_verifier: r10 }, xform: nl });
            if (await sQ(this.storage, `${this.storageKey}-code-verifier`), n10) throw n10;
            if (!t11 || !t11.session || !t11.user) {
              let e11 = new sC();
              return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: e11 });
            }
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("recovery" === s10 ? "PASSWORD_RECOVERY" : "SIGNED_IN", t11.session)), this._returnResult({ data: Object.assign(Object.assign({}, t11), { redirectType: null != s10 ? s10 : null }), error: n10 });
          } catch (e11) {
            if (await sQ(this.storage, `${this.storageKey}-code-verifier`), sk(e11)) return this._returnResult({ data: { user: null, session: null, redirectType: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithIdToken(e10) {
          try {
            let { options: t10, provider: r10, token: s10, access_token: n10, nonce: i2 } = e10, { data: a2, error: o2 } = await na(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, body: { provider: r10, id_token: s10, access_token: n10, nonce: i2, gotrue_meta_security: { captcha_token: null == t10 ? void 0 : t10.captchaToken } }, xform: nl });
            if (o2) return this._returnResult({ data: { user: null, session: null }, error: o2 });
            if (!a2 || !a2.session || !a2.user) {
              let e11 = new sC();
              return this._returnResult({ data: { user: null, session: null }, error: e11 });
            }
            return a2.session && (await this._saveSession(a2.session), await this._notifyAllSubscribers("SIGNED_IN", a2.session)), this._returnResult({ data: a2, error: o2 });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithOtp(e10) {
          var t10, r10, s10, n10, i2;
          try {
            if ("email" in e10) {
              let { email: s11, options: n11 } = e10, i3 = null, a2 = null;
              "pkce" === this.flowType && ([i3, a2] = await s4(this.storage, this.storageKey));
              let { error: o2 } = await na(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { email: s11, data: null != (t10 = null == n11 ? void 0 : n11.data) ? t10 : {}, create_user: null == (r10 = null == n11 ? void 0 : n11.shouldCreateUser) || r10, gotrue_meta_security: { captcha_token: null == n11 ? void 0 : n11.captchaToken }, code_challenge: i3, code_challenge_method: a2 }, redirectTo: null == n11 ? void 0 : n11.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: o2 });
            }
            if ("phone" in e10) {
              let { phone: t11, options: r11 } = e10, { data: a2, error: o2 } = await na(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { phone: t11, data: null != (s10 = null == r11 ? void 0 : r11.data) ? s10 : {}, create_user: null == (n10 = null == r11 ? void 0 : r11.shouldCreateUser) || n10, gotrue_meta_security: { captcha_token: null == r11 ? void 0 : r11.captchaToken }, channel: null != (i2 = null == r11 ? void 0 : r11.channel) ? i2 : "sms" } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == a2 ? void 0 : a2.message_id }, error: o2 });
            }
            throw new sP("You must provide either an email or phone number.");
          } catch (e11) {
            if (await sQ(this.storage, `${this.storageKey}-code-verifier`), sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async verifyOtp(e10) {
          var t10, r10;
          try {
            let s10, n10;
            "options" in e10 && (s10 = null == (t10 = e10.options) ? void 0 : t10.redirectTo, n10 = null == (r10 = e10.options) ? void 0 : r10.captchaToken);
            let { data: i2, error: a2 } = await na(this.fetch, "POST", `${this.url}/verify`, { headers: this.headers, body: Object.assign(Object.assign({}, e10), { gotrue_meta_security: { captcha_token: n10 } }), redirectTo: s10, xform: nl });
            if (a2) throw a2;
            if (!i2) throw Error("An error occurred on token verification.");
            let o2 = i2.session, l2 = i2.user;
            return (null == o2 ? void 0 : o2.access_token) && (await this._saveSession(o2), await this._notifyAllSubscribers("recovery" == e10.type ? "PASSWORD_RECOVERY" : "SIGNED_IN", o2)), this._returnResult({ data: { user: l2, session: o2 }, error: null });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async signInWithSSO(e10) {
          var t10, r10, s10, n10, i2;
          try {
            let a2 = null, o2 = null;
            "pkce" === this.flowType && ([a2, o2] = await s4(this.storage, this.storageKey));
            let l2 = await na(this.fetch, "POST", `${this.url}/sso`, { body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in e10 ? { provider_id: e10.providerId } : null), "domain" in e10 ? { domain: e10.domain } : null), { redirect_to: null != (r10 = null == (t10 = e10.options) ? void 0 : t10.redirectTo) ? r10 : void 0 }), (null == (s10 = null == e10 ? void 0 : e10.options) ? void 0 : s10.captchaToken) ? { gotrue_meta_security: { captcha_token: e10.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: a2, code_challenge_method: o2 }), headers: this.headers, xform: nh });
            return (null == (n10 = l2.data) ? void 0 : n10.url) && sz() && !(null == (i2 = e10.options) ? void 0 : i2.skipBrowserRedirect) && window.location.assign(l2.data.url), this._returnResult(l2);
          } catch (e11) {
            if (await sQ(this.storage, `${this.storageKey}-code-verifier`), sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async reauthenticate() {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._reauthenticate());
        }
        async _reauthenticate() {
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              if (r10) throw r10;
              if (!t10) throw new sR();
              let { error: s10 } = await na(this.fetch, "GET", `${this.url}/reauthenticate`, { headers: this.headers, jwt: t10.access_token });
              return this._returnResult({ data: { user: null, session: null }, error: s10 });
            });
          } catch (e10) {
            if (sk(e10)) return this._returnResult({ data: { user: null, session: null }, error: e10 });
            throw e10;
          }
        }
        async resend(e10) {
          try {
            let t10 = `${this.url}/resend`;
            if ("email" in e10) {
              let { email: r10, type: s10, options: n10 } = e10, { error: i2 } = await na(this.fetch, "POST", t10, { headers: this.headers, body: { email: r10, type: s10, gotrue_meta_security: { captcha_token: null == n10 ? void 0 : n10.captchaToken } }, redirectTo: null == n10 ? void 0 : n10.emailRedirectTo });
              return this._returnResult({ data: { user: null, session: null }, error: i2 });
            }
            if ("phone" in e10) {
              let { phone: r10, type: s10, options: n10 } = e10, { data: i2, error: a2 } = await na(this.fetch, "POST", t10, { headers: this.headers, body: { phone: r10, type: s10, gotrue_meta_security: { captcha_token: null == n10 ? void 0 : n10.captchaToken } } });
              return this._returnResult({ data: { user: null, session: null, messageId: null == i2 ? void 0 : i2.message_id }, error: a2 });
            }
            throw new sP("You must provide either an email or phone number and a type");
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async getSession() {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => this._useSession(async (e10) => e10));
        }
        async _acquireLock(e10, t10) {
          this._debug("#_acquireLock", "begin", e10);
          try {
            if (this.lockAcquired) {
              let e11 = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(), r10 = (async () => (await e11, await t10()))();
              return this.pendingInLock.push((async () => {
                try {
                  await r10;
                } catch (e12) {
                }
              })()), r10;
            }
            return await this.lock(`lock:${this.storageKey}`, e10, async () => {
              this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
              try {
                this.lockAcquired = true;
                let e11 = t10();
                for (this.pendingInLock.push((async () => {
                  try {
                    await e11;
                  } catch (e12) {
                  }
                })()), await e11; this.pendingInLock.length; ) {
                  let e12 = [...this.pendingInLock];
                  await Promise.all(e12), this.pendingInLock.splice(0, e12.length);
                }
                return await e11;
              } finally {
                this._debug("#_acquireLock", "lock released for storage key", this.storageKey), this.lockAcquired = false;
              }
            });
          } finally {
            this._debug("#_acquireLock", "end");
          }
        }
        async _useSession(e10) {
          this._debug("#_useSession", "begin");
          try {
            let t10 = await this.__loadSession();
            return await e10(t10);
          } finally {
            this._debug("#_useSession", "end");
          }
        }
        async __loadSession() {
          this._debug("#__loadSession()", "begin"), this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", Error().stack);
          try {
            let t10 = null, r10 = await sY(this.storage, this.storageKey);
            if (this._debug("#getSession()", "session from storage", r10), null !== r10 && (this._isValidSession(r10) ? t10 = r10 : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())), !t10) return { data: { session: null }, error: null };
            let s10 = !!t10.expires_at && 1e3 * t10.expires_at - Date.now() < 9e4;
            if (this._debug("#__loadSession()", `session has${s10 ? "" : " not"} expired`, "expires_at", t10.expires_at), !s10) {
              if (this.userStorage) {
                let e11 = await sY(this.userStorage, this.storageKey + "-user");
                (null == e11 ? void 0 : e11.user) ? t10.user = e11.user : t10.user = ne();
              }
              if (this.storage.isServer && t10.user && !t10.user.__isUserNotAvailableProxy) {
                var e10;
                let r11 = { value: this.suppressGetSessionWarning };
                t10.user = (e10 = t10.user, new Proxy(e10, { get: (e11, t11, s11) => {
                  if ("__isInsecureUserWarningProxy" === t11) return true;
                  if ("symbol" == typeof t11) {
                    let r12 = t11.toString();
                    if ("Symbol(Symbol.toPrimitive)" === r12 || "Symbol(Symbol.toStringTag)" === r12 || "Symbol(util.inspect.custom)" === r12 || "Symbol(nodejs.util.inspect.custom)" === r12) return Reflect.get(e11, t11, s11);
                  }
                  return r11.value || "string" != typeof t11 || (console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."), r11.value = true), Reflect.get(e11, t11, s11);
                } })), r11.value && (this.suppressGetSessionWarning = true);
              }
              return { data: { session: t10 }, error: null };
            }
            let { data: n10, error: i2 } = await this._callRefreshToken(t10.refresh_token);
            if (i2) return this._returnResult({ data: { session: null }, error: i2 });
            return this._returnResult({ data: { session: n10 }, error: null });
          } finally {
            this._debug("#__loadSession()", "end");
          }
        }
        async getUser(e10) {
          if (e10) return await this._getUser(e10);
          await this.initializePromise;
          let t10 = await this._acquireLock(this.lockAcquireTimeout, async () => await this._getUser());
          return t10.data.user && (this.suppressGetSessionWarning = true), t10;
        }
        async _getUser(e10) {
          try {
            if (e10) return await na(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: e10, xform: nc });
            return await this._useSession(async (e11) => {
              var t10, r10, s10;
              let { data: n10, error: i2 } = e11;
              if (i2) throw i2;
              return (null == (t10 = n10.session) ? void 0 : t10.access_token) || this.hasCustomAuthorizationHeader ? await na(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: null != (s10 = null == (r10 = n10.session) ? void 0 : r10.access_token) ? s10 : void 0, xform: nc }) : { data: { user: null }, error: new sR() };
            });
          } catch (e11) {
            if (sk(e11)) return sO(e11) && (await this._removeSession(), await sQ(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ data: { user: null }, error: e11 });
            throw e11;
          }
        }
        async updateUser(e10, t10 = {}) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._updateUser(e10, t10));
        }
        async _updateUser(e10, t10 = {}) {
          try {
            return await this._useSession(async (r10) => {
              let { data: s10, error: n10 } = r10;
              if (n10) throw n10;
              if (!s10.session) throw new sR();
              let i2 = s10.session, a2 = null, o2 = null;
              "pkce" === this.flowType && null != e10.email && ([a2, o2] = await s4(this.storage, this.storageKey));
              let { data: l2, error: u2 } = await na(this.fetch, "PUT", `${this.url}/user`, { headers: this.headers, redirectTo: null == t10 ? void 0 : t10.emailRedirectTo, body: Object.assign(Object.assign({}, e10), { code_challenge: a2, code_challenge_method: o2 }), jwt: i2.access_token, xform: nc });
              if (u2) throw u2;
              return i2.user = l2.user, await this._saveSession(i2), await this._notifyAllSubscribers("USER_UPDATED", i2), this._returnResult({ data: { user: i2.user }, error: null });
            });
          } catch (e11) {
            if (await sQ(this.storage, `${this.storageKey}-code-verifier`), sk(e11)) return this._returnResult({ data: { user: null }, error: e11 });
            throw e11;
          }
        }
        async setSession(e10) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._setSession(e10));
        }
        async _setSession(e10) {
          try {
            if (!e10.access_token || !e10.refresh_token) throw new sR();
            let t10 = Date.now() / 1e3, r10 = t10, s10 = true, n10 = null, { payload: i2 } = s0(e10.access_token);
            if (i2.exp && (s10 = (r10 = i2.exp) <= t10), s10) {
              let { data: t11, error: r11 } = await this._callRefreshToken(e10.refresh_token);
              if (r11) return this._returnResult({ data: { user: null, session: null }, error: r11 });
              if (!t11) return { data: { user: null, session: null }, error: null };
              n10 = t11;
            } else {
              let { data: s11, error: i3 } = await this._getUser(e10.access_token);
              if (i3) return this._returnResult({ data: { user: null, session: null }, error: i3 });
              n10 = { access_token: e10.access_token, refresh_token: e10.refresh_token, user: s11.user, token_type: "bearer", expires_in: r10 - t10, expires_at: r10 }, await this._saveSession(n10), await this._notifyAllSubscribers("SIGNED_IN", n10);
            }
            return this._returnResult({ data: { user: n10.user, session: n10 }, error: null });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: { session: null, user: null }, error: e11 });
            throw e11;
          }
        }
        async refreshSession(e10) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._refreshSession(e10));
        }
        async _refreshSession(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10;
              if (!e10) {
                let { data: s11, error: n11 } = t10;
                if (n11) throw n11;
                e10 = null != (r10 = s11.session) ? r10 : void 0;
              }
              if (!(null == e10 ? void 0 : e10.refresh_token)) throw new sR();
              let { data: s10, error: n10 } = await this._callRefreshToken(e10.refresh_token);
              return n10 ? this._returnResult({ data: { user: null, session: null }, error: n10 }) : s10 ? this._returnResult({ data: { user: s10.user, session: s10 }, error: null }) : this._returnResult({ data: { user: null, session: null }, error: null });
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
            throw e11;
          }
        }
        async _getSessionFromURL(e10, t10) {
          var r10;
          try {
            if (!sz()) throw new sx("No browser detected.");
            if (e10.error || e10.error_description || e10.error_code) throw new sx(e10.error_description || "Error in URL with unspecified error_description", { error: e10.error || "unspecified_error", code: e10.error_code || "unspecified_code" });
            switch (t10) {
              case "implicit":
                if ("pkce" === this.flowType) throw new sA("Not a valid PKCE flow url.");
                break;
              case "pkce":
                if ("implicit" === this.flowType) throw new sx("Not a valid implicit grant flow url.");
            }
            if ("pkce" === t10) {
              if (this._debug("#_initialize()", "begin", "is PKCE flow", true), !e10.code) throw new sA("No code detected.");
              let { data: t11, error: s11 } = await this._exchangeCodeForSession(e10.code);
              if (s11) throw s11;
              let n11 = new URL(window.location.href);
              return n11.searchParams.delete("code"), window.history.replaceState(window.history.state, "", n11.toString()), { data: { session: t11.session, redirectType: null != (r10 = t11.redirectType) ? r10 : null }, error: null };
            }
            let { provider_token: s10, provider_refresh_token: n10, access_token: i2, refresh_token: a2, expires_in: o2, expires_at: l2, token_type: u2 } = e10;
            if (!i2 || !o2 || !a2 || !u2) throw new sx("No session defined in URL");
            let c2 = Math.round(Date.now() / 1e3), h2 = parseInt(o2), d2 = c2 + h2;
            l2 && (d2 = parseInt(l2));
            let p2 = d2 - c2;
            1e3 * p2 <= 3e4 && console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${p2}s, should have been closer to ${h2}s`);
            let f2 = d2 - h2;
            c2 - f2 >= 120 ? console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", f2, d2, c2) : c2 - f2 < 0 && console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", f2, d2, c2);
            let { data: g2, error: m2 } = await this._getUser(i2);
            if (m2) throw m2;
            let b2 = { provider_token: s10, provider_refresh_token: n10, access_token: i2, expires_in: h2, expires_at: d2, refresh_token: a2, token_type: u2, user: g2.user };
            return window.location.hash = "", this._debug("#_getSessionFromURL()", "clearing window.location.hash"), this._returnResult({ data: { session: b2, redirectType: e10.type }, error: null });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: { session: null, redirectType: null }, error: e11 });
            throw e11;
          }
        }
        _isImplicitGrantCallback(e10) {
          return "function" == typeof this.detectSessionInUrl ? this.detectSessionInUrl(new URL(window.location.href), e10) : !!(e10.access_token || e10.error_description);
        }
        async _isPKCECallback(e10) {
          let t10 = await sY(this.storage, `${this.storageKey}-code-verifier`);
          return !!(e10.code && t10);
        }
        async signOut(e10 = { scope: "global" }) {
          return await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => await this._signOut(e10));
        }
        async _signOut({ scope: e10 } = { scope: "global" }) {
          return await this._useSession(async (t10) => {
            var r10;
            let { data: s10, error: n10 } = t10;
            if (n10 && !sO(n10)) return this._returnResult({ error: n10 });
            let i2 = null == (r10 = s10.session) ? void 0 : r10.access_token;
            if (i2) {
              let { error: t11 } = await this.admin.signOut(i2, e10);
              if (t11 && !(sk(t11) && "AuthApiError" === t11.name && (404 === t11.status || 401 === t11.status || 403 === t11.status) || sO(t11))) return this._returnResult({ error: t11 });
            }
            return "others" !== e10 && (await this._removeSession(), await sQ(this.storage, `${this.storageKey}-code-verifier`)), this._returnResult({ error: null });
          });
        }
        onAuthStateChange(e10) {
          let t10 = Symbol("auth-callback"), r10 = { id: t10, callback: e10, unsubscribe: () => {
            this._debug("#unsubscribe()", "state change callback with id removed", t10), this.stateChangeEmitters.delete(t10);
          } };
          return this._debug("#onAuthStateChange()", "registered callback with id", t10), this.stateChangeEmitters.set(t10, r10), (async () => {
            await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => {
              this._emitInitialSession(t10);
            });
          })(), { data: { subscription: r10 } };
        }
        async _emitInitialSession(e10) {
          return await this._useSession(async (t10) => {
            var r10, s10;
            try {
              let { data: { session: s11 }, error: n10 } = t10;
              if (n10) throw n10;
              await (null == (r10 = this.stateChangeEmitters.get(e10)) ? void 0 : r10.callback("INITIAL_SESSION", s11)), this._debug("INITIAL_SESSION", "callback id", e10, "session", s11);
            } catch (t11) {
              await (null == (s10 = this.stateChangeEmitters.get(e10)) ? void 0 : s10.callback("INITIAL_SESSION", null)), this._debug("INITIAL_SESSION", "callback id", e10, "error", t11), sO(t11) ? console.warn(t11) : console.error(t11);
            }
          });
        }
        async resetPasswordForEmail(e10, t10 = {}) {
          let r10 = null, s10 = null;
          "pkce" === this.flowType && ([r10, s10] = await s4(this.storage, this.storageKey, true));
          try {
            return await na(this.fetch, "POST", `${this.url}/recover`, { body: { email: e10, code_challenge: r10, code_challenge_method: s10, gotrue_meta_security: { captcha_token: t10.captchaToken } }, headers: this.headers, redirectTo: t10.redirectTo });
          } catch (e11) {
            if (await sQ(this.storage, `${this.storageKey}-code-verifier`), sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async getUserIdentities() {
          var e10;
          try {
            let { data: t10, error: r10 } = await this.getUser();
            if (r10) throw r10;
            return this._returnResult({ data: { identities: null != (e10 = t10.user.identities) ? e10 : [] }, error: null });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async linkIdentity(e10) {
          return "token" in e10 ? this.linkIdentityIdToken(e10) : this.linkIdentityOAuth(e10);
        }
        async linkIdentityOAuth(e10) {
          var t10;
          try {
            let { data: r10, error: s10 } = await this._useSession(async (t11) => {
              var r11, s11, n10, i2, a2;
              let { data: o2, error: l2 } = t11;
              if (l2) throw l2;
              let u2 = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, e10.provider, { redirectTo: null == (r11 = e10.options) ? void 0 : r11.redirectTo, scopes: null == (s11 = e10.options) ? void 0 : s11.scopes, queryParams: null == (n10 = e10.options) ? void 0 : n10.queryParams, skipBrowserRedirect: true });
              return await na(this.fetch, "GET", u2, { headers: this.headers, jwt: null != (a2 = null == (i2 = o2.session) ? void 0 : i2.access_token) ? a2 : void 0 });
            });
            if (s10) throw s10;
            return !sz() || (null == (t10 = e10.options) ? void 0 : t10.skipBrowserRedirect) || window.location.assign(null == r10 ? void 0 : r10.url), this._returnResult({ data: { provider: e10.provider, url: null == r10 ? void 0 : r10.url }, error: null });
          } catch (t11) {
            if (sk(t11)) return this._returnResult({ data: { provider: e10.provider, url: null }, error: t11 });
            throw t11;
          }
        }
        async linkIdentityIdToken(e10) {
          return await this._useSession(async (t10) => {
            var r10;
            try {
              let { error: s10, data: { session: n10 } } = t10;
              if (s10) throw s10;
              let { options: i2, provider: a2, token: o2, access_token: l2, nonce: u2 } = e10, { data: c2, error: h2 } = await na(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, jwt: null != (r10 = null == n10 ? void 0 : n10.access_token) ? r10 : void 0, body: { provider: a2, id_token: o2, access_token: l2, nonce: u2, link_identity: true, gotrue_meta_security: { captcha_token: null == i2 ? void 0 : i2.captchaToken } }, xform: nl });
              if (h2) return this._returnResult({ data: { user: null, session: null }, error: h2 });
              if (!c2 || !c2.session || !c2.user) return this._returnResult({ data: { user: null, session: null }, error: new sC() });
              return c2.session && (await this._saveSession(c2.session), await this._notifyAllSubscribers("USER_UPDATED", c2.session)), this._returnResult({ data: c2, error: h2 });
            } catch (e11) {
              if (await sQ(this.storage, `${this.storageKey}-code-verifier`), sk(e11)) return this._returnResult({ data: { user: null, session: null }, error: e11 });
              throw e11;
            }
          });
        }
        async unlinkIdentity(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10, s10;
              let { data: n10, error: i2 } = t10;
              if (i2) throw i2;
              return await na(this.fetch, "DELETE", `${this.url}/user/identities/${e10.identity_id}`, { headers: this.headers, jwt: null != (s10 = null == (r10 = n10.session) ? void 0 : r10.access_token) ? s10 : void 0 });
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _refreshAccessToken(e10) {
          let t10 = `#_refreshAccessToken(${e10.substring(0, 5)}...)`;
          this._debug(t10, "begin");
          try {
            var r10, s10;
            let n10 = Date.now();
            return await (r10 = async (r11) => (r11 > 0 && await s1(200 * Math.pow(2, r11 - 1)), this._debug(t10, "refreshing attempt", r11), await na(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, { body: { refresh_token: e10 }, headers: this.headers, xform: nl })), s10 = (e11, t11) => {
              let r11 = 200 * Math.pow(2, e11);
              return t11 && sN(t11) && Date.now() + r11 - n10 < 3e4;
            }, new Promise((e11, t11) => {
              (async () => {
                for (let n11 = 0; n11 < 1 / 0; n11++) try {
                  let t12 = await r10(n11);
                  if (!s10(n11, null, t12)) return void e11(t12);
                } catch (e12) {
                  if (!s10(n11, e12)) return void t11(e12);
                }
              })();
            }));
          } catch (e11) {
            if (this._debug(t10, "error", e11), sk(e11)) return this._returnResult({ data: { session: null, user: null }, error: e11 });
            throw e11;
          } finally {
            this._debug(t10, "end");
          }
        }
        _isValidSession(e10) {
          return "object" == typeof e10 && null !== e10 && "access_token" in e10 && "refresh_token" in e10 && "expires_at" in e10;
        }
        async _handleProviderSignIn(e10, t10) {
          let r10 = await this._getUrlForProvider(`${this.url}/authorize`, e10, { redirectTo: t10.redirectTo, scopes: t10.scopes, queryParams: t10.queryParams });
          return this._debug("#_handleProviderSignIn()", "provider", e10, "options", t10, "url", r10), sz() && !t10.skipBrowserRedirect && window.location.assign(r10), { data: { provider: e10, url: r10 }, error: null };
        }
        async _recoverAndRefresh() {
          var e10, t10;
          let r10 = "#_recoverAndRefresh()";
          this._debug(r10, "begin");
          try {
            let s10 = await sY(this.storage, this.storageKey);
            if (s10 && this.userStorage) {
              let t11 = await sY(this.userStorage, this.storageKey + "-user");
              !this.storage.isServer && Object.is(this.storage, this.userStorage) && !t11 && (t11 = { user: s10.user }, await sX(this.userStorage, this.storageKey + "-user", t11)), s10.user = null != (e10 = null == t11 ? void 0 : t11.user) ? e10 : ne();
            } else if (s10 && !s10.user && !s10.user) {
              let e11 = await sY(this.storage, this.storageKey + "-user");
              e11 && (null == e11 ? void 0 : e11.user) ? (s10.user = e11.user, await sQ(this.storage, this.storageKey + "-user"), await sX(this.storage, this.storageKey, s10)) : s10.user = ne();
            }
            if (this._debug(r10, "session from storage", s10), !this._isValidSession(s10)) {
              this._debug(r10, "session is not valid"), null !== s10 && await this._removeSession();
              return;
            }
            let n10 = (null != (t10 = s10.expires_at) ? t10 : 1 / 0) * 1e3 - Date.now() < 9e4;
            if (this._debug(r10, `session has${n10 ? "" : " not"} expired with margin of 90000s`), n10) {
              if (this.autoRefreshToken && s10.refresh_token) {
                let { error: e11 } = await this._callRefreshToken(s10.refresh_token);
                e11 && (console.error(e11), sN(e11) || (this._debug(r10, "refresh failed with a non-retryable error, removing the session", e11), await this._removeSession()));
              }
            } else if (s10.user && true === s10.user.__isUserNotAvailableProxy) try {
              let { data: e11, error: t11 } = await this._getUser(s10.access_token);
              !t11 && (null == e11 ? void 0 : e11.user) ? (s10.user = e11.user, await this._saveSession(s10), await this._notifyAllSubscribers("SIGNED_IN", s10)) : this._debug(r10, "could not get user data, skipping SIGNED_IN notification");
            } catch (e11) {
              console.error("Error getting user data:", e11), this._debug(r10, "error getting user data, skipping SIGNED_IN notification", e11);
            }
            else await this._notifyAllSubscribers("SIGNED_IN", s10);
          } catch (e11) {
            this._debug(r10, "error", e11), console.error(e11);
            return;
          } finally {
            this._debug(r10, "end");
          }
        }
        async _callRefreshToken(e10) {
          var t10, r10;
          if (!e10) throw new sR();
          if (this.refreshingDeferred) return this.refreshingDeferred.promise;
          let s10 = `#_callRefreshToken(${e10.substring(0, 5)}...)`;
          this._debug(s10, "begin");
          try {
            this.refreshingDeferred = new sZ();
            let { data: t11, error: r11 } = await this._refreshAccessToken(e10);
            if (r11) throw r11;
            if (!t11.session) throw new sR();
            await this._saveSession(t11.session), await this._notifyAllSubscribers("TOKEN_REFRESHED", t11.session);
            let s11 = { data: t11.session, error: null };
            return this.refreshingDeferred.resolve(s11), s11;
          } catch (e11) {
            if (this._debug(s10, "error", e11), sk(e11)) {
              let r11 = { data: null, error: e11 };
              return sN(e11) || await this._removeSession(), null == (t10 = this.refreshingDeferred) || t10.resolve(r11), r11;
            }
            throw null == (r10 = this.refreshingDeferred) || r10.reject(e11), e11;
          } finally {
            this.refreshingDeferred = null, this._debug(s10, "end");
          }
        }
        async _notifyAllSubscribers(e10, t10, r10 = true) {
          let s10 = `#_notifyAllSubscribers(${e10})`;
          this._debug(s10, "begin", t10, `broadcast = ${r10}`);
          try {
            this.broadcastChannel && r10 && this.broadcastChannel.postMessage({ event: e10, session: t10 });
            let s11 = [], n10 = Array.from(this.stateChangeEmitters.values()).map(async (r11) => {
              try {
                await r11.callback(e10, t10);
              } catch (e11) {
                s11.push(e11);
              }
            });
            if (await Promise.all(n10), s11.length > 0) {
              for (let e11 = 0; e11 < s11.length; e11 += 1) console.error(s11[e11]);
              throw s11[0];
            }
          } finally {
            this._debug(s10, "end");
          }
        }
        async _saveSession(e10) {
          this._debug("#_saveSession()", e10), this.suppressGetSessionWarning = true, await sQ(this.storage, `${this.storageKey}-code-verifier`);
          let t10 = Object.assign({}, e10), r10 = t10.user && true === t10.user.__isUserNotAvailableProxy;
          if (this.userStorage) {
            !r10 && t10.user && await sX(this.userStorage, this.storageKey + "-user", { user: t10.user });
            let e11 = Object.assign({}, t10);
            delete e11.user;
            let s10 = nt(e11);
            await sX(this.storage, this.storageKey, s10);
          } else {
            let e11 = nt(t10);
            await sX(this.storage, this.storageKey, e11);
          }
        }
        async _removeSession() {
          this._debug("#_removeSession()"), this.suppressGetSessionWarning = false, await sQ(this.storage, this.storageKey), await sQ(this.storage, this.storageKey + "-code-verifier"), await sQ(this.storage, this.storageKey + "-user"), this.userStorage && await sQ(this.userStorage, this.storageKey + "-user"), await this._notifyAllSubscribers("SIGNED_OUT", null);
        }
        _removeVisibilityChangedCallback() {
          this._debug("#_removeVisibilityChangedCallback()");
          let e10 = this.visibilityChangedCallback;
          this.visibilityChangedCallback = null;
          try {
            e10 && sz() && (null == window ? void 0 : window.removeEventListener) && window.removeEventListener("visibilitychange", e10);
          } catch (e11) {
            console.error("removing visibilitychange callback failed", e11);
          }
        }
        async _startAutoRefresh() {
          await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
          let e10 = setInterval(() => this._autoRefreshTokenTick(), 3e4);
          this.autoRefreshTicker = e10, e10 && "object" == typeof e10 && "function" == typeof e10.unref ? e10.unref() : "undefined" != typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(e10);
          let t10 = setTimeout(async () => {
            await this.initializePromise, await this._autoRefreshTokenTick();
          }, 0);
          this.autoRefreshTickTimeout = t10, t10 && "object" == typeof t10 && "function" == typeof t10.unref ? t10.unref() : "undefined" != typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(t10);
        }
        async _stopAutoRefresh() {
          this._debug("#_stopAutoRefresh()");
          let e10 = this.autoRefreshTicker;
          this.autoRefreshTicker = null, e10 && clearInterval(e10);
          let t10 = this.autoRefreshTickTimeout;
          this.autoRefreshTickTimeout = null, t10 && clearTimeout(t10);
        }
        async startAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._startAutoRefresh();
        }
        async stopAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._stopAutoRefresh();
        }
        async _autoRefreshTokenTick() {
          this._debug("#_autoRefreshTokenTick()", "begin");
          try {
            await this._acquireLock(0, async () => {
              try {
                let e10 = Date.now();
                try {
                  return await this._useSession(async (t10) => {
                    let { data: { session: r10 } } = t10;
                    if (!r10 || !r10.refresh_token || !r10.expires_at) return void this._debug("#_autoRefreshTokenTick()", "no session");
                    let s10 = Math.floor((1e3 * r10.expires_at - e10) / 3e4);
                    this._debug("#_autoRefreshTokenTick()", `access token expires in ${s10} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`), s10 <= 3 && await this._callRefreshToken(r10.refresh_token);
                  });
                } catch (e11) {
                  console.error("Auto refresh tick failed with error. This is likely a transient error.", e11);
                }
              } finally {
                this._debug("#_autoRefreshTokenTick()", "end");
              }
            });
          } catch (e10) {
            if (e10.isAcquireTimeout || e10 instanceof ny) this._debug("auto refresh token tick lock not available");
            else throw e10;
          }
        }
        async _handleVisibilityChange() {
          if (this._debug("#_handleVisibilityChange()"), !sz() || !(null == window ? void 0 : window.addEventListener)) return this.autoRefreshToken && this.startAutoRefresh(), false;
          try {
            this.visibilityChangedCallback = async () => {
              try {
                await this._onVisibilityChanged(false);
              } catch (e10) {
                this._debug("#visibilityChangedCallback", "error", e10);
              }
            }, null == window || window.addEventListener("visibilitychange", this.visibilityChangedCallback), await this._onVisibilityChanged(true);
          } catch (e10) {
            console.error("_handleVisibilityChange", e10);
          }
        }
        async _onVisibilityChanged(e10) {
          let t10 = `#_onVisibilityChanged(${e10})`;
          this._debug(t10, "visibilityState", document.visibilityState), "visible" === document.visibilityState ? (this.autoRefreshToken && this._startAutoRefresh(), e10 || (await this.initializePromise, await this._acquireLock(this.lockAcquireTimeout, async () => {
            if ("visible" !== document.visibilityState) return void this._debug(t10, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
            await this._recoverAndRefresh();
          }))) : "hidden" === document.visibilityState && this.autoRefreshToken && this._stopAutoRefresh();
        }
        async _getUrlForProvider(e10, t10, r10) {
          let s10 = [`provider=${encodeURIComponent(t10)}`];
          if ((null == r10 ? void 0 : r10.redirectTo) && s10.push(`redirect_to=${encodeURIComponent(r10.redirectTo)}`), (null == r10 ? void 0 : r10.scopes) && s10.push(`scopes=${encodeURIComponent(r10.scopes)}`), "pkce" === this.flowType) {
            let [e11, t11] = await s4(this.storage, this.storageKey), r11 = new URLSearchParams({ code_challenge: `${encodeURIComponent(e11)}`, code_challenge_method: `${encodeURIComponent(t11)}` });
            s10.push(r11.toString());
          }
          if (null == r10 ? void 0 : r10.queryParams) {
            let e11 = new URLSearchParams(r10.queryParams);
            s10.push(e11.toString());
          }
          return (null == r10 ? void 0 : r10.skipBrowserRedirect) && s10.push(`skip_http_redirect=${r10.skipBrowserRedirect}`), `${e10}?${s10.join("&")}`;
        }
        async _unenroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10;
              let { data: s10, error: n10 } = t10;
              return n10 ? this._returnResult({ data: null, error: n10 }) : await na(this.fetch, "DELETE", `${this.url}/factors/${e10.factorId}`, { headers: this.headers, jwt: null == (r10 = null == s10 ? void 0 : s10.session) ? void 0 : r10.access_token });
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _enroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10, s10;
              let { data: n10, error: i2 } = t10;
              if (i2) return this._returnResult({ data: null, error: i2 });
              let a2 = Object.assign({ friendly_name: e10.friendlyName, factor_type: e10.factorType }, "phone" === e10.factorType ? { phone: e10.phone } : "totp" === e10.factorType ? { issuer: e10.issuer } : {}), { data: o2, error: l2 } = await na(this.fetch, "POST", `${this.url}/factors`, { body: a2, headers: this.headers, jwt: null == (r10 = null == n10 ? void 0 : n10.session) ? void 0 : r10.access_token });
              return l2 ? this._returnResult({ data: null, error: l2 }) : ("totp" === e10.factorType && "totp" === o2.type && (null == (s10 = null == o2 ? void 0 : o2.totp) ? void 0 : s10.qr_code) && (o2.totp.qr_code = `data:image/svg+xml;utf-8,${o2.totp.qr_code}`), this._returnResult({ data: o2, error: null }));
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _verify(e10) {
          return this._acquireLock(this.lockAcquireTimeout, async () => {
            try {
              return await this._useSession(async (t10) => {
                var r10;
                let { data: s10, error: n10 } = t10;
                if (n10) return this._returnResult({ data: null, error: n10 });
                let i2 = Object.assign({ challenge_id: e10.challengeId }, "webauthn" in e10 ? { webauthn: Object.assign(Object.assign({}, e10.webauthn), { credential_response: "create" === e10.webauthn.type ? nC(e10.webauthn.credential_response) : nP(e10.webauthn.credential_response) }) } : { code: e10.code }), { data: a2, error: o2 } = await na(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/verify`, { body: i2, headers: this.headers, jwt: null == (r10 = null == s10 ? void 0 : s10.session) ? void 0 : r10.access_token });
                return o2 ? this._returnResult({ data: null, error: o2 }) : (await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + a2.expires_in }, a2)), await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", a2), this._returnResult({ data: a2, error: o2 }));
              });
            } catch (e11) {
              if (sk(e11)) return this._returnResult({ data: null, error: e11 });
              throw e11;
            }
          });
        }
        async _challenge(e10) {
          return this._acquireLock(this.lockAcquireTimeout, async () => {
            try {
              return await this._useSession(async (t10) => {
                var r10;
                let { data: s10, error: n10 } = t10;
                if (n10) return this._returnResult({ data: null, error: n10 });
                let i2 = await na(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/challenge`, { body: e10, headers: this.headers, jwt: null == (r10 = null == s10 ? void 0 : s10.session) ? void 0 : r10.access_token });
                if (i2.error) return i2;
                let { data: a2 } = i2;
                if ("webauthn" !== a2.type) return { data: a2, error: null };
                switch (a2.webauthn.type) {
                  case "create":
                    return { data: Object.assign(Object.assign({}, a2), { webauthn: Object.assign(Object.assign({}, a2.webauthn), { credential_options: Object.assign(Object.assign({}, a2.webauthn.credential_options), { publicKey: nR(a2.webauthn.credential_options.publicKey) }) }) }), error: null };
                  case "request":
                    return { data: Object.assign(Object.assign({}, a2), { webauthn: Object.assign(Object.assign({}, a2.webauthn), { credential_options: Object.assign(Object.assign({}, a2.webauthn.credential_options), { publicKey: nO(a2.webauthn.credential_options.publicKey) }) }) }), error: null };
                }
              });
            } catch (e11) {
              if (sk(e11)) return this._returnResult({ data: null, error: e11 });
              throw e11;
            }
          });
        }
        async _challengeAndVerify(e10) {
          let { data: t10, error: r10 } = await this._challenge({ factorId: e10.factorId });
          return r10 ? this._returnResult({ data: null, error: r10 }) : await this._verify({ factorId: e10.factorId, challengeId: t10.id, code: e10.code });
        }
        async _listFactors() {
          var e10;
          let { data: { user: t10 }, error: r10 } = await this.getUser();
          if (r10) return { data: null, error: r10 };
          let s10 = { all: [], phone: [], totp: [], webauthn: [] };
          for (let r11 of null != (e10 = null == t10 ? void 0 : t10.factors) ? e10 : []) s10.all.push(r11), "verified" === r11.status && s10[r11.factor_type].push(r11);
          return { data: s10, error: null };
        }
        async _getAuthenticatorAssuranceLevel(e10) {
          var t10, r10, s10, n10;
          if (e10) try {
            let { payload: s11 } = s0(e10), n11 = null;
            s11.aal && (n11 = s11.aal);
            let i3 = n11, { data: { user: a3 }, error: o3 } = await this.getUser(e10);
            if (o3) return this._returnResult({ data: null, error: o3 });
            (null != (r10 = null == (t10 = null == a3 ? void 0 : a3.factors) ? void 0 : t10.filter((e11) => "verified" === e11.status)) ? r10 : []).length > 0 && (i3 = "aal2");
            let l3 = s11.amr || [];
            return { data: { currentLevel: n11, nextLevel: i3, currentAuthenticationMethods: l3 }, error: null };
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
          let { data: { session: i2 }, error: a2 } = await this.getSession();
          if (a2) return this._returnResult({ data: null, error: a2 });
          if (!i2) return { data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] }, error: null };
          let { payload: o2 } = s0(i2.access_token), l2 = null;
          o2.aal && (l2 = o2.aal);
          let u2 = l2;
          return (null != (n10 = null == (s10 = i2.user.factors) ? void 0 : s10.filter((e11) => "verified" === e11.status)) ? n10 : []).length > 0 && (u2 = "aal2"), { data: { currentLevel: l2, nextLevel: u2, currentAuthenticationMethods: o2.amr || [] }, error: null };
        }
        async _getAuthorizationDetails(e10) {
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: s10 } = t10;
              return s10 ? this._returnResult({ data: null, error: s10 }) : r10 ? await na(this.fetch, "GET", `${this.url}/oauth/authorizations/${e10}`, { headers: this.headers, jwt: r10.access_token, xform: (e11) => ({ data: e11, error: null }) }) : this._returnResult({ data: null, error: new sR() });
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _approveAuthorization(e10, t10) {
          try {
            return await this._useSession(async (r10) => {
              let { data: { session: s10 }, error: n10 } = r10;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!s10) return this._returnResult({ data: null, error: new sR() });
              let i2 = await na(this.fetch, "POST", `${this.url}/oauth/authorizations/${e10}/consent`, { headers: this.headers, jwt: s10.access_token, body: { action: "approve" }, xform: (e11) => ({ data: e11, error: null }) });
              return i2.data && i2.data.redirect_url && sz() && !(null == t10 ? void 0 : t10.skipBrowserRedirect) && window.location.assign(i2.data.redirect_url), i2;
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _denyAuthorization(e10, t10) {
          try {
            return await this._useSession(async (r10) => {
              let { data: { session: s10 }, error: n10 } = r10;
              if (n10) return this._returnResult({ data: null, error: n10 });
              if (!s10) return this._returnResult({ data: null, error: new sR() });
              let i2 = await na(this.fetch, "POST", `${this.url}/oauth/authorizations/${e10}/consent`, { headers: this.headers, jwt: s10.access_token, body: { action: "deny" }, xform: (e11) => ({ data: e11, error: null }) });
              return i2.data && i2.data.redirect_url && sz() && !(null == t10 ? void 0 : t10.skipBrowserRedirect) && window.location.assign(i2.data.redirect_url), i2;
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _listOAuthGrants() {
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              return r10 ? this._returnResult({ data: null, error: r10 }) : t10 ? await na(this.fetch, "GET", `${this.url}/user/oauth/grants`, { headers: this.headers, jwt: t10.access_token, xform: (e11) => ({ data: e11, error: null }) }) : this._returnResult({ data: null, error: new sR() });
            });
          } catch (e10) {
            if (sk(e10)) return this._returnResult({ data: null, error: e10 });
            throw e10;
          }
        }
        async _revokeOAuthGrant(e10) {
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: s10 } = t10;
              return s10 ? this._returnResult({ data: null, error: s10 }) : r10 ? (await na(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, { headers: this.headers, jwt: r10.access_token, query: { client_id: e10.clientId }, noResolveJson: true }), { data: {}, error: null }) : this._returnResult({ data: null, error: new sR() });
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async fetchJwk(e10, t10 = { keys: [] }) {
          let r10 = t10.keys.find((t11) => t11.kid === e10);
          if (r10) return r10;
          let s10 = Date.now();
          if ((r10 = this.jwks.keys.find((t11) => t11.kid === e10)) && this.jwks_cached_at + 6e5 > s10) return r10;
          let { data: n10, error: i2 } = await na(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, { headers: this.headers });
          if (i2) throw i2;
          return n10.keys && 0 !== n10.keys.length && (this.jwks = n10, this.jwks_cached_at = s10, r10 = n10.keys.find((t11) => t11.kid === e10)) ? r10 : null;
        }
        async getClaims(e10, t10 = {}) {
          try {
            let r10 = e10;
            if (!r10) {
              let { data: e11, error: t11 } = await this.getSession();
              if (t11 || !e11.session) return this._returnResult({ data: null, error: t11 });
              r10 = e11.session.access_token;
            }
            let { header: s10, payload: n10, signature: i2, raw: { header: a2, payload: o2 } } = s0(r10);
            (null == t10 ? void 0 : t10.allowExpired) || function(e11) {
              if (!e11) throw Error("Missing exp claim");
              if (e11 <= Math.floor(Date.now() / 1e3)) throw Error("JWT has expired");
            }(n10.exp);
            let l2 = !s10.alg || s10.alg.startsWith("HS") || !s10.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(s10.kid, (null == t10 ? void 0 : t10.keys) ? { keys: t10.keys } : null == t10 ? void 0 : t10.jwks);
            if (!l2) {
              let { error: e11 } = await this.getUser(r10);
              if (e11) throw e11;
              return { data: { claims: n10, header: s10, signature: i2 }, error: null };
            }
            let u2 = function(e11) {
              switch (e11) {
                case "RS256":
                  return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
                case "ES256":
                  return { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };
                default:
                  throw Error("Invalid alg claim");
              }
            }(s10.alg), c2 = await crypto.subtle.importKey("jwk", l2, u2, true, ["verify"]);
            if (!await crypto.subtle.verify(u2, c2, i2, function(e11) {
              let t11 = [];
              return function(e12, t12) {
                for (let r11 = 0; r11 < e12.length; r11 += 1) {
                  let s11 = e12.charCodeAt(r11);
                  if (s11 > 55295 && s11 <= 56319) {
                    let t13 = (s11 - 55296) * 1024 & 65535;
                    s11 = (e12.charCodeAt(r11 + 1) - 56320 & 65535 | t13) + 65536, r11 += 1;
                  }
                  !function(e13, t13) {
                    if (e13 <= 127) return t13(e13);
                    if (e13 <= 2047) {
                      t13(192 | e13 >> 6), t13(128 | 63 & e13);
                      return;
                    }
                    if (e13 <= 65535) {
                      t13(224 | e13 >> 12), t13(128 | e13 >> 6 & 63), t13(128 | 63 & e13);
                      return;
                    }
                    if (e13 <= 1114111) {
                      t13(240 | e13 >> 18), t13(128 | e13 >> 12 & 63), t13(128 | e13 >> 6 & 63), t13(128 | 63 & e13);
                      return;
                    }
                    throw Error(`Unrecognized Unicode codepoint: ${e13.toString(16)}`);
                  }(s11, t12);
                }
              }(e11, (e12) => t11.push(e12)), new Uint8Array(t11);
            }(`${a2}.${o2}`))) throw new sL("Invalid JWT signature");
            return { data: { claims: n10, header: s10, signature: i2 }, error: null };
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async signInWithPasskey(e10) {
          var t10, r10, s10;
          s7(this.experimental);
          try {
            if (!nA()) return this._returnResult({ data: null, error: new sE("Browser does not support WebAuthn", null) });
            let { data: n10, error: i2 } = await this._startPasskeyAuthentication({ options: { captchaToken: null == (t10 = null == e10 ? void 0 : e10.options) ? void 0 : t10.captchaToken } });
            if (i2 || !n10) return this._returnResult({ data: null, error: i2 });
            let a2 = nO(n10.options), o2 = null != (s10 = null == (r10 = null == e10 ? void 0 : e10.options) ? void 0 : r10.signal) ? s10 : nT.createNewAbortSignal(), { data: l2, error: u2 } = await nI({ publicKey: a2, signal: o2 });
            if (u2 || !l2) return this._returnResult({ data: null, error: null != u2 ? u2 : new sE("WebAuthn ceremony failed", null) });
            let c2 = nP(l2);
            return this._verifyPasskeyAuthentication({ challengeId: n10.challenge_id, credential: c2 });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async registerPasskey(e10) {
          var t10, r10;
          s7(this.experimental);
          try {
            if (!nA()) return this._returnResult({ data: null, error: new sE("Browser does not support WebAuthn", null) });
            let { data: s10, error: n10 } = await this._startPasskeyRegistration();
            if (n10 || !s10) return this._returnResult({ data: null, error: n10 });
            let i2 = nR(s10.options), a2 = null != (r10 = null == (t10 = null == e10 ? void 0 : e10.options) ? void 0 : t10.signal) ? r10 : nT.createNewAbortSignal(), { data: o2, error: l2 } = await nj({ publicKey: i2, signal: a2 });
            if (l2 || !o2) return this._returnResult({ data: null, error: null != l2 ? l2 : new sE("WebAuthn ceremony failed", null) });
            let u2 = nC(o2);
            return this._verifyPasskeyRegistration({ challengeId: s10.challenge_id, credential: u2 });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _startPasskeyRegistration() {
          s7(this.experimental);
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              if (r10) return this._returnResult({ data: null, error: r10 });
              if (!t10) return this._returnResult({ data: null, error: new sR() });
              let { data: s10, error: n10 } = await na(this.fetch, "POST", `${this.url}/passkeys/registration/options`, { headers: this.headers, jwt: t10.access_token, body: {} });
              return n10 ? this._returnResult({ data: null, error: n10 }) : this._returnResult({ data: s10, error: null });
            });
          } catch (e10) {
            if (sk(e10)) return this._returnResult({ data: null, error: e10 });
            throw e10;
          }
        }
        async _verifyPasskeyRegistration(e10) {
          s7(this.experimental);
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: s10 } = t10;
              if (s10) return this._returnResult({ data: null, error: s10 });
              if (!r10) return this._returnResult({ data: null, error: new sR() });
              let { data: n10, error: i2 } = await na(this.fetch, "POST", `${this.url}/passkeys/registration/verify`, { headers: this.headers, jwt: r10.access_token, body: { challenge_id: e10.challengeId, credential: e10.credential } });
              return i2 ? this._returnResult({ data: null, error: i2 }) : this._returnResult({ data: n10, error: null });
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _startPasskeyAuthentication(e10) {
          var t10;
          s7(this.experimental);
          try {
            let { data: r10, error: s10 } = await na(this.fetch, "POST", `${this.url}/passkeys/authentication/options`, { headers: this.headers, body: { gotrue_meta_security: { captcha_token: null == (t10 = null == e10 ? void 0 : e10.options) ? void 0 : t10.captchaToken } } });
            if (s10) return this._returnResult({ data: null, error: s10 });
            return this._returnResult({ data: r10, error: null });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _verifyPasskeyAuthentication(e10) {
          s7(this.experimental);
          try {
            let { data: t10, error: r10 } = await na(this.fetch, "POST", `${this.url}/passkeys/authentication/verify`, { headers: this.headers, body: { challenge_id: e10.challengeId, credential: e10.credential }, xform: nl });
            if (r10) return this._returnResult({ data: null, error: r10 });
            return t10.session && (await this._saveSession(t10.session), await this._notifyAllSubscribers("SIGNED_IN", t10.session)), this._returnResult({ data: t10, error: null });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _listPasskeys() {
          s7(this.experimental);
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              if (r10) return this._returnResult({ data: null, error: r10 });
              if (!t10) return this._returnResult({ data: null, error: new sR() });
              let { data: s10, error: n10 } = await na(this.fetch, "GET", `${this.url}/passkeys`, { headers: this.headers, jwt: t10.access_token, xform: (e11) => ({ data: e11, error: null }) });
              return n10 ? this._returnResult({ data: null, error: n10 }) : this._returnResult({ data: s10, error: null });
            });
          } catch (e10) {
            if (sk(e10)) return this._returnResult({ data: null, error: e10 });
            throw e10;
          }
        }
        async _updatePasskey(e10) {
          s7(this.experimental);
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: s10 } = t10;
              if (s10) return this._returnResult({ data: null, error: s10 });
              if (!r10) return this._returnResult({ data: null, error: new sR() });
              let { data: n10, error: i2 } = await na(this.fetch, "PATCH", `${this.url}/passkeys/${e10.passkeyId}`, { headers: this.headers, jwt: r10.access_token, body: { friendly_name: e10.friendlyName } });
              return i2 ? this._returnResult({ data: null, error: i2 }) : this._returnResult({ data: n10, error: null });
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
        async _deletePasskey(e10) {
          s7(this.experimental);
          try {
            return await this._useSession(async (t10) => {
              let { data: { session: r10 }, error: s10 } = t10;
              if (s10) return this._returnResult({ data: null, error: s10 });
              if (!r10) return this._returnResult({ data: null, error: new sR() });
              let { error: n10 } = await na(this.fetch, "DELETE", `${this.url}/passkeys/${e10.passkeyId}`, { headers: this.headers, jwt: r10.access_token, noResolveJson: true });
              return n10 ? this._returnResult({ data: null, error: n10 }) : this._returnResult({ data: null, error: null });
            });
          } catch (e11) {
            if (sk(e11)) return this._returnResult({ data: null, error: e11 });
            throw e11;
          }
        }
      }
      nB.nextInstanceID = {};
      let nH = nB, nW = "";
      nW = "undefined" != typeof Deno ? "deno" : "undefined" != typeof document ? "web" : "undefined" != typeof navigator && "ReactNative" === navigator.product ? "react-native" : "node";
      let nV = { headers: { "X-Client-Info": `supabase-js-${nW}/2.105.1` } }, nz = { schema: "public" }, nG = { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: "implicit" }, nK = {};
      function nF(e10) {
        return (nF = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e11) {
          return typeof e11;
        } : function(e11) {
          return e11 && "function" == typeof Symbol && e11.constructor === Symbol && e11 !== Symbol.prototype ? "symbol" : typeof e11;
        })(e10);
      }
      function nJ(e10, t10) {
        var r10 = Object.keys(e10);
        if (Object.getOwnPropertySymbols) {
          var s10 = Object.getOwnPropertySymbols(e10);
          t10 && (s10 = s10.filter(function(t11) {
            return Object.getOwnPropertyDescriptor(e10, t11).enumerable;
          })), r10.push.apply(r10, s10);
        }
        return r10;
      }
      function nX(e10) {
        for (var t10 = 1; t10 < arguments.length; t10++) {
          var r10 = null != arguments[t10] ? arguments[t10] : {};
          t10 % 2 ? nJ(Object(r10), true).forEach(function(t11) {
            !function(e11, t12, r11) {
              var s10;
              (s10 = function(e12, t13) {
                if ("object" != nF(e12) || !e12) return e12;
                var r12 = e12[Symbol.toPrimitive];
                if (void 0 !== r12) {
                  var s11 = r12.call(e12, t13 || "default");
                  if ("object" != nF(s11)) return s11;
                  throw TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === t13 ? String : Number)(e12);
              }(t12, "string"), (t12 = "symbol" == nF(s10) ? s10 : s10 + "") in e11) ? Object.defineProperty(e11, t12, { value: r11, enumerable: true, configurable: true, writable: true }) : e11[t12] = r11;
            }(e10, t11, r10[t11]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e10, Object.getOwnPropertyDescriptors(r10)) : nJ(Object(r10)).forEach(function(t11) {
            Object.defineProperty(e10, t11, Object.getOwnPropertyDescriptor(r10, t11));
          });
        }
        return e10;
      }
      let nY = (e10) => e10 ? (...t10) => e10(...t10) : (...e11) => fetch(...e11), nQ = () => Headers, nZ = (e10, t10, r10) => {
        let s10 = nY(r10), n10 = nQ();
        return async (r11, i2) => {
          var a2;
          let o2 = null != (a2 = await t10()) ? a2 : e10, l2 = new n10(null == i2 ? void 0 : i2.headers);
          return l2.has("apikey") || l2.set("apikey", e10), l2.has("Authorization") || l2.set("Authorization", `Bearer ${o2}`), s10(r11, nX(nX({}, i2), {}, { headers: l2 }));
        };
      };
      var n0 = class extends nH {
        constructor(e10) {
          super(e10);
        }
      }, n1 = class {
        constructor(e10, t10, r10) {
          var s10, n10, i2;
          this.supabaseUrl = e10, this.supabaseKey = t10;
          let a2 = function(e11) {
            let t11 = null == e11 ? void 0 : e11.trim();
            if (!t11) throw Error("supabaseUrl is required.");
            if (!t11.match(/^https?:\/\//i)) throw Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
            try {
              return new URL(t11.endsWith("/") ? t11 : t11 + "/");
            } catch (e12) {
              throw Error("Invalid supabaseUrl: Provided URL is malformed.");
            }
          }(e10);
          if (!t10) throw Error("supabaseKey is required.");
          this.realtimeUrl = new URL("realtime/v1", a2), this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws"), this.authUrl = new URL("auth/v1", a2), this.storageUrl = new URL("storage/v1", a2), this.functionsUrl = new URL("functions/v1", a2);
          let o2 = `sb-${a2.hostname.split(".")[0]}-auth-token`, l2 = function(e11, t11) {
            var r11, s11;
            let { db: n11, auth: i3, realtime: a3, global: o3 } = e11, { db: l3, auth: u2, realtime: c2, global: h2 } = t11, d2 = { db: nX(nX({}, l3), n11), auth: nX(nX({}, u2), i3), realtime: nX(nX({}, c2), a3), storage: {}, global: nX(nX(nX({}, h2), o3), {}, { headers: nX(nX({}, null != (r11 = null == h2 ? void 0 : h2.headers) ? r11 : {}), null != (s11 = null == o3 ? void 0 : o3.headers) ? s11 : {}) }), accessToken: async () => "" };
            return e11.accessToken ? d2.accessToken = e11.accessToken : delete d2.accessToken, d2;
          }(null != r10 ? r10 : {}, { db: nz, realtime: nK, auth: nX(nX({}, nG), {}, { storageKey: o2 }), global: nV });
          this.storageKey = null != (s10 = l2.auth.storageKey) ? s10 : "", this.headers = null != (n10 = l2.global.headers) ? n10 : {}, l2.accessToken ? (this.accessToken = l2.accessToken, this.auth = new Proxy({}, { get: (e11, t11) => {
            throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t11)} is not possible`);
          } })) : this.auth = this._initSupabaseAuthClient(null != (i2 = l2.auth) ? i2 : {}, this.headers, l2.global.fetch), this.fetch = nZ(t10, this._getAccessToken.bind(this), l2.global.fetch), this.realtime = this._initRealtimeClient(nX({ headers: this.headers, accessToken: this._getAccessToken.bind(this), fetch: this.fetch }, l2.realtime)), this.accessToken && Promise.resolve(this.accessToken()).then((e11) => this.realtime.setAuth(e11)).catch((e11) => console.warn("Failed to set initial Realtime auth token:", e11)), this.rest = new tJ(new URL("rest/v1", a2).href, { headers: this.headers, schema: l2.db.schema, fetch: this.fetch, timeout: l2.db.timeout, urlLengthLimit: l2.db.urlLengthLimit }), this.storage = new sg(this.storageUrl.href, this.headers, this.fetch, null == r10 ? void 0 : r10.storage), l2.accessToken || this._listenForAuthEvents();
        }
        get functions() {
          return new t$(this.functionsUrl.href, { headers: this.headers, customFetch: this.fetch });
        }
        from(e10) {
          return this.rest.from(e10);
        }
        schema(e10) {
          return this.rest.schema(e10);
        }
        rpc(e10, t10 = {}, r10 = { head: false, get: false, count: void 0 }) {
          return this.rest.rpc(e10, t10, r10);
        }
        channel(e10, t10 = { config: {} }) {
          return this.realtime.channel(e10, t10);
        }
        getChannels() {
          return this.realtime.getChannels();
        }
        removeChannel(e10) {
          return this.realtime.removeChannel(e10);
        }
        removeAllChannels() {
          return this.realtime.removeAllChannels();
        }
        async _getAccessToken() {
          var e10, t10;
          if (this.accessToken) return await this.accessToken();
          let { data: r10 } = await this.auth.getSession();
          return null != (e10 = null == (t10 = r10.session) ? void 0 : t10.access_token) ? e10 : this.supabaseKey;
        }
        _initSupabaseAuthClient({ autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r10, storage: s10, userStorage: n10, storageKey: i2, flowType: a2, lock: o2, debug: l2, throwOnError: u2, experimental: c2 }, h2, d2) {
          let p2 = { Authorization: `Bearer ${this.supabaseKey}`, apikey: `${this.supabaseKey}` };
          return new n0({ url: this.authUrl.href, headers: nX(nX({}, p2), h2), storageKey: i2, autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r10, storage: s10, userStorage: n10, flowType: a2, lock: o2, debug: l2, throwOnError: u2, experimental: c2, fetch: d2, hasCustomAuthorizationHeader: Object.keys(this.headers).some((e11) => "authorization" === e11.toLowerCase()) });
        }
        _initRealtimeClient(e10) {
          return new rx(this.realtimeUrl.href, nX(nX({}, e10), {}, { params: nX(nX({}, { apikey: this.supabaseKey }), null == e10 ? void 0 : e10.params) }));
        }
        _listenForAuthEvents() {
          return this.auth.onAuthStateChange((e10, t10) => {
            this._handleTokenChanged(e10, "CLIENT", null == t10 ? void 0 : t10.access_token);
          });
        }
        _handleTokenChanged(e10, t10, r10) {
          ("TOKEN_REFRESHED" === e10 || "SIGNED_IN" === e10) && this.changedAccessToken !== r10 ? (this.changedAccessToken = r10, this.realtime.setAuth(r10)) : "SIGNED_OUT" === e10 && (this.realtime.setAuth(), "STORAGE" == t10 && this.auth.signOut(), this.changedAccessToken = void 0);
        }
      };
      let n2 = (e10, t10, r10) => new n1(e10, t10, r10);
      if (function() {
        if ("undefined" != typeof window) return false;
        let e10 = globalThis.process;
        if (!e10) return false;
        let t10 = e10.version;
        if (null == t10) return false;
        let r10 = t10.match(/^v(\d+)\./);
        return !!r10 && 18 >= parseInt(r10[1], 10);
      }() && console.warn("\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217"), "undefined" != typeof process && process.env?.npm_package_name) {
        let e10 = process.env.npm_package_name;
        ["@supabase/auth-helpers-nextjs", "@supabase/auth-helpers-react", "@supabase/auth-helpers-remix", "@supabase/auth-helpers-sveltekit"].includes(e10) && console.warn(`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551 \u26A0\uFE0F  IMPORTANT: Package Consolidation Notice                                \u2551
\u2551                                                                            \u2551
\u2551 The ${e10.padEnd(35)} package name is deprecated.  \u2551
\u2551                                                                            \u2551
\u2551 You are now using @supabase/ssr - a unified solution for all frameworks.  \u2551
\u2551                                                                            \u2551
\u2551 The auth-helpers packages have been consolidated into @supabase/ssr       \u2551
\u2551 to provide better maintenance and consistent APIs across frameworks.      \u2551
\u2551                                                                            \u2551
\u2551 Please update your package.json to use @supabase/ssr directly:            \u2551
\u2551   npm uninstall ${e10.padEnd(42)} \u2551
\u2551   npm install @supabase/ssr                                               \u2551
\u2551                                                                            \u2551
\u2551 For more information, visit:                                              \u2551
\u2551 https://supabase.com/docs/guides/auth/server-side                         \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
    `);
      }
      var n3 = r(356).Buffer;
      let n5 = /^\/dashboard\//, n4 = /^\/api\/padres\//, n6 = [/^\/api\/admin\//, /^\/api\/calificaciones/, /^\/api\/asistencias/, /^\/api\/perfil/, /^\/api\/horarios/, /^\/api\/grupos/, /^\/api\/storage\/upload/, /^\/api\/auth\/logout/, /^\/api\/auth\/reset-password/], n8 = ["/api/admin/config", "/api/admin/admision-config"];
      function n9(e10, t10) {
        return Object.entries({ "X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-XSS-Protection": "0", "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()", "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload", "Content-Security-Policy": `default-src 'self'; script-src 'self' 'nonce-${t10}'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'` }).forEach(([t11, r10]) => e10.headers.set(t11, r10)), e10.headers.set("x-nonce", t10), e10;
      }
      async function n7(e10) {
        let { pathname: t10 } = e10.nextUrl, r10 = e10.method, s10 = n3.from(crypto.randomUUID()).toString("base64"), n10 = X.next({ request: e10 }), i2 = function(e11, t11, r11) {
          if (!e11 || !t11) throw Error(`Your project's URL and Key are required to create a Supabase client!

Check your Supabase project's API settings to find these values

https://supabase.com/dashboard/project/_/settings/api`);
          let { storage: s11, getAll: n11, setAll: i3, setItems: a3, removedItems: o2 } = function(e12, t12) {
            let r12, s12, n12 = e12.cookies ?? null, i4 = e12.cookieEncoding, a4 = {}, o3 = {};
            if (n12) if ("get" in n12) {
              let e13 = async (e14) => {
                let t13 = e14.flatMap((e15) => [e15, ...Array.from({ length: 5 }).map((t14, r14) => `${e15}.${r14}`)]), r13 = [];
                for (let e15 = 0; e15 < t13.length; e15 += 1) {
                  let s13 = await n12.get(t13[e15]);
                  (s13 || "string" == typeof s13) && r13.push({ name: t13[e15], value: s13 });
                }
                return r13;
              };
              if (r12 = async (t13) => await e13(t13), "set" in n12 && "remove" in n12) s12 = async (e14) => {
                for (let t13 = 0; t13 < e14.length; t13 += 1) {
                  let { name: r13, value: s13, options: i5 } = e14[t13];
                  s13 ? await n12.set(r13, s13, i5) : await n12.remove(r13, i5);
                }
              };
              else if (t12) s12 = async () => {
                console.warn("@supabase/ssr: createServerClient was configured without set and remove cookie methods, but the client needs to set cookies. This can lead to issues such as random logouts, early session termination or increased token refresh requests. If in NextJS, check your middleware.ts file, route handlers and server actions for correctness. Consider switching to the getAll and setAll cookie methods instead of get, set and remove which are deprecated and can be difficult to use correctly.");
              };
              else throw Error("@supabase/ssr: createBrowserClient requires configuring a getAll and setAll cookie method (deprecated: alternatively both get, set and remove can be used)");
            } else if ("getAll" in n12) if (r12 = async () => await n12.getAll(), "setAll" in n12) s12 = n12.setAll;
            else if (t12) s12 = async () => {
              console.warn("@supabase/ssr: createServerClient was configured without the setAll cookie method, but the client needs to set cookies. This can lead to issues such as random logouts, early session termination or increased token refresh requests. If in NextJS, check your middleware.ts file, route handlers and server actions for correctness.");
            };
            else throw Error("@supabase/ssr: createBrowserClient requires configuring both getAll and setAll cookie methods (deprecated: alternatively both get, set and remove can be used)");
            else throw Error(`@supabase/ssr: ${t12 ? "createServerClient" : "createBrowserClient"} requires configuring getAll and setAll cookie methods (deprecated: alternatively use get, set and remove).${tm() ? " As this is called in a browser runtime, consider removing the cookies option object to use the document.cookie API automatically." : ""}`);
            else if (!t12 && tm()) {
              let e13 = () => {
                let e14 = (0, tg.qg)(document.cookie);
                return Object.keys(e14).map((t13) => ({ name: t13, value: e14[t13] ?? "" }));
              };
              r12 = () => e13(), s12 = (e14) => {
                e14.forEach(({ name: e15, value: t13, options: r13 }) => {
                  document.cookie = (0, tg.lK)(e15, t13, r13);
                });
              };
            } else if (t12) throw Error("@supabase/ssr: createServerClient must be initialized with cookie options that specify getAll and setAll functions (deprecated, not recommended: alternatively use get, set and remove)");
            else r12 = () => [], s12 = () => {
              throw Error("@supabase/ssr: createBrowserClient in non-browser runtimes (including Next.js pre-rendering mode) was not initialized cookie options that specify getAll and setAll functions (deprecated: alternatively use get, set and remove), but they were needed");
            };
            return t12 ? { getAll: r12, setAll: s12, setItems: a4, removedItems: o3, storage: { isServer: true, getItem: async (e13) => {
              if ("string" == typeof a4[e13]) return a4[e13];
              if (o3[e13]) return null;
              let t13 = await r12([e13]), s13 = await t_(e13, async (e14) => {
                let r13 = t13?.find(({ name: t14 }) => t14 === e14) || null;
                return r13 ? r13.value : null;
              });
              if (!s13) return null;
              let n13 = s13;
              return "string" == typeof s13 && s13.startsWith(tO) && (n13 = tR(s13.substring(tO.length))), n13;
            }, setItem: async (t13, n13) => {
              t13.endsWith("-code-verifier") && await tC({ getAll: r12, setAll: s12, setItems: { [t13]: n13 }, removedItems: {} }, { cookieOptions: e12?.cookieOptions ?? null, cookieEncoding: i4 }), a4[t13] = n13, delete o3[t13];
            }, removeItem: async (e13) => {
              delete a4[e13], o3[e13] = true;
            } } } : { getAll: r12, setAll: s12, setItems: a4, removedItems: o3, storage: { isServer: false, getItem: async (e13) => {
              let t13 = await r12([e13]), s13 = await t_(e13, async (e14) => {
                let r13 = t13?.find(({ name: t14 }) => t14 === e14) || null;
                return r13 ? r13.value : null;
              });
              if (!s13) return null;
              let n13 = s13;
              return s13.startsWith(tO) && (n13 = tR(s13.substring(tO.length))), n13;
            }, setItem: async (t13, n13) => {
              let a5 = await r12([t13]), o4 = new Set((a5?.map(({ name: e13 }) => e13) || []).filter((e13) => tw(e13, t13))), l3 = n13;
              "base64url" === i4 && (l3 = tO + tT(n13));
              let u2 = tv(t13, l3);
              u2.forEach(({ name: e13 }) => {
                o4.delete(e13);
              });
              let c2 = { ...tb, ...e12?.cookieOptions, maxAge: 0 }, h2 = { ...tb, ...e12?.cookieOptions, maxAge: tb.maxAge };
              delete c2.name, delete h2.name;
              let d2 = [...[...o4].map((e13) => ({ name: e13, value: "", options: c2 })), ...u2.map(({ name: e13, value: t14 }) => ({ name: e13, value: t14, options: h2 }))];
              d2.length > 0 && await s12(d2, {});
            }, removeItem: async (t13) => {
              let n13 = await r12([t13]), i5 = (n13?.map(({ name: e13 }) => e13) || []).filter((e13) => tw(e13, t13)), a5 = { ...tb, ...e12?.cookieOptions, maxAge: 0 };
              delete a5.name, i5.length > 0 && await s12(i5.map((e13) => ({ name: e13, value: "", options: a5 })), {});
            } } };
          }({ ...r11, cookieEncoding: r11?.cookieEncoding ?? "base64url" }, true), l2 = n2(e11, t11, { ...r11, global: { ...r11?.global, headers: { ...r11?.global?.headers, "X-Client-Info": "supabase-ssr/0.10.2 createServerClient" } }, auth: { ...r11?.cookieOptions?.name ? { storageKey: r11.cookieOptions.name } : null, ...r11?.auth, flowType: "pkce", autoRefreshToken: false, detectSessionInUrl: false, persistSession: true, skipAutoInitialize: true, storage: s11, ...r11?.cookies && "encode" in r11.cookies && "tokens-only" === r11.cookies.encode ? { userStorage: r11?.auth?.userStorage ?? /* @__PURE__ */ function(e12 = {}) {
            return { getItem: (t12) => e12[t12] || null, setItem: (t12, r12) => {
              e12[t12] = r12;
            }, removeItem: (t12) => {
              delete e12[t12];
            } };
          }() } : null } });
          return l2.auth.onAuthStateChange(async (e12) => {
            (Object.keys(a3).length > 0 || Object.keys(o2).length > 0) && ("SIGNED_IN" === e12 || "TOKEN_REFRESHED" === e12 || "USER_UPDATED" === e12 || "PASSWORD_RECOVERY" === e12 || "SIGNED_OUT" === e12 || "MFA_CHALLENGE_VERIFIED" === e12) && await tC({ getAll: n11, setAll: i3, setItems: a3, removedItems: o2 }, { cookieOptions: r11?.cookieOptions ?? null, cookieEncoding: r11?.cookieEncoding ?? "base64url" });
          }), l2;
        }("https://TU_PROYECTO.supabase.co", "tu_anon_key_aqui", { cookies: { getAll: () => e10.cookies.getAll(), setAll(t11) {
          t11.forEach(({ name: t12, value: r11 }) => e10.cookies.set(t12, r11)), n10 = X.next({ request: e10 }), t11.forEach(({ name: e11, value: t12, options: r11 }) => n10.cookies.set(e11, t12, r11));
        } } }), { data: { user: a2 } } = await i2.auth.getUser();
        if (n5.test(t10) && !a2) {
          let r11 = new URL("/login", e10.url);
          return r11.searchParams.set("redirectTo", t10), n9(X.redirect(r11), s10);
        }
        return n4.test(t10) && !a2 || n6.some((e11) => e11.test(t10)) && !a2 || n8.some((e11) => t10.startsWith(e11)) && "GET" !== r10 && !a2 ? n9(X.json({ error: "No autorizado" }, { status: 401 }), s10) : n9(n10, s10);
      }
      let ie = { matcher: ["/((?!_next/static|_next/image|favicon\\.ico|icons/|images/|logo\\.png|.*\\.svg).*)"] }, it = (Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 }), { ...h }), ir = it.middleware || it.default, is = "/middleware";
      if ("function" != typeof ir) throw Object.defineProperty(Error(`The Middleware "${is}" must export a \`middleware\` or a \`default\` function`), "__NEXT_ERROR_CODE", { value: "E120", enumerable: false, configurable: true });
      function ii(e10) {
        return th({ ...e10, page: is, handler: async (...e11) => {
          try {
            return await ir(...e11);
          } catch (n10) {
            let t10 = e11[0], r10 = new URL(t10.url), s10 = r10.pathname + r10.search;
            throw await g(n10, { path: s10, method: t10.method, headers: Object.fromEntries(t10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/middleware", routeType: "middleware", revalidateReason: void 0 }), n10;
          }
        } });
      }
    }, 35: (e, t) => {
      "use strict";
      var r = Array.isArray, s = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), i = (Symbol.for("react.fragment"), Symbol.for("react.strict_mode"), Symbol.for("react.profiler"), Symbol.for("react.forward_ref"), Symbol.for("react.suspense"), Symbol.for("react.memo"), Symbol.for("react.lazy")), a = Symbol.iterator;
      Object.prototype.hasOwnProperty, Object.assign;
      var o = /\/+/g;
      function l(e2, t2) {
        var r2, s2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, s2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return s2[e3];
        })) : t2.toString(36);
      }
      function u() {
      }
    }, 201: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { getTestReqInfo: function() {
        return a;
      }, withRequest: function() {
        return i;
      } });
      let s = new (r(521)).AsyncLocalStorage();
      function n(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let s2 = t2.url(e2);
        return { url: s2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function i(e2, t2, r2) {
        let i2 = n(e2, t2);
        return i2 ? s.run(i2, r2) : r2();
      }
      function a(e2, t2) {
        let r2 = s.getStore();
        return r2 || (e2 && t2 ? n(e2, t2) : void 0);
      }
    }, 280: (e, t, r) => {
      var s;
      (() => {
        var n = { 226: function(n2, i2) {
          !function(a2, o) {
            "use strict";
            var l = "function", u = "undefined", c = "object", h = "string", d = "major", p = "model", f = "name", g = "type", m = "vendor", b = "version", y = "architecture", w = "console", v = "mobile", _ = "tablet", k = "smarttv", S = "wearable", E = "embedded", T = "Amazon", R = "Apple", O = "ASUS", C = "BlackBerry", P = "Browser", x = "Chrome", A = "Firefox", j = "Google", I = "Huawei", N = "Microsoft", $ = "Motorola", L = "Opera", D = "Samsung", U = "Sharp", M = "Sony", q = "Xiaomi", B = "Zebra", H = "Facebook", W = "Chromium OS", V = "Mac OS", z = function(e2, t2) {
              var r2 = {};
              for (var s2 in e2) t2[s2] && t2[s2].length % 2 == 0 ? r2[s2] = t2[s2].concat(e2[s2]) : r2[s2] = e2[s2];
              return r2;
            }, G = function(e2) {
              for (var t2 = {}, r2 = 0; r2 < e2.length; r2++) t2[e2[r2].toUpperCase()] = e2[r2];
              return t2;
            }, K = function(e2, t2) {
              return typeof e2 === h && -1 !== F(t2).indexOf(F(e2));
            }, F = function(e2) {
              return e2.toLowerCase();
            }, J = function(e2, t2) {
              if (typeof e2 === h) return e2 = e2.replace(/^\s\s*/, ""), typeof t2 === u ? e2 : e2.substring(0, 350);
            }, X = function(e2, t2) {
              for (var r2, s2, n3, i3, a3, u2, h2 = 0; h2 < t2.length && !a3; ) {
                var d2 = t2[h2], p2 = t2[h2 + 1];
                for (r2 = s2 = 0; r2 < d2.length && !a3 && d2[r2]; ) if (a3 = d2[r2++].exec(e2)) for (n3 = 0; n3 < p2.length; n3++) u2 = a3[++s2], typeof (i3 = p2[n3]) === c && i3.length > 0 ? 2 === i3.length ? typeof i3[1] == l ? this[i3[0]] = i3[1].call(this, u2) : this[i3[0]] = i3[1] : 3 === i3.length ? typeof i3[1] !== l || i3[1].exec && i3[1].test ? this[i3[0]] = u2 ? u2.replace(i3[1], i3[2]) : void 0 : this[i3[0]] = u2 ? i3[1].call(this, u2, i3[2]) : void 0 : 4 === i3.length && (this[i3[0]] = u2 ? i3[3].call(this, u2.replace(i3[1], i3[2])) : o) : this[i3] = u2 || o;
                h2 += 2;
              }
            }, Y = function(e2, t2) {
              for (var r2 in t2) if (typeof t2[r2] === c && t2[r2].length > 0) {
                for (var s2 = 0; s2 < t2[r2].length; s2++) if (K(t2[r2][s2], e2)) return "?" === r2 ? o : r2;
              } else if (K(t2[r2], e2)) return "?" === r2 ? o : r2;
              return e2;
            }, Q = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, Z = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [b, [f, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [b, [f, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [f, b], [/opios[\/ ]+([\w\.]+)/i], [b, [f, L + " Mini"]], [/\bopr\/([\w\.]+)/i], [b, [f, L]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [f, b], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [b, [f, "UC" + P]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [b, [f, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [b, [f, "WeChat"]], [/konqueror\/([\w\.]+)/i], [b, [f, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [b, [f, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [b, [f, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[f, /(.+)/, "$1 Secure " + P], b], [/\bfocus\/([\w\.]+)/i], [b, [f, A + " Focus"]], [/\bopt\/([\w\.]+)/i], [b, [f, L + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [b, [f, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [b, [f, "Dolphin"]], [/coast\/([\w\.]+)/i], [b, [f, L + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [b, [f, "MIUI " + P]], [/fxios\/([-\w\.]+)/i], [b, [f, A]], [/\bqihu|(qi?ho?o?|360)browser/i], [[f, "360 " + P]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[f, /(.+)/, "$1 " + P], b], [/(comodo_dragon)\/([\w\.]+)/i], [[f, /_/g, " "], b], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [f, b], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [f], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[f, H], b], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [f, b], [/\bgsa\/([\w\.]+) .*safari\//i], [b, [f, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [b, [f, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [b, [f, x + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[f, x + " WebView"], b], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [b, [f, "Android " + P]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [f, b], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [b, [f, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [b, f], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [f, [b, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [f, b], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[f, "Netscape"], b], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [b, [f, A + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [f, b], [/(cobalt)\/([\w\.]+)/i], [f, [b, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[y, "amd64"]], [/(ia32(?=;))/i], [[y, F]], [/((?:i[346]|x)86)[;\)]/i], [[y, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[y, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[y, "armhf"]], [/windows (ce|mobile); ppc;/i], [[y, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[y, /ower/, "", F]], [/(sun4\w)[;\)]/i], [[y, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[y, F]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [p, [m, D], [g, _]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [p, [m, D], [g, v]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [p, [m, R], [g, v]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [p, [m, R], [g, _]], [/(macintosh);/i], [p, [m, R]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [p, [m, U], [g, v]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [p, [m, I], [g, _]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [p, [m, I], [g, v]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[p, /_/g, " "], [m, q], [g, v]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[p, /_/g, " "], [m, q], [g, _]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [p, [m, "OPPO"], [g, v]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [p, [m, "Vivo"], [g, v]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [p, [m, "Realme"], [g, v]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [p, [m, $], [g, v]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [p, [m, $], [g, _]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [p, [m, "LG"], [g, _]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [p, [m, "LG"], [g, v]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [p, [m, "Lenovo"], [g, _]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[p, /_/g, " "], [m, "Nokia"], [g, v]], [/(pixel c)\b/i], [p, [m, j], [g, _]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [p, [m, j], [g, v]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [p, [m, M], [g, v]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[p, "Xperia Tablet"], [m, M], [g, _]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [p, [m, "OnePlus"], [g, v]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [p, [m, T], [g, _]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[p, /(.+)/g, "Fire Phone $1"], [m, T], [g, v]], [/(playbook);[-\w\),; ]+(rim)/i], [p, m, [g, _]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [p, [m, C], [g, v]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [p, [m, O], [g, _]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [p, [m, O], [g, v]], [/(nexus 9)/i], [p, [m, "HTC"], [g, _]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [m, [p, /_/g, " "], [g, v]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [p, [m, "Acer"], [g, _]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [p, [m, "Meizu"], [g, v]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [m, p, [g, v]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [m, p, [g, _]], [/(surface duo)/i], [p, [m, N], [g, _]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [p, [m, "Fairphone"], [g, v]], [/(u304aa)/i], [p, [m, "AT&T"], [g, v]], [/\bsie-(\w*)/i], [p, [m, "Siemens"], [g, v]], [/\b(rct\w+) b/i], [p, [m, "RCA"], [g, _]], [/\b(venue[\d ]{2,7}) b/i], [p, [m, "Dell"], [g, _]], [/\b(q(?:mv|ta)\w+) b/i], [p, [m, "Verizon"], [g, _]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [p, [m, "Barnes & Noble"], [g, _]], [/\b(tm\d{3}\w+) b/i], [p, [m, "NuVision"], [g, _]], [/\b(k88) b/i], [p, [m, "ZTE"], [g, _]], [/\b(nx\d{3}j) b/i], [p, [m, "ZTE"], [g, v]], [/\b(gen\d{3}) b.+49h/i], [p, [m, "Swiss"], [g, v]], [/\b(zur\d{3}) b/i], [p, [m, "Swiss"], [g, _]], [/\b((zeki)?tb.*\b) b/i], [p, [m, "Zeki"], [g, _]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[m, "Dragon Touch"], p, [g, _]], [/\b(ns-?\w{0,9}) b/i], [p, [m, "Insignia"], [g, _]], [/\b((nxa|next)-?\w{0,9}) b/i], [p, [m, "NextBook"], [g, _]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[m, "Voice"], p, [g, v]], [/\b(lvtel\-)?(v1[12]) b/i], [[m, "LvTel"], p, [g, v]], [/\b(ph-1) /i], [p, [m, "Essential"], [g, v]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [p, [m, "Envizen"], [g, _]], [/\b(trio[-\w\. ]+) b/i], [p, [m, "MachSpeed"], [g, _]], [/\btu_(1491) b/i], [p, [m, "Rotor"], [g, _]], [/(shield[\w ]+) b/i], [p, [m, "Nvidia"], [g, _]], [/(sprint) (\w+)/i], [m, p, [g, v]], [/(kin\.[onetw]{3})/i], [[p, /\./g, " "], [m, N], [g, v]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [p, [m, B], [g, _]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [p, [m, B], [g, v]], [/smart-tv.+(samsung)/i], [m, [g, k]], [/hbbtv.+maple;(\d+)/i], [[p, /^/, "SmartTV"], [m, D], [g, k]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[m, "LG"], [g, k]], [/(apple) ?tv/i], [m, [p, R + " TV"], [g, k]], [/crkey/i], [[p, x + "cast"], [m, j], [g, k]], [/droid.+aft(\w)( bui|\))/i], [p, [m, T], [g, k]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [p, [m, U], [g, k]], [/(bravia[\w ]+)( bui|\))/i], [p, [m, M], [g, k]], [/(mitv-\w{5}) bui/i], [p, [m, q], [g, k]], [/Hbbtv.*(technisat) (.*);/i], [m, p, [g, k]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[m, J], [p, J], [g, k]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[g, k]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [m, p, [g, w]], [/droid.+; (shield) bui/i], [p, [m, "Nvidia"], [g, w]], [/(playstation [345portablevi]+)/i], [p, [m, M], [g, w]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [p, [m, N], [g, w]], [/((pebble))app/i], [m, p, [g, S]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [p, [m, R], [g, S]], [/droid.+; (glass) \d/i], [p, [m, j], [g, S]], [/droid.+; (wt63?0{2,3})\)/i], [p, [m, B], [g, S]], [/(quest( 2| pro)?)/i], [p, [m, H], [g, S]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [m, [g, E]], [/(aeobc)\b/i], [p, [m, T], [g, E]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [p, [g, v]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [p, [g, _]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[g, _]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[g, v]], [/(android[-\w\. ]{0,9});.+buil/i], [p, [m, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [b, [f, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [b, [f, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [f, b], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [b, f]], os: [[/microsoft (windows) (vista|xp)/i], [f, b], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [f, [b, Y, Q]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[f, "Windows"], [b, Y, Q]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[b, /_/g, "."], [f, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[f, V], [b, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [b, f], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [f, b], [/\(bb(10);/i], [b, [f, C]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [b, [f, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [b, [f, A + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [b, [f, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [b, [f, "watchOS"]], [/crkey\/([\d\.]+)/i], [b, [f, x + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[f, W], b], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [f, b], [/(sunos) ?([\w\.\d]*)/i], [[f, "Solaris"], b], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [f, b]] }, ee = function(e2, t2) {
              if (typeof e2 === c && (t2 = e2, e2 = o), !(this instanceof ee)) return new ee(e2, t2).getResult();
              var r2 = typeof a2 !== u && a2.navigator ? a2.navigator : o, s2 = e2 || (r2 && r2.userAgent ? r2.userAgent : ""), n3 = r2 && r2.userAgentData ? r2.userAgentData : o, i3 = t2 ? z(Z, t2) : Z, w2 = r2 && r2.userAgent == s2;
              return this.getBrowser = function() {
                var e3, t3 = {};
                return t3[f] = o, t3[b] = o, X.call(t3, s2, i3.browser), t3[d] = typeof (e3 = t3[b]) === h ? e3.replace(/[^\d\.]/g, "").split(".")[0] : o, w2 && r2 && r2.brave && typeof r2.brave.isBrave == l && (t3[f] = "Brave"), t3;
              }, this.getCPU = function() {
                var e3 = {};
                return e3[y] = o, X.call(e3, s2, i3.cpu), e3;
              }, this.getDevice = function() {
                var e3 = {};
                return e3[m] = o, e3[p] = o, e3[g] = o, X.call(e3, s2, i3.device), w2 && !e3[g] && n3 && n3.mobile && (e3[g] = v), w2 && "Macintosh" == e3[p] && r2 && typeof r2.standalone !== u && r2.maxTouchPoints && r2.maxTouchPoints > 2 && (e3[p] = "iPad", e3[g] = _), e3;
              }, this.getEngine = function() {
                var e3 = {};
                return e3[f] = o, e3[b] = o, X.call(e3, s2, i3.engine), e3;
              }, this.getOS = function() {
                var e3 = {};
                return e3[f] = o, e3[b] = o, X.call(e3, s2, i3.os), w2 && !e3[f] && n3 && "Unknown" != n3.platform && (e3[f] = n3.platform.replace(/chrome os/i, W).replace(/macos/i, V)), e3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return s2;
              }, this.setUA = function(e3) {
                return s2 = typeof e3 === h && e3.length > 350 ? J(e3, 350) : e3, this;
              }, this.setUA(s2), this;
            };
            ee.VERSION = "1.0.35", ee.BROWSER = G([f, b, d]), ee.CPU = G([y]), ee.DEVICE = G([p, m, g, w, v, k, _, S, E]), ee.ENGINE = ee.OS = G([f, b]), typeof i2 !== u ? (n2.exports && (i2 = n2.exports = ee), i2.UAParser = ee) : r.amdO ? void 0 === (s = function() {
              return ee;
            }.call(t, r, t, e)) || (e.exports = s) : typeof a2 !== u && (a2.UAParser = ee);
            var et = typeof a2 !== u && (a2.jQuery || a2.Zepto);
            if (et && !et.ua) {
              var er = new ee();
              et.ua = er.getResult(), et.ua.get = function() {
                return er.getUA();
              }, et.ua.set = function(e2) {
                er.setUA(e2);
                var t2 = er.getResult();
                for (var r2 in t2) et.ua[r2] = t2[r2];
              };
            }
          }("object" == typeof window ? window : this);
        } }, i = {};
        function a(e2) {
          var t2 = i[e2];
          if (void 0 !== t2) return t2.exports;
          var r2 = i[e2] = { exports: {} }, s2 = true;
          try {
            n[e2].call(r2.exports, r2, r2.exports, a), s2 = false;
          } finally {
            s2 && delete i[e2];
          }
          return r2.exports;
        }
        a.ab = "//", e.exports = a(226);
      })();
    }, 356: (e) => {
      "use strict";
      e.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 521: (e) => {
      "use strict";
      e.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 552: (e, t, r) => {
      "use strict";
      var s = r(356).Buffer;
      Object.defineProperty(t, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { handleFetch: function() {
        return o;
      }, interceptFetch: function() {
        return l;
      }, reader: function() {
        return i;
      } });
      let n = r(201), i = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function a(e2, t2) {
        let { url: r2, method: n2, headers: i2, body: a2, cache: o2, credentials: l2, integrity: u, mode: c, redirect: h, referrer: d, referrerPolicy: p } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: n2, headers: [...Array.from(i2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: a2 ? s.from(await t2.arrayBuffer()).toString("base64") : null, cache: o2, credentials: l2, integrity: u, mode: c, redirect: h, referrer: d, referrerPolicy: p } };
      }
      async function o(e2, t2) {
        let r2 = (0, n.getTestReqInfo)(t2, i);
        if (!r2) return e2(t2);
        let { testData: o2, proxyPort: l2 } = r2, u = await a(o2, t2), c = await e2(`http://localhost:${l2}`, { method: "POST", body: JSON.stringify(u), next: { internal: true } });
        if (!c.ok) throw Object.defineProperty(Error(`Proxy request failed: ${c.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let h = await c.json(), { api: d } = h;
        switch (d) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
        }
        let { status: p, headers: f, body: g } = h.response;
        return new Response(g ? s.from(g, "base64") : null, { status: p, headers: new Headers(f) });
      }
      function l(e2) {
        return r.g.fetch = function(t2, r2) {
          var s2;
          return (null == r2 || null == (s2 = r2.next) ? void 0 : s2.internal) ? e2(t2, r2) : o(e2, new Request(t2, r2));
        }, () => {
          r.g.fetch = e2;
        };
      }
    }, 554: (e, t) => {
      "use strict";
      t.qg = function(e2, t2) {
        let r2 = new o(), s2 = e2.length;
        if (s2 < 2) return r2;
        let n2 = t2?.decode || c, i2 = 0;
        do {
          let t3 = function(e3, t4, r3) {
            let s3 = e3.indexOf("=", t4);
            return s3 < r3 ? s3 : -1;
          }(e2, i2, s2);
          if (-1 === t3) break;
          let a2 = function(e3, t4, r3) {
            let s3 = e3.indexOf(";", t4);
            return -1 === s3 ? r3 : s3;
          }(e2, i2, s2);
          if (t3 > a2) {
            i2 = e2.lastIndexOf(";", t3 - 1) + 1;
            continue;
          }
          let o2 = u(e2, i2, t3);
          void 0 === r2[o2] && (r2[o2] = n2(u(e2, t3 + 1, a2))), i2 = a2 + 1;
        } while (i2 < s2);
        return r2;
      }, t.lK = l, t.lK = l;
      let r = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/, s = /^[\u0021-\u003A\u003C-\u007E]*$/, n = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, i = /^[\u0020-\u003A\u003D-\u007E]*$/, a = Object.prototype.toString, o = (() => {
        let e2 = function() {
        };
        return e2.prototype = /* @__PURE__ */ Object.create(null), e2;
      })();
      function l(e2, t2, o2) {
        let l2 = "object" == typeof e2 ? e2 : { ...o2, name: e2, value: String(t2) }, u2 = ("object" == typeof t2 ? t2 : o2)?.encode || encodeURIComponent;
        if (!r.test(l2.name)) throw TypeError(`argument name is invalid: ${l2.name}`);
        let c2 = l2.value ? u2(l2.value) : "";
        if (!s.test(c2)) throw TypeError(`argument val is invalid: ${l2.value}`);
        let h = l2.name + "=" + c2;
        if (void 0 !== l2.maxAge) {
          if (!Number.isInteger(l2.maxAge)) throw TypeError(`option maxAge is invalid: ${l2.maxAge}`);
          h += "; Max-Age=" + l2.maxAge;
        }
        if (l2.domain) {
          if (!n.test(l2.domain)) throw TypeError(`option domain is invalid: ${l2.domain}`);
          h += "; Domain=" + l2.domain;
        }
        if (l2.path) {
          if (!i.test(l2.path)) throw TypeError(`option path is invalid: ${l2.path}`);
          h += "; Path=" + l2.path;
        }
        if (l2.expires) {
          var d;
          if (d = l2.expires, "[object Date]" !== a.call(d) || !Number.isFinite(l2.expires.valueOf())) throw TypeError(`option expires is invalid: ${l2.expires}`);
          h += "; Expires=" + l2.expires.toUTCString();
        }
        if (l2.httpOnly && (h += "; HttpOnly"), l2.secure && (h += "; Secure"), l2.partitioned && (h += "; Partitioned"), l2.priority) switch ("string" == typeof l2.priority ? l2.priority.toLowerCase() : void 0) {
          case "low":
            h += "; Priority=Low";
            break;
          case "medium":
            h += "; Priority=Medium";
            break;
          case "high":
            h += "; Priority=High";
            break;
          default:
            throw TypeError(`option priority is invalid: ${l2.priority}`);
        }
        if (l2.sameSite) switch ("string" == typeof l2.sameSite ? l2.sameSite.toLowerCase() : l2.sameSite) {
          case true:
          case "strict":
            h += "; SameSite=Strict";
            break;
          case "lax":
            h += "; SameSite=Lax";
            break;
          case "none":
            h += "; SameSite=None";
            break;
          default:
            throw TypeError(`option sameSite is invalid: ${l2.sameSite}`);
        }
        return h;
      }
      function u(e2, t2, r2) {
        let s2 = t2, n2 = r2;
        do {
          let t3 = e2.charCodeAt(s2);
          if (32 !== t3 && 9 !== t3) break;
        } while (++s2 < n2);
        for (; n2 > s2; ) {
          let t3 = e2.charCodeAt(n2 - 1);
          if (32 !== t3 && 9 !== t3) break;
          n2--;
        }
        return e2.slice(s2, n2);
      }
      function c(e2) {
        if (-1 === e2.indexOf("%")) return e2;
        try {
          return decodeURIComponent(e2);
        } catch (t2) {
          return e2;
        }
      }
    }, 724: (e) => {
      "use strict";
      var t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, s = Object.getOwnPropertyNames, n = Object.prototype.hasOwnProperty, i = {};
      function a(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), s2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? s2 : `${s2}; ${r2.join("; ")}`;
      }
      function o(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [s2, n2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(s2, decodeURIComponent(null != n2 ? n2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function l(e2) {
        if (!e2) return;
        let [[t2, r2], ...s2] = o(e2), { domain: n2, expires: i2, httponly: a2, maxage: l2, path: h2, samesite: d2, secure: p, partitioned: f, priority: g } = Object.fromEntries(s2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var m, b, y = { name: t2, value: decodeURIComponent(r2), domain: n2, ...i2 && { expires: new Date(i2) }, ...a2 && { httpOnly: true }, ..."string" == typeof l2 && { maxAge: Number(l2) }, path: h2, ...d2 && { sameSite: u.includes(m = (m = d2).toLowerCase()) ? m : void 0 }, ...p && { secure: true }, ...g && { priority: c.includes(b = (b = g).toLowerCase()) ? b : void 0 }, ...f && { partitioned: true } };
          let e3 = {};
          for (let t3 in y) y[t3] && (e3[t3] = y[t3]);
          return e3;
        }
      }
      ((e2, r2) => {
        for (var s2 in r2) t(e2, s2, { get: r2[s2], enumerable: true });
      })(i, { RequestCookies: () => h, ResponseCookies: () => d, parseCookie: () => o, parseSetCookie: () => l, stringifyCookie: () => a }), e.exports = ((e2, i2, a2, o2) => {
        if (i2 && "object" == typeof i2 || "function" == typeof i2) for (let l2 of s(i2)) n.call(e2, l2) || l2 === a2 || t(e2, l2, { get: () => i2[l2], enumerable: !(o2 = r(i2, l2)) || o2.enumerable });
        return e2;
      })(t({}, "__esModule", { value: true }), i);
      var u = ["strict", "lax", "none"], c = ["low", "medium", "high"], h = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let t2 = e2.get("cookie");
          if (t2) for (let [e3, r2] of o(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let s2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === s2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, s2 = this._parsed;
          return s2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(s2).map(([e3, t3]) => a(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => a(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, d = class {
        constructor(e2) {
          var t2, r2, s2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let n2 = null != (s2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? s2 : [];
          for (let e3 of Array.isArray(n2) ? n2 : function(e4) {
            if (!e4) return [];
            var t3, r3, s3, n3, i2, a2 = [], o2 = 0;
            function l2() {
              for (; o2 < e4.length && /\s/.test(e4.charAt(o2)); ) o2 += 1;
              return o2 < e4.length;
            }
            for (; o2 < e4.length; ) {
              for (t3 = o2, i2 = false; l2(); ) if ("," === (r3 = e4.charAt(o2))) {
                for (s3 = o2, o2 += 1, l2(), n3 = o2; o2 < e4.length && "=" !== (r3 = e4.charAt(o2)) && ";" !== r3 && "," !== r3; ) o2 += 1;
                o2 < e4.length && "=" === e4.charAt(o2) ? (i2 = true, o2 = n3, a2.push(e4.substring(t3, s3)), t3 = o2) : o2 = s3 + 1;
              } else o2 += 1;
              (!i2 || o2 >= e4.length) && a2.push(e4.substring(t3, e4.length));
            }
            return a2;
          }(n2)) {
            let t3 = l(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let s2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === s2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, s2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, n2 = this._parsed;
          return n2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...s2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = a(r3);
              t3.append("set-cookie", e4);
            }
          }(n2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(a).join("; ");
        }
      };
    }, 802: (e) => {
      (() => {
        "use strict";
        var t = { 993: (e2) => {
          var t2 = Object.prototype.hasOwnProperty, r2 = "~";
          function s2() {
          }
          function n2(e3, t3, r3) {
            this.fn = e3, this.context = t3, this.once = r3 || false;
          }
          function i(e3, t3, s3, i2, a2) {
            if ("function" != typeof s3) throw TypeError("The listener must be a function");
            var o2 = new n2(s3, i2 || e3, a2), l = r2 ? r2 + t3 : t3;
            return e3._events[l] ? e3._events[l].fn ? e3._events[l] = [e3._events[l], o2] : e3._events[l].push(o2) : (e3._events[l] = o2, e3._eventsCount++), e3;
          }
          function a(e3, t3) {
            0 == --e3._eventsCount ? e3._events = new s2() : delete e3._events[t3];
          }
          function o() {
            this._events = new s2(), this._eventsCount = 0;
          }
          Object.create && (s2.prototype = /* @__PURE__ */ Object.create(null), new s2().__proto__ || (r2 = false)), o.prototype.eventNames = function() {
            var e3, s3, n3 = [];
            if (0 === this._eventsCount) return n3;
            for (s3 in e3 = this._events) t2.call(e3, s3) && n3.push(r2 ? s3.slice(1) : s3);
            return Object.getOwnPropertySymbols ? n3.concat(Object.getOwnPropertySymbols(e3)) : n3;
          }, o.prototype.listeners = function(e3) {
            var t3 = r2 ? r2 + e3 : e3, s3 = this._events[t3];
            if (!s3) return [];
            if (s3.fn) return [s3.fn];
            for (var n3 = 0, i2 = s3.length, a2 = Array(i2); n3 < i2; n3++) a2[n3] = s3[n3].fn;
            return a2;
          }, o.prototype.listenerCount = function(e3) {
            var t3 = r2 ? r2 + e3 : e3, s3 = this._events[t3];
            return s3 ? s3.fn ? 1 : s3.length : 0;
          }, o.prototype.emit = function(e3, t3, s3, n3, i2, a2) {
            var o2 = r2 ? r2 + e3 : e3;
            if (!this._events[o2]) return false;
            var l, u, c = this._events[o2], h = arguments.length;
            if (c.fn) {
              switch (c.once && this.removeListener(e3, c.fn, void 0, true), h) {
                case 1:
                  return c.fn.call(c.context), true;
                case 2:
                  return c.fn.call(c.context, t3), true;
                case 3:
                  return c.fn.call(c.context, t3, s3), true;
                case 4:
                  return c.fn.call(c.context, t3, s3, n3), true;
                case 5:
                  return c.fn.call(c.context, t3, s3, n3, i2), true;
                case 6:
                  return c.fn.call(c.context, t3, s3, n3, i2, a2), true;
              }
              for (u = 1, l = Array(h - 1); u < h; u++) l[u - 1] = arguments[u];
              c.fn.apply(c.context, l);
            } else {
              var d, p = c.length;
              for (u = 0; u < p; u++) switch (c[u].once && this.removeListener(e3, c[u].fn, void 0, true), h) {
                case 1:
                  c[u].fn.call(c[u].context);
                  break;
                case 2:
                  c[u].fn.call(c[u].context, t3);
                  break;
                case 3:
                  c[u].fn.call(c[u].context, t3, s3);
                  break;
                case 4:
                  c[u].fn.call(c[u].context, t3, s3, n3);
                  break;
                default:
                  if (!l) for (d = 1, l = Array(h - 1); d < h; d++) l[d - 1] = arguments[d];
                  c[u].fn.apply(c[u].context, l);
              }
            }
            return true;
          }, o.prototype.on = function(e3, t3, r3) {
            return i(this, e3, t3, r3, false);
          }, o.prototype.once = function(e3, t3, r3) {
            return i(this, e3, t3, r3, true);
          }, o.prototype.removeListener = function(e3, t3, s3, n3) {
            var i2 = r2 ? r2 + e3 : e3;
            if (!this._events[i2]) return this;
            if (!t3) return a(this, i2), this;
            var o2 = this._events[i2];
            if (o2.fn) o2.fn !== t3 || n3 && !o2.once || s3 && o2.context !== s3 || a(this, i2);
            else {
              for (var l = 0, u = [], c = o2.length; l < c; l++) (o2[l].fn !== t3 || n3 && !o2[l].once || s3 && o2[l].context !== s3) && u.push(o2[l]);
              u.length ? this._events[i2] = 1 === u.length ? u[0] : u : a(this, i2);
            }
            return this;
          }, o.prototype.removeAllListeners = function(e3) {
            var t3;
            return e3 ? (t3 = r2 ? r2 + e3 : e3, this._events[t3] && a(this, t3)) : (this._events = new s2(), this._eventsCount = 0), this;
          }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = r2, o.EventEmitter = o, e2.exports = o;
        }, 213: (e2) => {
          e2.exports = (e3, t2) => (t2 = t2 || (() => {
          }), e3.then((e4) => new Promise((e5) => {
            e5(t2());
          }).then(() => e4), (e4) => new Promise((e5) => {
            e5(t2());
          }).then(() => {
            throw e4;
          })));
        }, 574: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e3, t3, r2) {
            let s2 = 0, n2 = e3.length;
            for (; n2 > 0; ) {
              let i = n2 / 2 | 0, a = s2 + i;
              0 >= r2(e3[a], t3) ? (s2 = ++a, n2 -= i + 1) : n2 = i;
            }
            return s2;
          };
        }, 821: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let s2 = r2(574);
          class n2 {
            constructor() {
              this._queue = [];
            }
            enqueue(e3, t3) {
              let r3 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e3 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r3);
              let n3 = s2.default(this._queue, r3, (e4, t4) => t4.priority - e4.priority);
              this._queue.splice(n3, 0, r3);
            }
            dequeue() {
              let e3 = this._queue.shift();
              return null == e3 ? void 0 : e3.run;
            }
            filter(e3) {
              return this._queue.filter((t3) => t3.priority === e3.priority).map((e4) => e4.run);
            }
            get size() {
              return this._queue.length;
            }
          }
          t2.default = n2;
        }, 816: (e2, t2, r2) => {
          let s2 = r2(213);
          class n2 extends Error {
            constructor(e3) {
              super(e3), this.name = "TimeoutError";
            }
          }
          let i = (e3, t3, r3) => new Promise((i2, a) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void i2(e3);
            let o = setTimeout(() => {
              if ("function" == typeof r3) {
                try {
                  i2(r3());
                } catch (e4) {
                  a(e4);
                }
                return;
              }
              let s3 = "string" == typeof r3 ? r3 : `Promise timed out after ${t3} milliseconds`, o2 = r3 instanceof Error ? r3 : new n2(s3);
              "function" == typeof e3.cancel && e3.cancel(), a(o2);
            }, t3);
            s2(e3.then(i2, a), () => {
              clearTimeout(o);
            });
          });
          e2.exports = i, e2.exports.default = i, e2.exports.TimeoutError = n2;
        } }, r = {};
        function s(e2) {
          var n2 = r[e2];
          if (void 0 !== n2) return n2.exports;
          var i = r[e2] = { exports: {} }, a = true;
          try {
            t[e2](i, i.exports, s), a = false;
          } finally {
            a && delete r[e2];
          }
          return i.exports;
        }
        s.ab = "//";
        var n = {};
        (() => {
          Object.defineProperty(n, "__esModule", { value: true });
          let e2 = s(993), t2 = s(816), r2 = s(821), i = () => {
          }, a = new t2.TimeoutError();
          class o extends e2 {
            constructor(e3) {
              var t3, s2, n2, a2;
              if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = i, this._resolveIdle = i, !("number" == typeof (e3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: r2.default }, e3)).intervalCap && e3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (s2 = null == (t3 = e3.intervalCap) ? void 0 : t3.toString()) ? s2 : ""}\` (${typeof e3.intervalCap})`);
              if (void 0 === e3.interval || !(Number.isFinite(e3.interval) && e3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (a2 = null == (n2 = e3.interval) ? void 0 : n2.toString()) ? a2 : ""}\` (${typeof e3.interval})`);
              this._carryoverConcurrencyCount = e3.carryoverConcurrencyCount, this._isIntervalIgnored = e3.intervalCap === 1 / 0 || 0 === e3.interval, this._intervalCap = e3.intervalCap, this._interval = e3.interval, this._queue = new e3.queueClass(), this._queueClass = e3.queueClass, this.concurrency = e3.concurrency, this._timeout = e3.timeout, this._throwOnTimeout = true === e3.throwOnTimeout, this._isPaused = false === e3.autoStart;
            }
            get _doesIntervalAllowAnother() {
              return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
              return this._pendingCount < this._concurrency;
            }
            _next() {
              this._pendingCount--, this._tryToStartAnother(), this.emit("next");
            }
            _resolvePromises() {
              this._resolveEmpty(), this._resolveEmpty = i, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = i, this.emit("idle"));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
            }
            _isIntervalPaused() {
              let e3 = Date.now();
              if (void 0 === this._intervalId) {
                let t3 = this._intervalEnd - e3;
                if (!(t3 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                  this._onResumeInterval();
                }, t3)), true;
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
              }
              return false;
            }
            _tryToStartAnother() {
              if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
              if (!this._isPaused) {
                let e3 = !this._isIntervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                  let t3 = this._queue.dequeue();
                  return !!t3 && (this.emit("active"), t3(), e3 && this._initializeIntervalIfNeeded(), true);
                }
              }
              return false;
            }
            _initializeIntervalIfNeeded() {
              this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
                this._onInterval();
              }, this._interval), this._intervalEnd = Date.now() + this._interval);
            }
            _onInterval() {
              0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
            }
            _processQueue() {
              for (; this._tryToStartAnother(); ) ;
            }
            get concurrency() {
              return this._concurrency;
            }
            set concurrency(e3) {
              if (!("number" == typeof e3 && e3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e3}\` (${typeof e3})`);
              this._concurrency = e3, this._processQueue();
            }
            async add(e3, r3 = {}) {
              return new Promise((s2, n2) => {
                let i2 = async () => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    let i3 = void 0 === this._timeout && void 0 === r3.timeout ? e3() : t2.default(Promise.resolve(e3()), void 0 === r3.timeout ? this._timeout : r3.timeout, () => {
                      (void 0 === r3.throwOnTimeout ? this._throwOnTimeout : r3.throwOnTimeout) && n2(a);
                    });
                    s2(await i3);
                  } catch (e4) {
                    n2(e4);
                  }
                  this._next();
                };
                this._queue.enqueue(i2, r3), this._tryToStartAnother(), this.emit("add");
              });
            }
            async addAll(e3, t3) {
              return Promise.all(e3.map(async (e4) => this.add(e4, t3)));
            }
            start() {
              return this._isPaused && (this._isPaused = false, this._processQueue()), this;
            }
            pause() {
              this._isPaused = true;
            }
            clear() {
              this._queue = new this._queueClass();
            }
            async onEmpty() {
              if (0 !== this._queue.size) return new Promise((e3) => {
                let t3 = this._resolveEmpty;
                this._resolveEmpty = () => {
                  t3(), e3();
                };
              });
            }
            async onIdle() {
              if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e3) => {
                let t3 = this._resolveIdle;
                this._resolveIdle = () => {
                  t3(), e3();
                };
              });
            }
            get size() {
              return this._queue.size;
            }
            sizeBy(e3) {
              return this._queue.filter(e3).length;
            }
            get pending() {
              return this._pendingCount;
            }
            get isPaused() {
              return this._isPaused;
            }
            get timeout() {
              return this._timeout;
            }
            set timeout(e3) {
              this._timeout = e3;
            }
          }
          n.default = o;
        })(), e.exports = n;
      })();
    }, 815: (e, t, r) => {
      "use strict";
      e.exports = r(35);
    }, 890: (e) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var t = {};
        (() => {
          t.parse = function(t2, r2) {
            if ("string" != typeof t2) throw TypeError("argument str must be a string");
            for (var n2 = {}, i = t2.split(s), a = (r2 || {}).decode || e2, o = 0; o < i.length; o++) {
              var l = i[o], u = l.indexOf("=");
              if (!(u < 0)) {
                var c = l.substr(0, u).trim(), h = l.substr(++u, l.length).trim();
                '"' == h[0] && (h = h.slice(1, -1)), void 0 == n2[c] && (n2[c] = function(e3, t3) {
                  try {
                    return t3(e3);
                  } catch (t4) {
                    return e3;
                  }
                }(h, a));
              }
            }
            return n2;
          }, t.serialize = function(e3, t2, s2) {
            var i = s2 || {}, a = i.encode || r;
            if ("function" != typeof a) throw TypeError("option encode is invalid");
            if (!n.test(e3)) throw TypeError("argument name is invalid");
            var o = a(t2);
            if (o && !n.test(o)) throw TypeError("argument val is invalid");
            var l = e3 + "=" + o;
            if (null != i.maxAge) {
              var u = i.maxAge - 0;
              if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
              l += "; Max-Age=" + Math.floor(u);
            }
            if (i.domain) {
              if (!n.test(i.domain)) throw TypeError("option domain is invalid");
              l += "; Domain=" + i.domain;
            }
            if (i.path) {
              if (!n.test(i.path)) throw TypeError("option path is invalid");
              l += "; Path=" + i.path;
            }
            if (i.expires) {
              if ("function" != typeof i.expires.toUTCString) throw TypeError("option expires is invalid");
              l += "; Expires=" + i.expires.toUTCString();
            }
            if (i.httpOnly && (l += "; HttpOnly"), i.secure && (l += "; Secure"), i.sameSite) switch ("string" == typeof i.sameSite ? i.sameSite.toLowerCase() : i.sameSite) {
              case true:
              case "strict":
                l += "; SameSite=Strict";
                break;
              case "lax":
                l += "; SameSite=Lax";
                break;
              case "none":
                l += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return l;
          };
          var e2 = decodeURIComponent, r = encodeURIComponent, s = /; */, n = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), e.exports = t;
      })();
    }, 905: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { interceptTestApis: function() {
        return i;
      }, wrapRequestHandler: function() {
        return a;
      } });
      let s = r(201), n = r(552);
      function i() {
        return (0, n.interceptFetch)(r.g.fetch);
      }
      function a(e2) {
        return (t2, r2) => (0, s.withRequest)(t2, n.reader, () => e2(t2, r2));
      }
    }, 956: (e, t, r) => {
      (() => {
        "use strict";
        var t2 = { 491: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ContextAPI = void 0;
          let s2 = r2(223), n2 = r2(172), i2 = r2(930), a = "context", o = new s2.NoopContextManager();
          class l {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new l()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, n2.registerGlobal)(a, e3, i2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t4, r3, ...s3) {
              return this._getContextManager().with(e3, t4, r3, ...s3);
            }
            bind(e3, t4) {
              return this._getContextManager().bind(e3, t4);
            }
            _getContextManager() {
              return (0, n2.getGlobal)(a) || o;
            }
            disable() {
              this._getContextManager().disable(), (0, n2.unregisterGlobal)(a, i2.DiagAPI.instance());
            }
          }
          t3.ContextAPI = l;
        }, 930: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagAPI = void 0;
          let s2 = r2(56), n2 = r2(912), i2 = r2(957), a = r2(172);
          class o {
            constructor() {
              function e3(e4) {
                return function(...t5) {
                  let r3 = (0, a.getGlobal)("diag");
                  if (r3) return r3[e4](...t5);
                };
              }
              let t4 = this;
              t4.setLogger = (e4, r3 = { logLevel: i2.DiagLogLevel.INFO }) => {
                var s3, o2, l;
                if (e4 === t4) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t4.error(null != (s3 = e5.stack) ? s3 : e5.message), false;
                }
                "number" == typeof r3 && (r3 = { logLevel: r3 });
                let u = (0, a.getGlobal)("diag"), c = (0, n2.createLogLevelDiagLogger)(null != (o2 = r3.logLevel) ? o2 : i2.DiagLogLevel.INFO, e4);
                if (u && !r3.suppressOverrideMessage) {
                  let e5 = null != (l = Error().stack) ? l : "<failed to generate stacktrace>";
                  u.warn(`Current logger will be overwritten from ${e5}`), c.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, a.registerGlobal)("diag", c, t4, true);
              }, t4.disable = () => {
                (0, a.unregisterGlobal)("diag", t4);
              }, t4.createComponentLogger = (e4) => new s2.DiagComponentLogger(e4), t4.verbose = e3("verbose"), t4.debug = e3("debug"), t4.info = e3("info"), t4.warn = e3("warn"), t4.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new o()), this._instance;
            }
          }
          t3.DiagAPI = o;
        }, 653: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.MetricsAPI = void 0;
          let s2 = r2(660), n2 = r2(172), i2 = r2(930), a = "metrics";
          class o {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new o()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, n2.registerGlobal)(a, e3, i2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, n2.getGlobal)(a) || s2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t4, r3) {
              return this.getMeterProvider().getMeter(e3, t4, r3);
            }
            disable() {
              (0, n2.unregisterGlobal)(a, i2.DiagAPI.instance());
            }
          }
          t3.MetricsAPI = o;
        }, 181: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.PropagationAPI = void 0;
          let s2 = r2(172), n2 = r2(874), i2 = r2(194), a = r2(277), o = r2(369), l = r2(930), u = "propagation", c = new n2.NoopTextMapPropagator();
          class h {
            constructor() {
              this.createBaggage = o.createBaggage, this.getBaggage = a.getBaggage, this.getActiveBaggage = a.getActiveBaggage, this.setBaggage = a.setBaggage, this.deleteBaggage = a.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new h()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, s2.registerGlobal)(u, e3, l.DiagAPI.instance());
            }
            inject(e3, t4, r3 = i2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t4, r3);
            }
            extract(e3, t4, r3 = i2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t4, r3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, s2.unregisterGlobal)(u, l.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, s2.getGlobal)(u) || c;
            }
          }
          t3.PropagationAPI = h;
        }, 997: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceAPI = void 0;
          let s2 = r2(172), n2 = r2(846), i2 = r2(139), a = r2(607), o = r2(930), l = "trace";
          class u {
            constructor() {
              this._proxyTracerProvider = new n2.ProxyTracerProvider(), this.wrapSpanContext = i2.wrapSpanContext, this.isSpanContextValid = i2.isSpanContextValid, this.deleteSpan = a.deleteSpan, this.getSpan = a.getSpan, this.getActiveSpan = a.getActiveSpan, this.getSpanContext = a.getSpanContext, this.setSpan = a.setSpan, this.setSpanContext = a.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new u()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t4 = (0, s2.registerGlobal)(l, this._proxyTracerProvider, o.DiagAPI.instance());
              return t4 && this._proxyTracerProvider.setDelegate(e3), t4;
            }
            getTracerProvider() {
              return (0, s2.getGlobal)(l) || this._proxyTracerProvider;
            }
            getTracer(e3, t4) {
              return this.getTracerProvider().getTracer(e3, t4);
            }
            disable() {
              (0, s2.unregisterGlobal)(l, o.DiagAPI.instance()), this._proxyTracerProvider = new n2.ProxyTracerProvider();
            }
          }
          t3.TraceAPI = u;
        }, 277: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.deleteBaggage = t3.setBaggage = t3.getActiveBaggage = t3.getBaggage = void 0;
          let s2 = r2(491), n2 = (0, r2(780).createContextKey)("OpenTelemetry Baggage Key");
          function i2(e3) {
            return e3.getValue(n2) || void 0;
          }
          t3.getBaggage = i2, t3.getActiveBaggage = function() {
            return i2(s2.ContextAPI.getInstance().active());
          }, t3.setBaggage = function(e3, t4) {
            return e3.setValue(n2, t4);
          }, t3.deleteBaggage = function(e3) {
            return e3.deleteValue(n2);
          };
        }, 993: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.BaggageImpl = void 0;
          class r2 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t4 = this._entries.get(e3);
              if (t4) return Object.assign({}, t4);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t4]) => [e3, t4]);
            }
            setEntry(e3, t4) {
              let s2 = new r2(this._entries);
              return s2._entries.set(e3, t4), s2;
            }
            removeEntry(e3) {
              let t4 = new r2(this._entries);
              return t4._entries.delete(e3), t4;
            }
            removeEntries(...e3) {
              let t4 = new r2(this._entries);
              for (let r3 of e3) t4._entries.delete(r3);
              return t4;
            }
            clear() {
              return new r2();
            }
          }
          t3.BaggageImpl = r2;
        }, 830: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataSymbol = void 0, t3.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataFromString = t3.createBaggage = void 0;
          let s2 = r2(930), n2 = r2(993), i2 = r2(830), a = s2.DiagAPI.instance();
          t3.createBaggage = function(e3 = {}) {
            return new n2.BaggageImpl(new Map(Object.entries(e3)));
          }, t3.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (a.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: i2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.context = void 0, t3.context = r2(491).ContextAPI.getInstance();
        }, 223: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopContextManager = void 0;
          let s2 = r2(780);
          class n2 {
            active() {
              return s2.ROOT_CONTEXT;
            }
            with(e3, t4, r3, ...s3) {
              return t4.call(r3, ...s3);
            }
            bind(e3, t4) {
              return t4;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          t3.NoopContextManager = n2;
        }, 780: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ROOT_CONTEXT = t3.createContextKey = void 0, t3.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r2 {
            constructor(e3) {
              let t4 = this;
              t4._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t4.getValue = (e4) => t4._currentContext.get(e4), t4.setValue = (e4, s2) => {
                let n2 = new r2(t4._currentContext);
                return n2._currentContext.set(e4, s2), n2;
              }, t4.deleteValue = (e4) => {
                let s2 = new r2(t4._currentContext);
                return s2._currentContext.delete(e4), s2;
              };
            }
          }
          t3.ROOT_CONTEXT = new r2();
        }, 506: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.diag = void 0, t3.diag = r2(930).DiagAPI.instance();
        }, 56: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagComponentLogger = void 0;
          let s2 = r2(172);
          class n2 {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return i2("debug", this._namespace, e3);
            }
            error(...e3) {
              return i2("error", this._namespace, e3);
            }
            info(...e3) {
              return i2("info", this._namespace, e3);
            }
            warn(...e3) {
              return i2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return i2("verbose", this._namespace, e3);
            }
          }
          function i2(e3, t4, r3) {
            let n3 = (0, s2.getGlobal)("diag");
            if (n3) return r3.unshift(t4), n3[e3](...r3);
          }
          t3.DiagComponentLogger = n2;
        }, 972: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagConsoleLogger = void 0;
          let r2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class s2 {
            constructor() {
              for (let e3 = 0; e3 < r2.length; e3++) this[r2[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t4) {
                  if (console) {
                    let r3 = console[e4];
                    if ("function" != typeof r3 && (r3 = console.log), "function" == typeof r3) return r3.apply(console, t4);
                  }
                };
              }(r2[e3].c);
            }
          }
          t3.DiagConsoleLogger = s2;
        }, 912: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createLogLevelDiagLogger = void 0;
          let s2 = r2(957);
          t3.createLogLevelDiagLogger = function(e3, t4) {
            function r3(r4, s3) {
              let n2 = t4[r4];
              return "function" == typeof n2 && e3 >= s3 ? n2.bind(t4) : function() {
              };
            }
            return e3 < s2.DiagLogLevel.NONE ? e3 = s2.DiagLogLevel.NONE : e3 > s2.DiagLogLevel.ALL && (e3 = s2.DiagLogLevel.ALL), t4 = t4 || {}, { error: r3("error", s2.DiagLogLevel.ERROR), warn: r3("warn", s2.DiagLogLevel.WARN), info: r3("info", s2.DiagLogLevel.INFO), debug: r3("debug", s2.DiagLogLevel.DEBUG), verbose: r3("verbose", s2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagLogLevel = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.ERROR = 30] = "ERROR", e3[e3.WARN = 50] = "WARN", e3[e3.INFO = 60] = "INFO", e3[e3.DEBUG = 70] = "DEBUG", e3[e3.VERBOSE = 80] = "VERBOSE", e3[e3.ALL = 9999] = "ALL";
          }(t3.DiagLogLevel || (t3.DiagLogLevel = {}));
        }, 172: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.unregisterGlobal = t3.getGlobal = t3.registerGlobal = void 0;
          let s2 = r2(200), n2 = r2(521), i2 = r2(130), a = n2.VERSION.split(".")[0], o = Symbol.for(`opentelemetry.js.api.${a}`), l = s2._globalThis;
          t3.registerGlobal = function(e3, t4, r3, s3 = false) {
            var i3;
            let a2 = l[o] = null != (i3 = l[o]) ? i3 : { version: n2.VERSION };
            if (!s3 && a2[e3]) {
              let t5 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r3.error(t5.stack || t5.message), false;
            }
            if (a2.version !== n2.VERSION) {
              let t5 = Error(`@opentelemetry/api: Registration of version v${a2.version} for ${e3} does not match previously registered API v${n2.VERSION}`);
              return r3.error(t5.stack || t5.message), false;
            }
            return a2[e3] = t4, r3.debug(`@opentelemetry/api: Registered a global for ${e3} v${n2.VERSION}.`), true;
          }, t3.getGlobal = function(e3) {
            var t4, r3;
            let s3 = null == (t4 = l[o]) ? void 0 : t4.version;
            if (s3 && (0, i2.isCompatible)(s3)) return null == (r3 = l[o]) ? void 0 : r3[e3];
          }, t3.unregisterGlobal = function(e3, t4) {
            t4.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${n2.VERSION}.`);
            let r3 = l[o];
            r3 && delete r3[e3];
          };
        }, 130: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.isCompatible = t3._makeCompatibilityCheck = void 0;
          let s2 = r2(521), n2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function i2(e3) {
            let t4 = /* @__PURE__ */ new Set([e3]), r3 = /* @__PURE__ */ new Set(), s3 = e3.match(n2);
            if (!s3) return () => false;
            let i3 = { major: +s3[1], minor: +s3[2], patch: +s3[3], prerelease: s3[4] };
            if (null != i3.prerelease) return function(t5) {
              return t5 === e3;
            };
            function a(e4) {
              return r3.add(e4), false;
            }
            return function(e4) {
              if (t4.has(e4)) return true;
              if (r3.has(e4)) return false;
              let s4 = e4.match(n2);
              if (!s4) return a(e4);
              let o = { major: +s4[1], minor: +s4[2], patch: +s4[3], prerelease: s4[4] };
              if (null != o.prerelease || i3.major !== o.major) return a(e4);
              if (0 === i3.major) return i3.minor === o.minor && i3.patch <= o.patch ? (t4.add(e4), true) : a(e4);
              return i3.minor <= o.minor ? (t4.add(e4), true) : a(e4);
            };
          }
          t3._makeCompatibilityCheck = i2, t3.isCompatible = i2(s2.VERSION);
        }, 886: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.metrics = void 0, t3.metrics = r2(653).MetricsAPI.getInstance();
        }, 901: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ValueType = void 0, function(e3) {
            e3[e3.INT = 0] = "INT", e3[e3.DOUBLE = 1] = "DOUBLE";
          }(t3.ValueType || (t3.ValueType = {}));
        }, 102: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createNoopMeter = t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t3.NOOP_OBSERVABLE_GAUGE_METRIC = t3.NOOP_OBSERVABLE_COUNTER_METRIC = t3.NOOP_UP_DOWN_COUNTER_METRIC = t3.NOOP_HISTOGRAM_METRIC = t3.NOOP_COUNTER_METRIC = t3.NOOP_METER = t3.NoopObservableUpDownCounterMetric = t3.NoopObservableGaugeMetric = t3.NoopObservableCounterMetric = t3.NoopObservableMetric = t3.NoopHistogramMetric = t3.NoopUpDownCounterMetric = t3.NoopCounterMetric = t3.NoopMetric = t3.NoopMeter = void 0;
          class r2 {
            constructor() {
            }
            createHistogram(e3, r3) {
              return t3.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r3) {
              return t3.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r3) {
              return t3.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r3) {
              return t3.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t4) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t3.NoopMeter = r2;
          class s2 {
          }
          t3.NoopMetric = s2;
          class n2 extends s2 {
            add(e3, t4) {
            }
          }
          t3.NoopCounterMetric = n2;
          class i2 extends s2 {
            add(e3, t4) {
            }
          }
          t3.NoopUpDownCounterMetric = i2;
          class a extends s2 {
            record(e3, t4) {
            }
          }
          t3.NoopHistogramMetric = a;
          class o {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t3.NoopObservableMetric = o;
          class l extends o {
          }
          t3.NoopObservableCounterMetric = l;
          class u extends o {
          }
          t3.NoopObservableGaugeMetric = u;
          class c extends o {
          }
          t3.NoopObservableUpDownCounterMetric = c, t3.NOOP_METER = new r2(), t3.NOOP_COUNTER_METRIC = new n2(), t3.NOOP_HISTOGRAM_METRIC = new a(), t3.NOOP_UP_DOWN_COUNTER_METRIC = new i2(), t3.NOOP_OBSERVABLE_COUNTER_METRIC = new l(), t3.NOOP_OBSERVABLE_GAUGE_METRIC = new u(), t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new c(), t3.createNoopMeter = function() {
            return t3.NOOP_METER;
          };
        }, 660: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NOOP_METER_PROVIDER = t3.NoopMeterProvider = void 0;
          let s2 = r2(102);
          class n2 {
            getMeter(e3, t4, r3) {
              return s2.NOOP_METER;
            }
          }
          t3.NoopMeterProvider = n2, t3.NOOP_METER_PROVIDER = new n2();
        }, 200: function(e2, t3, r2) {
          var s2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, s3) {
            void 0 === s3 && (s3 = r3), Object.defineProperty(e3, s3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, s3) {
            void 0 === s3 && (s3 = r3), e3[s3] = t4[r3];
          }), n2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || s2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), n2(r2(46), t3);
        }, 651: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3._globalThis = void 0, t3._globalThis = "object" == typeof globalThis ? globalThis : r.g;
        }, 46: function(e2, t3, r2) {
          var s2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, s3) {
            void 0 === s3 && (s3 = r3), Object.defineProperty(e3, s3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, s3) {
            void 0 === s3 && (s3 = r3), e3[s3] = t4[r3];
          }), n2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || s2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), n2(r2(651), t3);
        }, 939: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.propagation = void 0, t3.propagation = r2(181).PropagationAPI.getInstance();
        }, 874: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTextMapPropagator = void 0;
          class r2 {
            inject(e3, t4) {
            }
            extract(e3, t4) {
              return e3;
            }
            fields() {
              return [];
            }
          }
          t3.NoopTextMapPropagator = r2;
        }, 194: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.defaultTextMapSetter = t3.defaultTextMapGetter = void 0, t3.defaultTextMapGetter = { get(e3, t4) {
            if (null != e3) return e3[t4];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t3.defaultTextMapSetter = { set(e3, t4, r2) {
            null != e3 && (e3[t4] = r2);
          } };
        }, 845: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.trace = void 0, t3.trace = r2(997).TraceAPI.getInstance();
        }, 403: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NonRecordingSpan = void 0;
          let s2 = r2(476);
          class n2 {
            constructor(e3 = s2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t4) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t4) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t4) {
            }
          }
          t3.NonRecordingSpan = n2;
        }, 614: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracer = void 0;
          let s2 = r2(491), n2 = r2(607), i2 = r2(403), a = r2(139), o = s2.ContextAPI.getInstance();
          class l {
            startSpan(e3, t4, r3 = o.active()) {
              var s3;
              if (null == t4 ? void 0 : t4.root) return new i2.NonRecordingSpan();
              let l2 = r3 && (0, n2.getSpanContext)(r3);
              return "object" == typeof (s3 = l2) && "string" == typeof s3.spanId && "string" == typeof s3.traceId && "number" == typeof s3.traceFlags && (0, a.isSpanContextValid)(l2) ? new i2.NonRecordingSpan(l2) : new i2.NonRecordingSpan();
            }
            startActiveSpan(e3, t4, r3, s3) {
              let i3, a2, l2;
              if (arguments.length < 2) return;
              2 == arguments.length ? l2 = t4 : 3 == arguments.length ? (i3 = t4, l2 = r3) : (i3 = t4, a2 = r3, l2 = s3);
              let u = null != a2 ? a2 : o.active(), c = this.startSpan(e3, i3, u), h = (0, n2.setSpan)(u, c);
              return o.with(h, l2, void 0, c);
            }
          }
          t3.NoopTracer = l;
        }, 124: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracerProvider = void 0;
          let s2 = r2(614);
          class n2 {
            getTracer(e3, t4, r3) {
              return new s2.NoopTracer();
            }
          }
          t3.NoopTracerProvider = n2;
        }, 125: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracer = void 0;
          let s2 = new (r2(614)).NoopTracer();
          class n2 {
            constructor(e3, t4, r3, s3) {
              this._provider = e3, this.name = t4, this.version = r3, this.options = s3;
            }
            startSpan(e3, t4, r3) {
              return this._getTracer().startSpan(e3, t4, r3);
            }
            startActiveSpan(e3, t4, r3, s3) {
              let n3 = this._getTracer();
              return Reflect.apply(n3.startActiveSpan, n3, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : s2;
            }
          }
          t3.ProxyTracer = n2;
        }, 846: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracerProvider = void 0;
          let s2 = r2(125), n2 = new (r2(124)).NoopTracerProvider();
          class i2 {
            getTracer(e3, t4, r3) {
              var n3;
              return null != (n3 = this.getDelegateTracer(e3, t4, r3)) ? n3 : new s2.ProxyTracer(this, e3, t4, r3);
            }
            getDelegate() {
              var e3;
              return null != (e3 = this._delegate) ? e3 : n2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t4, r3) {
              var s3;
              return null == (s3 = this._delegate) ? void 0 : s3.getTracer(e3, t4, r3);
            }
          }
          t3.ProxyTracerProvider = i2;
        }, 996: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SamplingDecision = void 0, function(e3) {
            e3[e3.NOT_RECORD = 0] = "NOT_RECORD", e3[e3.RECORD = 1] = "RECORD", e3[e3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
          }(t3.SamplingDecision || (t3.SamplingDecision = {}));
        }, 607: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.getSpanContext = t3.setSpanContext = t3.deleteSpan = t3.setSpan = t3.getActiveSpan = t3.getSpan = void 0;
          let s2 = r2(780), n2 = r2(403), i2 = r2(491), a = (0, s2.createContextKey)("OpenTelemetry Context Key SPAN");
          function o(e3) {
            return e3.getValue(a) || void 0;
          }
          function l(e3, t4) {
            return e3.setValue(a, t4);
          }
          t3.getSpan = o, t3.getActiveSpan = function() {
            return o(i2.ContextAPI.getInstance().active());
          }, t3.setSpan = l, t3.deleteSpan = function(e3) {
            return e3.deleteValue(a);
          }, t3.setSpanContext = function(e3, t4) {
            return l(e3, new n2.NonRecordingSpan(t4));
          }, t3.getSpanContext = function(e3) {
            var t4;
            return null == (t4 = o(e3)) ? void 0 : t4.spanContext();
          };
        }, 325: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceStateImpl = void 0;
          let s2 = r2(564);
          class n2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t4) {
              let r3 = this._clone();
              return r3._internalState.has(e3) && r3._internalState.delete(e3), r3._internalState.set(e3, t4), r3;
            }
            unset(e3) {
              let t4 = this._clone();
              return t4._internalState.delete(e3), t4;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t4) => (e3.push(t4 + "=" + this.get(t4)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t4) => {
                let r3 = t4.trim(), n3 = r3.indexOf("=");
                if (-1 !== n3) {
                  let i2 = r3.slice(0, n3), a = r3.slice(n3 + 1, t4.length);
                  (0, s2.validateKey)(i2) && (0, s2.validateValue)(a) && e4.set(i2, a);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new n2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t3.TraceStateImpl = n2;
        }, 564: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.validateValue = t3.validateKey = void 0;
          let r2 = "[_0-9a-z-*/]", s2 = `[a-z]${r2}{0,255}`, n2 = `[a-z0-9]${r2}{0,240}@[a-z]${r2}{0,13}`, i2 = RegExp(`^(?:${s2}|${n2})$`), a = /^[ -~]{0,255}[!-~]$/, o = /,|=/;
          t3.validateKey = function(e3) {
            return i2.test(e3);
          }, t3.validateValue = function(e3) {
            return a.test(e3) && !o.test(e3);
          };
        }, 98: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createTraceState = void 0;
          let s2 = r2(325);
          t3.createTraceState = function(e3) {
            return new s2.TraceStateImpl(e3);
          };
        }, 476: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.INVALID_SPAN_CONTEXT = t3.INVALID_TRACEID = t3.INVALID_SPANID = void 0;
          let s2 = r2(475);
          t3.INVALID_SPANID = "0000000000000000", t3.INVALID_TRACEID = "00000000000000000000000000000000", t3.INVALID_SPAN_CONTEXT = { traceId: t3.INVALID_TRACEID, spanId: t3.INVALID_SPANID, traceFlags: s2.TraceFlags.NONE };
        }, 357: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanKind = void 0, function(e3) {
            e3[e3.INTERNAL = 0] = "INTERNAL", e3[e3.SERVER = 1] = "SERVER", e3[e3.CLIENT = 2] = "CLIENT", e3[e3.PRODUCER = 3] = "PRODUCER", e3[e3.CONSUMER = 4] = "CONSUMER";
          }(t3.SpanKind || (t3.SpanKind = {}));
        }, 139: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.wrapSpanContext = t3.isSpanContextValid = t3.isValidSpanId = t3.isValidTraceId = void 0;
          let s2 = r2(476), n2 = r2(403), i2 = /^([0-9a-f]{32})$/i, a = /^[0-9a-f]{16}$/i;
          function o(e3) {
            return i2.test(e3) && e3 !== s2.INVALID_TRACEID;
          }
          function l(e3) {
            return a.test(e3) && e3 !== s2.INVALID_SPANID;
          }
          t3.isValidTraceId = o, t3.isValidSpanId = l, t3.isSpanContextValid = function(e3) {
            return o(e3.traceId) && l(e3.spanId);
          }, t3.wrapSpanContext = function(e3) {
            return new n2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanStatusCode = void 0, function(e3) {
            e3[e3.UNSET = 0] = "UNSET", e3[e3.OK = 1] = "OK", e3[e3.ERROR = 2] = "ERROR";
          }(t3.SpanStatusCode || (t3.SpanStatusCode = {}));
        }, 475: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceFlags = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.SAMPLED = 1] = "SAMPLED";
          }(t3.TraceFlags || (t3.TraceFlags = {}));
        }, 521: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.VERSION = void 0, t3.VERSION = "1.6.0";
        } }, s = {};
        function n(e2) {
          var r2 = s[e2];
          if (void 0 !== r2) return r2.exports;
          var i2 = s[e2] = { exports: {} }, a = true;
          try {
            t2[e2].call(i2.exports, i2, i2.exports, n), a = false;
          } finally {
            a && delete s[e2];
          }
          return i2.exports;
        }
        n.ab = "//";
        var i = {};
        (() => {
          Object.defineProperty(i, "__esModule", { value: true }), i.trace = i.propagation = i.metrics = i.diag = i.context = i.INVALID_SPAN_CONTEXT = i.INVALID_TRACEID = i.INVALID_SPANID = i.isValidSpanId = i.isValidTraceId = i.isSpanContextValid = i.createTraceState = i.TraceFlags = i.SpanStatusCode = i.SpanKind = i.SamplingDecision = i.ProxyTracerProvider = i.ProxyTracer = i.defaultTextMapSetter = i.defaultTextMapGetter = i.ValueType = i.createNoopMeter = i.DiagLogLevel = i.DiagConsoleLogger = i.ROOT_CONTEXT = i.createContextKey = i.baggageEntryMetadataFromString = void 0;
          var e2 = n(369);
          Object.defineProperty(i, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
            return e2.baggageEntryMetadataFromString;
          } });
          var t3 = n(780);
          Object.defineProperty(i, "createContextKey", { enumerable: true, get: function() {
            return t3.createContextKey;
          } }), Object.defineProperty(i, "ROOT_CONTEXT", { enumerable: true, get: function() {
            return t3.ROOT_CONTEXT;
          } });
          var r2 = n(972);
          Object.defineProperty(i, "DiagConsoleLogger", { enumerable: true, get: function() {
            return r2.DiagConsoleLogger;
          } });
          var s2 = n(957);
          Object.defineProperty(i, "DiagLogLevel", { enumerable: true, get: function() {
            return s2.DiagLogLevel;
          } });
          var a = n(102);
          Object.defineProperty(i, "createNoopMeter", { enumerable: true, get: function() {
            return a.createNoopMeter;
          } });
          var o = n(901);
          Object.defineProperty(i, "ValueType", { enumerable: true, get: function() {
            return o.ValueType;
          } });
          var l = n(194);
          Object.defineProperty(i, "defaultTextMapGetter", { enumerable: true, get: function() {
            return l.defaultTextMapGetter;
          } }), Object.defineProperty(i, "defaultTextMapSetter", { enumerable: true, get: function() {
            return l.defaultTextMapSetter;
          } });
          var u = n(125);
          Object.defineProperty(i, "ProxyTracer", { enumerable: true, get: function() {
            return u.ProxyTracer;
          } });
          var c = n(846);
          Object.defineProperty(i, "ProxyTracerProvider", { enumerable: true, get: function() {
            return c.ProxyTracerProvider;
          } });
          var h = n(996);
          Object.defineProperty(i, "SamplingDecision", { enumerable: true, get: function() {
            return h.SamplingDecision;
          } });
          var d = n(357);
          Object.defineProperty(i, "SpanKind", { enumerable: true, get: function() {
            return d.SpanKind;
          } });
          var p = n(847);
          Object.defineProperty(i, "SpanStatusCode", { enumerable: true, get: function() {
            return p.SpanStatusCode;
          } });
          var f = n(475);
          Object.defineProperty(i, "TraceFlags", { enumerable: true, get: function() {
            return f.TraceFlags;
          } });
          var g = n(98);
          Object.defineProperty(i, "createTraceState", { enumerable: true, get: function() {
            return g.createTraceState;
          } });
          var m = n(139);
          Object.defineProperty(i, "isSpanContextValid", { enumerable: true, get: function() {
            return m.isSpanContextValid;
          } }), Object.defineProperty(i, "isValidTraceId", { enumerable: true, get: function() {
            return m.isValidTraceId;
          } }), Object.defineProperty(i, "isValidSpanId", { enumerable: true, get: function() {
            return m.isValidSpanId;
          } });
          var b = n(476);
          Object.defineProperty(i, "INVALID_SPANID", { enumerable: true, get: function() {
            return b.INVALID_SPANID;
          } }), Object.defineProperty(i, "INVALID_TRACEID", { enumerable: true, get: function() {
            return b.INVALID_TRACEID;
          } }), Object.defineProperty(i, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
            return b.INVALID_SPAN_CONTEXT;
          } });
          let y = n(67);
          Object.defineProperty(i, "context", { enumerable: true, get: function() {
            return y.context;
          } });
          let w = n(506);
          Object.defineProperty(i, "diag", { enumerable: true, get: function() {
            return w.diag;
          } });
          let v = n(886);
          Object.defineProperty(i, "metrics", { enumerable: true, get: function() {
            return v.metrics;
          } });
          let _ = n(939);
          Object.defineProperty(i, "propagation", { enumerable: true, get: function() {
            return _.propagation;
          } });
          let k = n(845);
          Object.defineProperty(i, "trace", { enumerable: true, get: function() {
            return k.trace;
          } }), i.default = { context: y.context, diag: w.diag, metrics: v.metrics, propagation: _.propagation, trace: k.trace };
        })(), e.exports = i;
      })();
    } }, (e) => {
      var t = e(e.s = 25);
      (_ENTRIES = "undefined" == typeof _ENTRIES ? {} : _ENTRIES).middleware_middleware = t;
    }]);
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon\\.ico|icons\\/|images\\/|logo\\.png|.*\\.svg).*))(\\.json)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/requestCache.js
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};

// node_modules/@opennextjs/aws/dist/utils/promise.js
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "eslint": { "ignoreDuringBuilds": true }, "typescript": { "ignoreBuildErrors": false, "tsconfigPath": "tsconfig.json" }, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.js", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": false, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 60, "formats": ["image/webp"], "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "remotePatterns": [], "unoptimized": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "amp": { "canonicalBase": "" }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "serverRuntimeConfig": {}, "publicRuntimeConfig": {}, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "C:\\Users\\dush3\\Downloads\\cbt\\cbt-nextjs", "experimental": { "nodeMiddleware": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 0, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 4294967294 } }, "cacheHandlers": {}, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "serverSourceMaps": false, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "clientSegmentCache": false, "dynamicOnHover": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "middlewarePrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 7, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedRoutes": false, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "useEarlyImport": false, "viewTransition": false, "routerBFCache": false, "staleTimes": { "dynamic": 0, "static": 300 }, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "dynamicIO": false, "inlineCss": false, "useCache": false, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-squlite-node", "@effect/sql-squlite-bun", "@effect/sql-squlite-wasm", "@effect/sql-squlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "Mediapartners-Google|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti", "bundlePagesRouterDependencies": false, "configFileName": "next.config.js", "turbopack": { "root": "C:\\Users\\dush3\\Downloads\\cbt\\cbt-nextjs" } };
var BuildId = "AsCQTV45dO8DJswM3zvhV";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/admision", "regex": "^/admision(?:/)?$", "routeKeys": {}, "namedRegex": "^/admision(?:/)?$" }, { "page": "/auth/reset-password", "regex": "^/auth/reset\\-password(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/reset\\-password(?:/)?$" }, { "page": "/avisos", "regex": "^/avisos(?:/)?$", "routeKeys": {}, "namedRegex": "^/avisos(?:/)?$" }, { "page": "/cambiar-contrasena", "regex": "^/cambiar\\-contrasena(?:/)?$", "routeKeys": {}, "namedRegex": "^/cambiar\\-contrasena(?:/)?$" }, { "page": "/carreras", "regex": "^/carreras(?:/)?$", "routeKeys": {}, "namedRegex": "^/carreras(?:/)?$" }, { "page": "/contacto", "regex": "^/contacto(?:/)?$", "routeKeys": {}, "namedRegex": "^/contacto(?:/)?$" }, { "page": "/dashboard/administrador", "regex": "^/dashboard/administrador(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador(?:/)?$" }, { "page": "/dashboard/administrador/admision", "regex": "^/dashboard/administrador/admision(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/admision(?:/)?$" }, { "page": "/dashboard/administrador/asistencias", "regex": "^/dashboard/administrador/asistencias(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/asistencias(?:/)?$" }, { "page": "/dashboard/administrador/audit-log", "regex": "^/dashboard/administrador/audit\\-log(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/audit\\-log(?:/)?$" }, { "page": "/dashboard/administrador/avisos", "regex": "^/dashboard/administrador/avisos(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/avisos(?:/)?$" }, { "page": "/dashboard/administrador/calificaciones", "regex": "^/dashboard/administrador/calificaciones(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/calificaciones(?:/)?$" }, { "page": "/dashboard/administrador/carreras", "regex": "^/dashboard/administrador/carreras(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/carreras(?:/)?$" }, { "page": "/dashboard/administrador/configuracion", "regex": "^/dashboard/administrador/configuracion(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/configuracion(?:/)?$" }, { "page": "/dashboard/administrador/configuracion/periodos", "regex": "^/dashboard/administrador/configuracion/periodos(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/configuracion/periodos(?:/)?$" }, { "page": "/dashboard/administrador/configuracion/roles", "regex": "^/dashboard/administrador/configuracion/roles(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/configuracion/roles(?:/)?$" }, { "page": "/dashboard/administrador/contacto", "regex": "^/dashboard/administrador/contacto(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/contacto(?:/)?$" }, { "page": "/dashboard/administrador/editar-inicio", "regex": "^/dashboard/administrador/editar\\-inicio(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/editar\\-inicio(?:/)?$" }, { "page": "/dashboard/administrador/grupos", "regex": "^/dashboard/administrador/grupos(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/grupos(?:/)?$" }, { "page": "/dashboard/administrador/horarios", "regex": "^/dashboard/administrador/horarios(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/horarios(?:/)?$" }, { "page": "/dashboard/administrador/importar-usuarios", "regex": "^/dashboard/administrador/importar\\-usuarios(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/importar\\-usuarios(?:/)?$" }, { "page": "/dashboard/administrador/inicio", "regex": "^/dashboard/administrador/inicio(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/inicio(?:/)?$" }, { "page": "/dashboard/administrador/nosotros", "regex": "^/dashboard/administrador/nosotros(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/nosotros(?:/)?$" }, { "page": "/dashboard/administrador/perfil", "regex": "^/dashboard/administrador/perfil(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/perfil(?:/)?$" }, { "page": "/dashboard/administrador/perfil/contrasena", "regex": "^/dashboard/administrador/perfil/contrasena(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/perfil/contrasena(?:/)?$" }, { "page": "/dashboard/administrador/reportes", "regex": "^/dashboard/administrador/reportes(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/reportes(?:/)?$" }, { "page": "/dashboard/administrador/usuarios", "regex": "^/dashboard/administrador/usuarios(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/administrador/usuarios(?:/)?$" }, { "page": "/dashboard/alumno", "regex": "^/dashboard/alumno(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/alumno(?:/)?$" }, { "page": "/dashboard/alumno/asistencias", "regex": "^/dashboard/alumno/asistencias(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/alumno/asistencias(?:/)?$" }, { "page": "/dashboard/alumno/avisos", "regex": "^/dashboard/alumno/avisos(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/alumno/avisos(?:/)?$" }, { "page": "/dashboard/alumno/calificaciones", "regex": "^/dashboard/alumno/calificaciones(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/alumno/calificaciones(?:/)?$" }, { "page": "/dashboard/alumno/configuracion", "regex": "^/dashboard/alumno/configuracion(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/alumno/configuracion(?:/)?$" }, { "page": "/dashboard/alumno/grupos", "regex": "^/dashboard/alumno/grupos(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/alumno/grupos(?:/)?$" }, { "page": "/dashboard/alumno/horarios", "regex": "^/dashboard/alumno/horarios(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/alumno/horarios(?:/)?$" }, { "page": "/dashboard/alumno/perfil", "regex": "^/dashboard/alumno/perfil(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/alumno/perfil(?:/)?$" }, { "page": "/dashboard/alumno/reportes", "regex": "^/dashboard/alumno/reportes(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/alumno/reportes(?:/)?$" }, { "page": "/dashboard/maestro", "regex": "^/dashboard/maestro(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/maestro(?:/)?$" }, { "page": "/dashboard/maestro/asistencias", "regex": "^/dashboard/maestro/asistencias(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/maestro/asistencias(?:/)?$" }, { "page": "/dashboard/maestro/avisos", "regex": "^/dashboard/maestro/avisos(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/maestro/avisos(?:/)?$" }, { "page": "/dashboard/maestro/calificaciones", "regex": "^/dashboard/maestro/calificaciones(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/maestro/calificaciones(?:/)?$" }, { "page": "/dashboard/maestro/configuracion", "regex": "^/dashboard/maestro/configuracion(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/maestro/configuracion(?:/)?$" }, { "page": "/dashboard/maestro/grupos", "regex": "^/dashboard/maestro/grupos(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/maestro/grupos(?:/)?$" }, { "page": "/dashboard/maestro/horarios", "regex": "^/dashboard/maestro/horarios(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/maestro/horarios(?:/)?$" }, { "page": "/dashboard/maestro/perfil", "regex": "^/dashboard/maestro/perfil(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/maestro/perfil(?:/)?$" }, { "page": "/dashboard/maestro/reportes", "regex": "^/dashboard/maestro/reportes(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/maestro/reportes(?:/)?$" }, { "page": "/dashboard/padres", "regex": "^/dashboard/padres(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/padres(?:/)?$" }, { "page": "/dashboard/padres/seleccionar-alumno", "regex": "^/dashboard/padres/seleccionar\\-alumno(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/padres/seleccionar\\-alumno(?:/)?$" }, { "page": "/login", "regex": "^/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/login(?:/)?$" }, { "page": "/nosotros", "regex": "^/nosotros(?:/)?$", "routeKeys": {}, "namedRegex": "^/nosotros(?:/)?$" }, { "page": "/recuperar-contrasena", "regex": "^/recuperar\\-contrasena(?:/)?$", "routeKeys": {}, "namedRegex": "^/recuperar\\-contrasena(?:/)?$" }], "dynamic": [{ "page": "/api/admin/usuarios/[id]", "regex": "^/api/admin/usuarios/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/usuarios/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/avisos/[id]", "regex": "^/api/avisos/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/avisos/(?<nxtPid>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": {}, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "65c64d7740c55dfd69f734260e37d49b", "previewModeSigningKey": "ea3b7c3d3b0b81cf03f660ee3aeb5372c01ade4f6d80c587d5cea172c6935d88", "previewModeEncryptionKey": "522687106d116d0bb520c8c631f81dc7026726e01a7682914f7b58738c729e03" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/middleware.js"], "name": "middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon\\.ico|icons\\/|images\\/|logo\\.png|.*\\.svg).*))(\\.json)?[\\/#\\?]?$", "originalSource": "/((?!_next/static|_next/image|favicon\\.ico|icons/|images/|logo\\.png|.*\\.svg).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "AsCQTV45dO8DJswM3zvhV", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "vGr/5OoJNGmTPcLtUxlEg2ru0PccTyOL4EaqNjedDfs=", "__NEXT_PREVIEW_MODE_ID": "65c64d7740c55dfd69f734260e37d49b", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "522687106d116d0bb520c8c631f81dc7026726e01a7682914f7b58738c729e03", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "ea3b7c3d3b0b81cf03f660ee3aeb5372c01ade4f6d80c587d5cea172c6935d88" } } }, "functions": {}, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/api/admin/admision-config/route": "/api/admin/admision-config", "/api/admin/audit-log/route": "/api/admin/audit-log", "/api/admin/config/route": "/api/admin/config", "/api/admin/reportes/route": "/api/admin/reportes", "/api/admin/importar-usuarios/route": "/api/admin/importar-usuarios", "/api/admin/usuarios/[id]/route": "/api/admin/usuarios/[id]", "/api/admin/usuarios/route": "/api/admin/usuarios", "/api/asistencias/route": "/api/asistencias", "/api/auth/cambiar-contrasena/route": "/api/auth/cambiar-contrasena", "/api/auth/forgot-password/route": "/api/auth/forgot-password", "/api/auth/login/route": "/api/auth/login", "/api/auth/logout/route": "/api/auth/logout", "/api/auth/verify-email/route": "/api/auth/verify-email", "/api/avisos/[id]/route": "/api/avisos/[id]", "/api/auth/reset-password/route": "/api/auth/reset-password", "/api/avisos/route": "/api/avisos", "/api/calificaciones/route": "/api/calificaciones", "/api/grupos/route": "/api/grupos", "/api/horarios/route": "/api/horarios", "/api/padres/asistencias/route": "/api/padres/asistencias", "/api/padres/vincular-alumno/route": "/api/padres/vincular-alumno", "/api/padres/mis-alumnos/route": "/api/padres/mis-alumnos", "/api/perfil/cambiar-contrasena/route": "/api/perfil/cambiar-contrasena", "/api/perfil/route": "/api/perfil", "/api/storage/upload/route": "/api/storage/upload", "/api/padres/calificaciones/route": "/api/padres/calificaciones", "/auth/reset-password/page": "/auth/reset-password", "/avisos/page": "/avisos", "/cambiar-contrasena/page": "/cambiar-contrasena", "/contacto/page": "/contacto", "/dashboard/administrador/asistencias/page": "/dashboard/administrador/asistencias", "/dashboard/administrador/admision/page": "/dashboard/administrador/admision", "/dashboard/administrador/audit-log/page": "/dashboard/administrador/audit-log", "/dashboard/administrador/calificaciones/page": "/dashboard/administrador/calificaciones", "/dashboard/administrador/avisos/page": "/dashboard/administrador/avisos", "/dashboard/administrador/carreras/page": "/dashboard/administrador/carreras", "/dashboard/administrador/configuracion/page": "/dashboard/administrador/configuracion", "/dashboard/administrador/configuracion/periodos/page": "/dashboard/administrador/configuracion/periodos", "/dashboard/administrador/contacto/page": "/dashboard/administrador/contacto", "/dashboard/administrador/configuracion/roles/page": "/dashboard/administrador/configuracion/roles", "/dashboard/administrador/editar-inicio/page": "/dashboard/administrador/editar-inicio", "/dashboard/administrador/grupos/page": "/dashboard/administrador/grupos", "/dashboard/administrador/horarios/page": "/dashboard/administrador/horarios", "/dashboard/administrador/importar-usuarios/page": "/dashboard/administrador/importar-usuarios", "/dashboard/administrador/inicio/page": "/dashboard/administrador/inicio", "/dashboard/administrador/nosotros/page": "/dashboard/administrador/nosotros", "/dashboard/administrador/page": "/dashboard/administrador", "/dashboard/administrador/perfil/contrasena/page": "/dashboard/administrador/perfil/contrasena", "/dashboard/administrador/perfil/page": "/dashboard/administrador/perfil", "/dashboard/administrador/reportes/page": "/dashboard/administrador/reportes", "/dashboard/administrador/usuarios/page": "/dashboard/administrador/usuarios", "/dashboard/alumno/avisos/page": "/dashboard/alumno/avisos", "/dashboard/alumno/calificaciones/page": "/dashboard/alumno/calificaciones", "/dashboard/alumno/configuracion/page": "/dashboard/alumno/configuracion", "/dashboard/alumno/asistencias/page": "/dashboard/alumno/asistencias", "/dashboard/alumno/horarios/page": "/dashboard/alumno/horarios", "/dashboard/alumno/grupos/page": "/dashboard/alumno/grupos", "/dashboard/alumno/page": "/dashboard/alumno", "/dashboard/alumno/perfil/page": "/dashboard/alumno/perfil", "/dashboard/alumno/reportes/page": "/dashboard/alumno/reportes", "/dashboard/maestro/asistencias/page": "/dashboard/maestro/asistencias", "/dashboard/maestro/avisos/page": "/dashboard/maestro/avisos", "/dashboard/maestro/calificaciones/page": "/dashboard/maestro/calificaciones", "/dashboard/maestro/configuracion/page": "/dashboard/maestro/configuracion", "/dashboard/maestro/grupos/page": "/dashboard/maestro/grupos", "/dashboard/maestro/horarios/page": "/dashboard/maestro/horarios", "/dashboard/maestro/page": "/dashboard/maestro", "/dashboard/maestro/perfil/page": "/dashboard/maestro/perfil", "/dashboard/maestro/reportes/page": "/dashboard/maestro/reportes", "/dashboard/padres/page": "/dashboard/padres", "/dashboard/padres/seleccionar-alumno/page": "/dashboard/padres/seleccionar-alumno", "/page": "/", "/login/page": "/login", "/nosotros/page": "/nosotros", "/recuperar-contrasena/page": "/recuperar-contrasena", "/admision/page": "/admision", "/carreras/page": "/carreras" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/_error": "pages/_error.js", "/_app": "pages/_app.js", "/_document": "pages/_document.js" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    const nextUrl = constructNextUrl(internalEvent.url, `/${detectedLocale}${NextConfig.trailingSlash ? "/" : ""}`);
    const queryString = convertToQueryString(internalEvent.query);
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: `${nextUrl}${queryString}`
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location2, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location2)) {
    return location2;
  }
  const locationURL = new URL(location2);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/semver.js
function compareSemver(v1, operator, v2) {
  let versionDiff = 0;
  if (v1 === "latest") {
    versionDiff = 1;
  } else {
    if (/^[^\d]/.test(v1)) {
      v1 = v1.substring(1);
    }
    if (/^[^\d]/.test(v2)) {
      v2 = v2.substring(1);
    }
    const [major1, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
    const [major2, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);
    if (Number.isNaN(major1) || Number.isNaN(major2)) {
      throw new Error("The major version is required.");
    }
    if (major1 !== major2) {
      versionDiff = major1 - major2;
    } else if (minor1 !== minor2) {
      versionDiff = minor1 - minor2;
    } else if (patch1 !== patch2) {
      versionDiff = patch1 - patch2;
    }
  }
  switch (operator) {
    case "=":
      return versionDiff === 0;
    case ">=":
      return versionDiff >= 0;
    case "<=":
      return versionDiff <= 0;
    case ">":
      return versionDiff > 0;
    case "<":
      return versionDiff < 0;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// node_modules/@opennextjs/aws/dist/utils/cache.js
async function isStale(key, tags, lastModified) {
  if (!compareSemver(globalThis.nextVersion, ">=", "16.0.0")) {
    return false;
  }
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.isStale?.(tags, lastModified) ?? false;
  }
  return await globalThis.tagCache.isStale?.(key, lastModified) ?? false;
}
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified, isStaleFromTagCache = false) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  const isSSG = finalRevalidate === CACHE_ONE_YEAR;
  const remainingTtl = Math.max(finalRevalidate - age, 1);
  const isStaleFromTime = !isSSG && remainingTtl === 1;
  const isStale2 = isStaleFromTime || isStaleFromTagCache;
  if (!isSSG || isStaleFromTagCache) {
    const sMaxAge = isStaleFromTagCache ? 1 : remainingTtl;
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate,
      isStaleFromTagCache
    });
    if (isStale2) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale2 ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {}) && !NextConfig.experimental?.prefetchInlining;
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified, isStaleFromTagCache = false) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = Boolean(event.headers.rsc);
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified, isStaleFromTagCache);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      const tags = getTagsFromValue(cachedData.value);
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const _isStale = cachedData.shouldBypassTagCache ? false : await isStale(localizedPath, tags, cachedData.lastModified ?? Date.now());
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified, _isStale);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
