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
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@sveltejs/kit/src/exports/internal/remote-functions.js
var init_remote_functions = __esm({
  "node_modules/@sveltejs/kit/src/exports/internal/remote-functions.js"() {
  }
});

// node_modules/@sveltejs/kit/src/exports/internal/index.js
var HttpError, Redirect, SvelteKitError, ActionFailure;
var init_internal = __esm({
  "node_modules/@sveltejs/kit/src/exports/internal/index.js"() {
    init_remote_functions();
    HttpError = class {
      /**
       * @param {number} status
       * @param {{message: string} extends App.Error ? (App.Error | string | undefined) : App.Error} body
       */
      constructor(status, body2) {
        this.status = status;
        if (typeof body2 === "string") {
          this.body = { message: body2 };
        } else if (body2) {
          this.body = body2;
        } else {
          this.body = { message: `Error: ${status}` };
        }
      }
      toString() {
        return JSON.stringify(this.body);
      }
    };
    Redirect = class {
      /**
       * @param {300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308} status
       * @param {string} location
       */
      constructor(status, location) {
        this.status = status;
        this.location = location;
      }
    };
    SvelteKitError = class extends Error {
      /**
       * @param {number} status
       * @param {string} text
       * @param {string} message
       */
      constructor(status, text2, message) {
        super(message);
        this.status = status;
        this.text = text2;
      }
    };
    ActionFailure = class {
      /**
       * @param {number} status
       * @param {T} data
       */
      constructor(status, data) {
        this.status = status;
        this.data = data;
      }
    };
  }
});

// node_modules/@sveltejs/kit/src/runtime/server/constants.js
var IN_WEBCONTAINER;
var init_constants = __esm({
  "node_modules/@sveltejs/kit/src/runtime/server/constants.js"() {
    IN_WEBCONTAINER = !!globalThis.process?.versions?.webcontainer;
  }
});

// node_modules/@sveltejs/kit/src/exports/internal/event.js
function with_request_store(store, fn) {
  try {
    sync_store = store;
    return als ? als.run(store, fn) : fn();
  } finally {
    if (!IN_WEBCONTAINER) {
      sync_store = null;
    }
  }
}
var sync_store, als;
var init_event = __esm({
  "node_modules/@sveltejs/kit/src/exports/internal/event.js"() {
    init_constants();
    sync_store = null;
    import("node:async_hooks").then((hooks) => als = new hooks.AsyncLocalStorage()).catch(() => {
    });
  }
});

// node_modules/@sveltejs/kit/src/exports/internal/server.js
function merge_tracing(event_like, current2) {
  return {
    ...event_like,
    tracing: {
      ...event_like.tracing,
      current: current2
    }
  };
}
var init_server = __esm({
  "node_modules/@sveltejs/kit/src/exports/internal/server.js"() {
    init_event();
  }
});

// .svelte-kit/output/server/chunks/utils.js
function get_relative_path(from, to) {
  const from_parts = from.split(/[/\\]/);
  const to_parts = to.split(/[/\\]/);
  from_parts.pop();
  while (from_parts[0] === to_parts[0]) {
    from_parts.shift();
    to_parts.shift();
  }
  let i = from_parts.length;
  while (i--) from_parts[i] = "..";
  return from_parts.concat(to_parts).join("/");
}
function base64_encode(bytes) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function base64_decode(encoded) {
  if (globalThis.Buffer) {
    const buffer = globalThis.Buffer.from(encoded, "base64");
    return new Uint8Array(buffer);
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
var text_encoder2, text_decoder2;
var init_utils = __esm({
  ".svelte-kit/output/server/chunks/utils.js"() {
    text_encoder2 = new TextEncoder();
    text_decoder2 = new TextDecoder();
  }
});

// .svelte-kit/output/server/chunks/exports.js
function resolve(base2, path) {
  if (path[0] === "/" && path[1] === "/") return path;
  let url = new URL(base2, internal);
  url = new URL(path, url);
  return url.protocol === internal.protocol ? url.pathname + url.search + url.hash : url.href;
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore") return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
function decode_pathname(pathname) {
  return pathname.split("%25").map(decodeURI).join("%25");
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = decodeURIComponent(params[key2]);
  }
  return params;
}
function make_trackable(url, callback, search_params_callback, allow_hash = false) {
  const tracked = new URL(url);
  Object.defineProperty(tracked, "searchParams", {
    value: new Proxy(tracked.searchParams, {
      get(obj, key2) {
        if (key2 === "get" || key2 === "getAll" || key2 === "has") {
          return (param, ...rest) => {
            search_params_callback(param);
            return obj[key2](param, ...rest);
          };
        }
        callback();
        const value = Reflect.get(obj, key2);
        return typeof value === "function" ? value.bind(obj) : value;
      }
    }),
    enumerable: true,
    configurable: true
  });
  const tracked_url_properties = ["href", "pathname", "search", "toString", "toJSON"];
  if (allow_hash) tracked_url_properties.push("hash");
  for (const property of tracked_url_properties) {
    Object.defineProperty(tracked, property, {
      get() {
        callback();
        return url[property];
      },
      enumerable: true,
      configurable: true
    });
  }
  {
    tracked[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url, opts);
    };
    tracked.searchParams[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url.searchParams, opts);
    };
  }
  if (!allow_hash) {
    disable_hash(tracked);
  }
  return tracked;
}
function disable_hash(url) {
  allow_nodejs_console_log(url);
  Object.defineProperty(url, "hash", {
    get() {
      throw new Error(
        "Cannot access event.url.hash. Consider using `page.url.hash` inside a component instead"
      );
    }
  });
}
function disable_search(url) {
  allow_nodejs_console_log(url);
  for (const property of ["search", "searchParams"]) {
    Object.defineProperty(url, property, {
      get() {
        throw new Error(`Cannot access url.${property} on a page with prerendering enabled`);
      }
    });
  }
}
function allow_nodejs_console_log(url) {
  {
    url[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(new URL(url), opts);
    };
  }
}
function validator(expected) {
  function validate(module, file) {
    if (!module) return;
    for (const key2 in module) {
      if (key2[0] === "_" || expected.has(key2)) continue;
      const values = [...expected.values()];
      const hint = hint_for_supported_files(key2, file?.slice(file.lastIndexOf("."))) ?? `valid exports are ${values.join(", ")}, or anything with a '_' prefix`;
      throw new Error(`Invalid export '${key2}'${file ? ` in ${file}` : ""} (${hint})`);
    }
  }
  return validate;
}
function hint_for_supported_files(key2, ext = ".js") {
  const supported_files = [];
  if (valid_layout_exports.has(key2)) {
    supported_files.push(`+layout${ext}`);
  }
  if (valid_page_exports.has(key2)) {
    supported_files.push(`+page${ext}`);
  }
  if (valid_layout_server_exports.has(key2)) {
    supported_files.push(`+layout.server${ext}`);
  }
  if (valid_page_server_exports.has(key2)) {
    supported_files.push(`+page.server${ext}`);
  }
  if (valid_server_exports.has(key2)) {
    supported_files.push(`+server${ext}`);
  }
  if (supported_files.length > 0) {
    return `'${key2}' is a valid export in ${supported_files.slice(0, -1).join(", ")}${supported_files.length > 1 ? " or " : ""}${supported_files.at(-1)}`;
  }
}
var internal, valid_layout_exports, valid_page_exports, valid_layout_server_exports, valid_page_server_exports, valid_server_exports, validate_layout_exports, validate_page_exports, validate_layout_server_exports, validate_page_server_exports, validate_server_exports;
var init_exports = __esm({
  ".svelte-kit/output/server/chunks/exports.js"() {
    internal = new URL("sveltekit-internal://");
    valid_layout_exports = /* @__PURE__ */ new Set([
      "load",
      "prerender",
      "csr",
      "ssr",
      "trailingSlash",
      "config"
    ]);
    valid_page_exports = /* @__PURE__ */ new Set([...valid_layout_exports, "entries"]);
    valid_layout_server_exports = /* @__PURE__ */ new Set([...valid_layout_exports]);
    valid_page_server_exports = /* @__PURE__ */ new Set([...valid_layout_server_exports, "actions", "entries"]);
    valid_server_exports = /* @__PURE__ */ new Set([
      "GET",
      "POST",
      "PATCH",
      "PUT",
      "DELETE",
      "OPTIONS",
      "HEAD",
      "fallback",
      "prerender",
      "trailingSlash",
      "config",
      "entries"
    ]);
    validate_layout_exports = validator(valid_layout_exports);
    validate_page_exports = validator(valid_page_exports);
    validate_layout_server_exports = validator(valid_layout_server_exports);
    validate_page_server_exports = validator(valid_page_server_exports);
    validate_server_exports = validator(valid_server_exports);
  }
});

// .svelte-kit/output/server/chunks/ssr.js
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
function set_current_component(component9) {
  current_component = component9;
}
function get_current_component() {
  if (!current_component) throw new Error("Function called outside component initialization");
  return current_component;
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component9 = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component9.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(
        /** @type {string} */
        type,
        detail,
        { cancelable }
      );
      callbacks.slice().forEach((fn) => {
        fn.call(component9, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
  return context;
}
function getContext(key2) {
  return get_current_component().$$.context.get(key2);
}
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function escape(value, is_attr = false) {
  const str = String(value);
  const pattern2 = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern2.lastIndex = 0;
  let escaped2 = "";
  let last = 0;
  while (pattern2.test(str)) {
    const i = pattern2.lastIndex - 1;
    const ch = str[i];
    escaped2 += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped2 + str.substring(last);
}
function each(items, fn) {
  items = ensure_array_like(items);
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
function validate_component(component9, name) {
  if (!component9 || !component9.$$render) {
    if (name === "svelte:component") name += " this={...}";
    throw new Error(
      `<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`
    );
  }
  return component9;
}
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      // these will be immediately discarded
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css4) => css4.code).join("\n"),
          map: null
          // TODO
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean) return "";
  const assignment = `="${escape(value, true)}"`;
  return ` ${name}${assignment}`;
}
var current_component, ATTR_REGEX, CONTENT_REGEX, missing_component, on_destroy;
var init_ssr = __esm({
  ".svelte-kit/output/server/chunks/ssr.js"() {
    ATTR_REGEX = /[&"<]/g;
    CONTENT_REGEX = /[&<]/g;
    missing_component = {
      $$render: () => ""
    };
  }
});

// .svelte-kit/output/server/chunks/index.js
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set, update) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set, update);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store, i) => subscribe(
        store,
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
var subscriber_queue;
var init_chunks = __esm({
  ".svelte-kit/output/server/chunks/index.js"() {
    init_ssr();
    subscriber_queue = [];
  }
});

// .svelte-kit/output/server/chunks/ssr2.js
function onMount() {
}
function afterUpdate() {
}
var init_ssr2 = __esm({
  ".svelte-kit/output/server/chunks/ssr2.js"() {
  }
});

// node_modules/cookie/index.js
var require_cookie = __commonJS({
  "node_modules/cookie/index.js"(exports) {
    "use strict";
    exports.parse = parse3;
    exports.serialize = serialize2;
    var __toString = Object.prototype.toString;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse3(str, options2) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options2 || {};
      var dec = opt.decode || decode;
      var index9 = 0;
      while (index9 < str.length) {
        var eqIdx = str.indexOf("=", index9);
        if (eqIdx === -1) {
          break;
        }
        var endIdx = str.indexOf(";", index9);
        if (endIdx === -1) {
          endIdx = str.length;
        } else if (endIdx < eqIdx) {
          index9 = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var key2 = str.slice(index9, eqIdx).trim();
        if (void 0 === obj[key2]) {
          var val = str.slice(eqIdx + 1, endIdx).trim();
          if (val.charCodeAt(0) === 34) {
            val = val.slice(1, -1);
          }
          obj[key2] = tryDecode(val, dec);
        }
        index9 = endIdx + 1;
      }
      return obj;
    }
    function serialize2(name, val, options2) {
      var opt = options2 || {};
      var enc = opt.encode || encode2;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.partitioned) {
        str += "; Partitioned";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
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
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function decode(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    function encode2(val) {
      return encodeURIComponent(val);
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]" || val instanceof Date;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e3) {
        return str;
      }
    }
  }
});

// .svelte-kit/output/server/chunks/auth.js
function createAuthStore() {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("auth") : null;
  const initial2 = stored ? JSON.parse(stored) : { token: null, user: null };
  const { subscribe: subscribe2, set } = writable(initial2);
  return {
    subscribe: subscribe2,
    login(token, user) {
      const state = { token, user };
      set(state);
      localStorage.setItem("auth", JSON.stringify(state));
      localStorage.setItem("auth_token", token);
    },
    logout() {
      set({ token: null, user: null });
      localStorage.removeItem("auth");
      localStorage.removeItem("auth_token");
    }
  };
}
var authStore, currentUser;
var init_auth = __esm({
  ".svelte-kit/output/server/chunks/auth.js"() {
    init_chunks();
    authStore = createAuthStore();
    derived(authStore, ($a) => !!$a.token);
    currentUser = derived(authStore, ($a) => $a.user);
  }
});

// .svelte-kit/output/server/chunks/ConfirmModal.js
async function apiFetch(path, init2) {
  const token = get_store_value(authStore).token;
  const res = await fetch(`${BASE}${path}`, {
    ...init2,
    headers: {
      "Content-Type": "application/json",
      ...token ? { Authorization: `Bearer ${token}` } : {},
      ...init2?.headers
    }
  });
  if (!res.ok) {
    const body2 = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body2.message ?? "Unknown error");
  }
  if (res.status === 204) return void 0;
  return res.json();
}
function logout() {
  authStore.logout();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
function getUser() {
  return get_store_value(authStore).user;
}
async function fetchBalance() {
  const data = await apiFetch("/api/me/quota");
  return {
    balance_gb: data.quota_gb,
    total_spent_usd: 0,
    // Mocked for now since DB tracks total_purchased_bytes
    is_telegram_user: !!getUser()?.telegram_id
  };
}
function createJobsStore() {
  const { subscribe: subscribe2, set, update } = writable([]);
  return {
    subscribe: subscribe2,
    load: async () => set(await jobsApi.list()),
    add: (job) => update((list) => [job, ...list]),
    updateOne: (id, patch) => update((list) => list.map((j) => j.id === id ? { ...j, ...patch } : j)),
    cancel: async (id) => {
      await jobsApi.cancel(id);
      update((list) => list.map((j) => j.id === id ? { ...j, status: "cancelled" } : j));
    }
  };
}
function createOrdersStore() {
  const { subscribe: subscribe2, set, update } = writable([]);
  return {
    subscribe: subscribe2,
    load: async () => set(await ordersApi.list()),
    add: (order) => update((list) => [order, ...list])
  };
}
function createQuotaStore() {
  const { subscribe: subscribe2, set } = writable(null);
  return {
    subscribe: subscribe2,
    load: async () => {
      try {
        set(await quotaApi.get());
      } catch {
      }
    },
    refresh: async () => {
      set(await quotaApi.get());
    },
    clear: () => set(null)
  };
}
var ApiError, BASE, jobsApi, ordersApi, quotaApi, jobsStore, authModalOpen, userStore, ConfirmModal;
var init_ConfirmModal = __esm({
  ".svelte-kit/output/server/chunks/ConfirmModal.js"() {
    init_chunks();
    init_auth();
    init_ssr();
    ApiError = class extends Error {
      constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "ApiError";
      }
    };
    BASE = "https://api.fastbaidu.app";
    jobsApi = {
      list: () => apiFetch("/api/jobs"),
      create: (type, payload) => apiFetch("/api/jobs", {
        method: "POST",
        body: JSON.stringify({ type, payload })
      }),
      get: (id) => apiFetch(`/api/jobs/${id}`),
      cancel: (id) => apiFetch(`/api/jobs/${id}`, { method: "DELETE" })
    };
    ordersApi = {
      list: () => apiFetch("/api/orders"),
      create: (plan, paymentMethod) => apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ plan, payment_method: paymentMethod })
      }),
      capturePaypal: (token) => apiFetch("/api/orders/capture-paypal", {
        method: "POST",
        body: JSON.stringify({ token })
      })
    };
    quotaApi = {
      get: () => apiFetch("/api/me/quota")
    };
    jobsStore = createJobsStore();
    derived(
      jobsStore,
      ($j) => $j.filter((j) => j.status === "pending" || j.status === "running")
    );
    derived(
      jobsStore,
      ($j) => $j.filter((j) => j.status === "done" || j.status === "failed" || j.status === "cancelled")
    );
    createOrdersStore();
    createQuotaStore();
    authModalOpen = writable(false);
    userStore = currentUser;
    ConfirmModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { open = false } = $$props;
      let { title = "Confirm Action" } = $$props;
      let { message = "Are you sure you want to proceed?" } = $$props;
      let { confirmText = "Confirm" } = $$props;
      let { cancelText = "Cancel" } = $$props;
      let { icon = "\u26A0\uFE0F" } = $$props;
      let { confirmClass = "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 shadow-red-500/20" } = $$props;
      let { onConfirm = () => {
      } } = $$props;
      createEventDispatcher();
      if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
      if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
      if ($$props.message === void 0 && $$bindings.message && message !== void 0) $$bindings.message(message);
      if ($$props.confirmText === void 0 && $$bindings.confirmText && confirmText !== void 0) $$bindings.confirmText(confirmText);
      if ($$props.cancelText === void 0 && $$bindings.cancelText && cancelText !== void 0) $$bindings.cancelText(cancelText);
      if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0) $$bindings.icon(icon);
      if ($$props.confirmClass === void 0 && $$bindings.confirmClass && confirmClass !== void 0) $$bindings.confirmClass(confirmClass);
      if ($$props.onConfirm === void 0 && $$bindings.onConfirm && onConfirm !== void 0) $$bindings.onConfirm(onConfirm);
      return `${open ? `<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm transition-opacity" role="dialog" aria-modal="true"> <div class="bg-surface-900 border border-surface-700/50 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-fade-in relative z-10"><div class="text-4xl mb-4">${escape(icon)}</div> <h3 class="text-lg font-bold text-white mb-2">${escape(title)}</h3> <p class="text-sm text-surface-400 mb-6 font-medium">${escape(message)}</p> ${``} <div class="flex gap-3"><button ${""} class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-white border border-surface-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">${escape(cancelText)}</button> <button ${""} class="${"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed " + escape(confirmClass, true)}">${`<span class="relative z-10">${escape(confirmText)}</span>`}</button></div></div></div>` : ``}`;
    });
  }
});

// .svelte-kit/output/server/chunks/logo.js
var logoIcon;
var init_logo = __esm({
  ".svelte-kit/output/server/chunks/logo.js"() {
    logoIcon = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20version='1.1'%20width='445'%20height='476'%20viewBox='0%200%201780%201904'%3e%3cdesc%3eCreated%20with%20SVGMaker%20Editor%202.2.3%3c/desc%3e%3cdefs%3e%3c/defs%3e%3cpath%20transform='translate(0,0)'%20style='fill:%20rgb(153,253,90)'%20stroke-linecap='round'%20d='M%20717.655%20233.971%20L%201497.99%20233.969%20C%201486.85%20247.752%201471.84%20270.303%201460.96%20285.437%20C%201433.94%20322.758%201407.27%20360.321%201380.93%20398.122%20C%201362%20425.244%201342.45%20452.131%201324.09%20479.599%20C%201317.26%20489.806%201307.59%20503.34%201301.76%20513.878%20C%201271.87%20512.98%201239.04%20514.129%201208.88%20513.873%20C%201127.63%20513.182%201045.45%20515.044%20964.281%20513.808%20C%20957.552%20531.968%20940.339%20566.288%20931.575%20585.213%20L%20859.246%20741.017%20C%20889.788%20742.418%20923.297%20741.891%20954.013%20741.926%20L%201097.35%20742.145%20C%201123.97%20742.181%201153.17%20741.6%201179.51%20742.989%20L%20777.534%201272.41%20C%20753.812%201304.31%20728.859%201335.88%20704.784%201367.59%20L%20518.556%201612.97%20C%20489.072%201651.86%20459.138%201690.7%20431.174%201730.7%20C%20425.076%201739.42%20419.402%201748.29%20412.837%201756.69%20C%20415.294%201744.8%20431.439%201704.44%20436.821%201689.7%20C%20455.379%201637.97%20474.364%201586.4%20493.772%201534.99%20L%20619.41%201195.56%20L%20660.456%201085.26%20C%20669.693%201060.15%20678.813%201033.81%20688.594%201009.04%20C%20679.806%201009.95%20666.864%201009.41%20657.753%201009.33%20C%20640.906%201009.15%20624.057%201009.09%20607.209%201009.15%20C%20550.654%201009.79%20494.093%201009.79%20437.538%201009.17%20C%20444.527%20992.346%20451.099%20972.85%20457.315%20955.565%20L%20492.039%20858.812%20L%20615.134%20518.799%20L%20685.906%20324.149%20L%20706.313%20267.639%20C%20709.666%20258.323%20715.648%20243.124%20717.655%20233.971%20Z'/%3e%3c/svg%3e";
  }
});

// .svelte-kit/output/server/entries/pages/_layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => Layout
});
var AuthModal, Layout;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_layout.svelte.js"() {
    init_ssr();
    init_ConfirmModal();
    init_auth();
    init_logo();
    AuthModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { open = false } = $$props;
      let email = "";
      let password = "";
      if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
      return ` ${open ? `<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm" role="dialog" aria-modal="true">  <div class="absolute inset-0 cursor-default" role="button" tabindex="0"></div> <div class="relative w-full max-w-md bg-surface-900 border border-surface-700/80 rounded-3xl shadow-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]"> <button class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700 transition-colors focus:outline-none" aria-label="Close" data-svelte-h="svelte-1gpuzt6"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>  <div class="pt-8 pb-4 text-center"><div class="w-14 h-14 mx-auto mb-4 opacity-90 drop-shadow-lg"><img${add_attribute("src", logoIcon, 0)} alt="FastBaidu" class="w-full h-full object-contain"> <div style="display:none" class="w-full h-full text-4xl" data-svelte-h="svelte-1cnvm17">\u26A1</div></div> <h2 class="text-xl font-bold text-white tracking-tight" data-svelte-h="svelte-irhnj9">Welcome to FastBaidu</h2></div>  <div class="flex mx-6 mb-4 bg-surface-800 rounded-xl p-1"><button class="${"flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all " + escape(
        "bg-brand-500 text-white shadow-lg",
        true
      )}">\u2709\uFE0F Email</button> <button class="${"flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all " + escape(
        "text-surface-400 hover:text-white",
        true
      )}">\u{1F4F1} Telegram</button></div>  <div class="px-6 pb-6">${``} ${``} ${` <p class="text-surface-500 text-xs text-center mb-4" data-svelte-h="svelte-1shbm5w"><span class="text-blue-400">Tip:</span> Link your Telegram later in the dashboard to get +1.00 GB free quota!</p> ${` <form class="space-y-3"><input type="email" placeholder="Email address" class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm" required${add_attribute("value", email, 0)}> <input type="password" placeholder="Password" class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm" required${add_attribute("value", password, 0)}> <button type="submit" ${""} class="w-full py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">${escape("Sign In")}</button></form> <div class="mt-4 flex justify-between text-xs"><button class="text-brand-400 hover:underline" data-svelte-h="svelte-14x9ef2">Create account</button> <button class="text-surface-400 hover:text-white" data-svelte-h="svelte-8xuewb">Forgot password?</button></div>`}`}</div>  <div class="px-6 pb-6" data-svelte-h="svelte-nxq99i"><p class="text-xs text-surface-500 text-center max-w-[280px] mx-auto">By signing in, you agree to our <a href="/terms" class="text-brand-400 hover:underline">Terms</a> and <a href="/privacy" class="text-brand-400 hover:underline">Privacy Policy</a></p></div></div></div>` : ``}`;
    });
    Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $userStore, $$unsubscribe_userStore;
      let $authModalOpen, $$unsubscribe_authModalOpen;
      $$unsubscribe_userStore = subscribe(userStore, (value) => $userStore = value);
      $$unsubscribe_authModalOpen = subscribe(authModalOpen, (value) => $authModalOpen = value);
      let userBalance = null;
      let logoutModalOpen = false;
      function confirmLogout() {
        logout();
        logoutModalOpen = false;
      }
      let $$settled;
      let $$rendered;
      let previous_head = $$result.head;
      do {
        $$settled = true;
        $$result.head = previous_head;
        {
          if ($userStore && userBalance === null) {
            fetchBalance().then((b) => userBalance = b).catch(() => userBalance = null);
          } else if (!$userStore) {
            userBalance = null;
          }
        }
        $$rendered = `${$$result.head += `<!-- HEAD_svelte-1u1hvv4_START --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"><!-- HEAD_svelte-1u1hvv4_END -->`, ""} <div class="min-h-screen flex flex-col bg-surface-950 text-surface-50"> <nav class="sticky top-0 z-50 bg-surface-950/90 backdrop-blur-md"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center h-16"> <a href="/" class="flex items-center gap-3 group mr-auto" data-svelte-h="svelte-7x2dkf"><img${add_attribute("src", logoIcon, 0)} alt="FastBaidu Logo" class="w-9 h-9 drop-shadow-md group-hover:drop-shadow-lg transition-all group-hover:scale-105"> <span class="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">FastBaidu</span></a>  <div class="flex items-center gap-3 relative">${` <div class="w-8 h-8 rounded-full bg-surface-800/50 animate-pulse"></div>`}</div></div></div></nav>  <main class="flex-1">${slots.default ? slots.default({}) : ``}</main>  <footer class="border-t border-surface-800/50 bg-surface-950/80" data-svelte-h="svelte-1snbkkx"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="flex flex-col md:flex-row justify-between items-center gap-4"><div class="flex items-center gap-2 text-surface-500 text-sm"><img${add_attribute("src", logoIcon, 0)} alt="FastBaidu Logo" class="w-6 h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"> <span>FastBaidu \u2014 Download without limits.</span></div> <div class="flex flex-wrap justify-center gap-6 text-sm text-surface-500 font-medium"><a href="/blog" class="hover:text-surface-300 transition-colors">Blog</a> <a href="/faq" class="hover:text-surface-300 transition-colors">FAQ</a> <a href="/about" class="hover:text-surface-300 transition-colors">About</a> <a href="/privacy" class="hover:text-surface-300 transition-colors">Privacy</a> <a href="/terms" class="hover:text-surface-300 transition-colors">Terms</a> <a href="/contact" class="hover:text-surface-300 transition-colors">Contact</a> <a href="https://t.me/fastbaidu" class="hover:text-surface-300 transition-colors" target="_blank" rel="noopener">Telegram</a></div></div></div></footer> ${validate_component(AuthModal, "AuthModal").$$render(
          $$result,
          { open: $authModalOpen },
          {
            open: ($$value) => {
              $authModalOpen = $$value;
              $$settled = false;
            }
          },
          {}
        )} ${validate_component(ConfirmModal, "ConfirmModal").$$render(
          $$result,
          {
            title: "Sign Out",
            message: "Are you sure you want to sign out of your account?",
            confirmText: "Sign Out",
            cancelText: "Cancel",
            icon: "\u{1F6AA}",
            onConfirm: confirmLogout,
            open: logoutModalOpen
          },
          {
            open: ($$value) => {
              logoutModalOpen = $$value;
              $$settled = false;
            }
          },
          {}
        )}</div>`;
      } while (!$$settled);
      $$unsubscribe_userStore();
      $$unsubscribe_authModalOpen();
      return $$rendered;
    });
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  component: () => component,
  fonts: () => fonts,
  imports: () => imports,
  index: () => index,
  stylesheets: () => stylesheets
});
var index, component_cache, component, imports, stylesheets, fonts;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    index = 0;
    component = async () => component_cache ??= (await Promise.resolve().then(() => (init_layout_svelte(), layout_svelte_exports))).default;
    imports = ["_app/immutable/nodes/0.BkHxTV37.js", "_app/immutable/chunks/UhH-2GMu.js", "_app/immutable/chunks/CELniAmD.js", "_app/immutable/chunks/RVXhQOml.js", "_app/immutable/chunks/B-UrQ5_i.js", "_app/immutable/chunks/DW4Susd9.js", "_app/immutable/chunks/D0QH3NT1.js", "_app/immutable/chunks/hthkWF7m.js"];
    stylesheets = ["_app/immutable/assets/0.Byb_DRnL.css"];
    fonts = [];
  }
});

// .svelte-kit/output/server/chunks/state.svelte.js
var is_legacy;
var init_state_svelte = __esm({
  ".svelte-kit/output/server/chunks/state.svelte.js"() {
    init_ssr2();
    init_exports();
    init_server();
    is_legacy = onMount.toString().includes("$$") || /function \w+\(\) \{\}/.test(onMount.toString());
    if (is_legacy) {
      ({
        data: {},
        form: null,
        error: null,
        params: {},
        route: { id: null },
        state: {},
        status: -1,
        url: new URL("https://example.com")
      });
    }
  }
});

// .svelte-kit/output/server/chunks/stores.js
var getStores, page;
var init_stores = __esm({
  ".svelte-kit/output/server/chunks/stores.js"() {
    init_ssr();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    getStores = () => {
      const stores = getContext("__svelte__");
      return {
        /** @type {typeof page} */
        page: {
          subscribe: stores.page.subscribe
        },
        /** @type {typeof navigating} */
        navigating: {
          subscribe: stores.navigating.subscribe
        },
        /** @type {typeof updated} */
        updated: stores.updated
      };
    };
    page = {
      subscribe(fn) {
        const store = getStores().page;
        return store.subscribe(fn);
      }
    };
  }
});

// .svelte-kit/output/server/entries/pages/_error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2
});
var css, Error2;
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_error.svelte.js"() {
    init_ssr();
    init_stores();
    init_logo();
    css = {
      code: "@keyframes svelte-190ujne-shine{100%{margin-left:200%}}",
      map: `{"version":3,"file":"+error.svelte","sources":["+error.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { page } from \\"$app/stores\\";\\nimport logoIcon from \\"$lib/assets/logo.svg\\";\\n$: status = $page.status;\\n$: message = $page.error?.message || \\"Something went wrong\\";\\n$: title = status === 404 ? \\"Page Not Found\\" : status === 500 ? \\"Server Error\\" : status === 403 ? \\"Access Denied\\" : \\"Oops!\\";\\n$: emoji = status === 404 ? \\"\\\\u{1F30C}\\" : status === 500 ? \\"\\\\u{1F525}\\" : status === 403 ? \\"\\\\u{1F512}\\" : \\"\\\\u26A0\\\\uFE0F\\";\\n$: subtitle = status === 404 ? \\"This page has been teleported to another dimension.\\" : status === 500 ? \\"Our servers hit turbulence. We're on it.\\" : status === 403 ? \\"You don't have permission to access this page.\\" : \\"Something unexpected happened.\\";\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>{status} {title} \u2014 FastBaidu</title>\\n</svelte:head>\\n\\n<div\\n\\tclass=\\"min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden\\"\\n>\\n\\t<!-- Background -->\\n\\t<div class=\\"absolute inset-0 bg-surface-950 -z-20\\"></div>\\n\\t<div\\n\\t\\tclass=\\"absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-900 via-surface-950 to-surface-950 -z-10\\"\\n\\t></div>\\n\\n\\t<!-- Floating particles effect -->\\n\\t<div class=\\"absolute inset-0 overflow-hidden pointer-events-none -z-5\\">\\n\\t\\t<div\\n\\t\\t\\tclass=\\"absolute w-64 h-64 rounded-full bg-brand-500/5 blur-3xl top-1/4 -left-20 animate-pulse\\"\\n\\t\\t></div>\\n\\t\\t<div\\n\\t\\t\\tclass=\\"absolute w-96 h-96 rounded-full bg-blue-500/5 blur-3xl bottom-1/4 -right-20 animate-[pulse_3s_ease-in-out_infinite]\\"\\n\\t\\t></div>\\n\\t</div>\\n\\n\\t<!-- Content -->\\n\\t<div class=\\"relative z-10 text-center max-w-lg mx-auto\\">\\n\\t\\t<!-- Status code with glitch effect -->\\n\\t\\t<div class=\\"relative mb-6\\">\\n\\t\\t\\t<span\\n\\t\\t\\t\\tclass=\\"text-[8rem] sm:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-surface-600/80 to-surface-800/40 leading-none select-none\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{status}\\n\\t\\t\\t</span>\\n\\t\\t\\t<span\\n\\t\\t\\t\\tclass=\\"absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl animate-bounce\\"\\n\\t\\t\\t\\tstyle=\\"animation-duration: 3s;\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{emoji}\\n\\t\\t\\t</span>\\n\\t\\t</div>\\n\\n\\t\\t<!-- Title -->\\n\\t\\t<h1\\n\\t\\t\\tclass=\\"text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3\\"\\n\\t\\t>\\n\\t\\t\\t{title}\\n\\t\\t</h1>\\n\\n\\t\\t<!-- Subtitle -->\\n\\t\\t<p class=\\"text-surface-400 text-base sm:text-lg mb-2\\">\\n\\t\\t\\t{subtitle}\\n\\t\\t</p>\\n\\n\\t\\t<!-- Error message (only if non-standard) -->\\n\\t\\t{#if message && message !== title && message !== \\"Not Found\\"}\\n\\t\\t\\t<p\\n\\t\\t\\t\\tclass=\\"text-surface-500 text-sm font-mono bg-surface-900/60 border border-surface-700/50 rounded-lg px-4 py-2 inline-block mb-6\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{message}\\n\\t\\t\\t</p>\\n\\t\\t{/if}\\n\\n\\t\\t<!-- Actions -->\\n\\t\\t<div class=\\"flex flex-col sm:flex-row gap-3 justify-center mt-8\\">\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref=\\"/\\"\\n\\t\\t\\t\\tclass=\\"relative px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-500/30 overflow-hidden group flex items-center justify-center gap-2\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\tclass=\\"absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]\\"\\n\\t\\t\\t\\t></span>\\n\\t\\t\\t\\t<span class=\\"relative z-10\\">\u{1F3E0} Back to Home</span>\\n\\t\\t\\t</a>\\n\\n\\t\\t\\t<button\\n\\t\\t\\t\\ton:click={() => history.back()}\\n\\t\\t\\t\\tclass=\\"px-8 py-3.5 rounded-xl border border-surface-600 bg-surface-800 hover:bg-surface-700 hover:border-surface-500 text-surface-300 hover:text-white font-semibold transition-all flex items-center justify-center gap-2\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t\u2190 Go Back\\n\\t\\t\\t</button>\\n\\t\\t</div>\\n\\n\\t\\t<!-- Branding -->\\n\\t\\t<div class=\\"mt-12 flex items-center justify-center gap-2 opacity-40\\">\\n\\t\\t\\t<img src={logoIcon} class=\\"w-5 h-5\\" alt=\\"FastBaidu\\" />\\n\\t\\t\\t<span class=\\"text-surface-500 text-xs font-semibold tracking-wider\\"\\n\\t\\t\\t\\t>FASTBAIDU</span\\n\\t\\t\\t>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<style>\\n\\t@keyframes shine {\\n\\t\\t100% {\\n\\t\\t\\tmargin-left: 200%;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAqGC,WAAW,oBAAM,CAChB,IAAK,CACJ,WAAW,CAAE,IACd,CACD"}`
    };
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let status;
      let message;
      let title;
      let emoji;
      let subtitle;
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      $$result.css.add(css);
      status = $page.status;
      message = $page.error?.message || "Something went wrong";
      title = status === 404 ? "Page Not Found" : status === 500 ? "Server Error" : status === 403 ? "Access Denied" : "Oops!";
      emoji = status === 404 ? "\u{1F30C}" : status === 500 ? "\u{1F525}" : status === 403 ? "\u{1F512}" : "\u26A0\uFE0F";
      subtitle = status === 404 ? "This page has been teleported to another dimension." : status === 500 ? "Our servers hit turbulence. We're on it." : status === 403 ? "You don't have permission to access this page." : "Something unexpected happened.";
      $$unsubscribe_page();
      return `${$$result.head += `<!-- HEAD_svelte-1rypjmr_START -->${$$result.title = `<title>${escape(status)} ${escape(title)} \u2014 FastBaidu</title>`, ""}<!-- HEAD_svelte-1rypjmr_END -->`, ""} <div class="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden"> <div class="absolute inset-0 bg-surface-950 -z-20"></div> <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-900 via-surface-950 to-surface-950 -z-10"></div>  <div class="absolute inset-0 overflow-hidden pointer-events-none -z-5" data-svelte-h="svelte-19lb5t7"><div class="absolute w-64 h-64 rounded-full bg-brand-500/5 blur-3xl top-1/4 -left-20 animate-pulse"></div> <div class="absolute w-96 h-96 rounded-full bg-blue-500/5 blur-3xl bottom-1/4 -right-20 animate-[pulse_3s_ease-in-out_infinite]"></div></div>  <div class="relative z-10 text-center max-w-lg mx-auto"> <div class="relative mb-6"><span class="text-[8rem] sm:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-surface-600/80 to-surface-800/40 leading-none select-none">${escape(status)}</span> <span class="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl animate-bounce" style="animation-duration: 3s;">${escape(emoji)}</span></div>  <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">${escape(title)}</h1>  <p class="text-surface-400 text-base sm:text-lg mb-2">${escape(subtitle)}</p>  ${message && message !== title && message !== "Not Found" ? `<p class="text-surface-500 text-sm font-mono bg-surface-900/60 border border-surface-700/50 rounded-lg px-4 py-2 inline-block mb-6">${escape(message)}</p>` : ``}  <div class="flex flex-col sm:flex-row gap-3 justify-center mt-8"><a href="/" class="relative px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-500/30 overflow-hidden group flex items-center justify-center gap-2" data-svelte-h="svelte-1jaibfl"><span class="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]"></span> <span class="relative z-10">\u{1F3E0} Back to Home</span></a> <button class="px-8 py-3.5 rounded-xl border border-surface-600 bg-surface-800 hover:bg-surface-700 hover:border-surface-500 text-surface-300 hover:text-white font-semibold transition-all flex items-center justify-center gap-2" data-svelte-h="svelte-1w3qll3">\u2190 Go Back</button></div>  <div class="mt-12 flex items-center justify-center gap-2 opacity-40" data-svelte-h="svelte-kssaow"><img${add_attribute("src", logoIcon, 0)} class="w-5 h-5" alt="FastBaidu"> <span class="text-surface-500 text-xs font-semibold tracking-wider">FASTBAIDU</span></div></div> </div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  component: () => component2,
  fonts: () => fonts2,
  imports: () => imports2,
  index: () => index2,
  stylesheets: () => stylesheets2
});
var index2, component_cache2, component2, imports2, stylesheets2, fonts2;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    index2 = 1;
    component2 = async () => component_cache2 ??= (await Promise.resolve().then(() => (init_error_svelte(), error_svelte_exports))).default;
    imports2 = ["_app/immutable/nodes/1.HVxgDUFj.js", "_app/immutable/chunks/UhH-2GMu.js", "_app/immutable/chunks/CELniAmD.js", "_app/immutable/chunks/fIZEV6l_.js", "_app/immutable/chunks/Z-QoULFV.js", "_app/immutable/chunks/DotA6MXx.js", "_app/immutable/chunks/B-UrQ5_i.js", "_app/immutable/chunks/hthkWF7m.js"];
    stylesheets2 = ["_app/immutable/assets/1.DBS-ZYs7.css"];
    fonts2 = [];
  }
});

// .svelte-kit/output/server/entries/pages/_page.svelte.js
var page_svelte_exports = {};
__export(page_svelte_exports, {
  default: () => Page
});
var css2, isValidBaiduPattern, Page;
var init_page_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_page.svelte.js"() {
    init_ssr();
    init_auth();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    init_ConfirmModal();
    css2 = {
      code: "@keyframes svelte-1ekoxn8-radar{0%{transform:translateX(-100%) skewX(-15deg)}100%{transform:translateX(400%) skewX(-15deg)}}@keyframes svelte-1ekoxn8-slide-up{0%{transform:translateY(100%);opacity:0}100%{transform:translateY(0);opacity:1}}@keyframes svelte-1ekoxn8-shine{100%{margin-left:200%}}",
      map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import {\\n  preview,\\n  createTask,\\n  ApiError,\\n  fetchBalance,\\n  fetchPackages\\n} from \\"$lib/api\\";\\nimport { formatBytes } from \\"$lib/utils/format\\";\\nimport { goto } from \\"$app/navigation\\";\\nimport { onMount, tick } from \\"svelte\\";\\nimport { userStore, authModalOpen } from \\"$lib/stores\\";\\nimport {\\n  loadPreviewState,\\n  savePreviewState,\\n  clearPreviewState\\n} from \\"$lib/stores/previewStore\\";\\nimport ConfirmModal from \\"$lib/components/ConfirmModal.svelte\\";\\nlet url = \\"\\";\\nlet password = \\"\\";\\nlet currentState = \\"idle\\";\\nlet previewData = null;\\nlet errorMsg = \\"\\";\\nlet submitLoading = false;\\nlet userBalance = null;\\nlet balanceTab = \\"packages\\";\\nlet teleportModalOpen = false;\\nlet teleportMethod = \\"balance\\";\\nlet dynamicPackages = [];\\nlet pricingSettings = {\\n  base: 0.99,\\n  per_gb: 0.5\\n};\\nconst radarTexts = [\\n  \\"> Connecting to Baidu Server...\\",\\n  \\"> Handshaking...\\",\\n  \\"> Retrieving file metadata...\\",\\n  \\"> Calculating transfer time...\\"\\n];\\nlet currentRadarText = radarTexts[0];\\nconst isValidBaiduPattern = /^(https?:\\\\/\\\\/)?(pan|yun)\\\\.baidu\\\\.com\\\\/(s\\\\/|e\\\\/|share\\\\/init\\\\?surl=)[A-Za-z0-9_-]{22,23}$/;\\n$: isValidUrl = isValidBaiduPattern.test(url);\\n$: displayUrlError = url.length > 0 && !isValidUrl;\\nfunction parseShareUrl(rawInput) {\\n  let urlStr = rawInput.trim();\\n  let pwdStr = \\"\\";\\n  const pwdMatch = urlStr.match(\\n    /(?:[?&]pwd=|\u63D0\u53D6\u7801[\uFF1A:\\\\s]*|pwd[=:\\\\s]*)([A-Za-z0-9]{4})(?:[#&\\\\s]|$)/i\\n  );\\n  if (pwdMatch) {\\n    pwdStr = pwdMatch[1];\\n  }\\n  const shareIdMatch = urlStr.match(\\n    /(pan|yun)\\\\.baidu\\\\.com\\\\/(s\\\\/|e\\\\/|share\\\\/init\\\\?surl=)([A-Za-z0-9_-]{23})/i\\n  );\\n  let finalUrl = urlStr;\\n  if (shareIdMatch) {\\n    const domain = shareIdMatch[1];\\n    const shareType = shareIdMatch[2];\\n    const shareId = shareIdMatch[3];\\n    finalUrl = \`https://\${domain}.baidu.com/\${shareType}\${shareId}\`;\\n  }\\n  return { url: finalUrl, password: pwdStr };\\n}\\nfunction handleUrlInput(e) {\\n  const target = e.target;\\n  const val = target.value;\\n  if (val.length > 0) {\\n    const parsed = parseShareUrl(val);\\n    if (parsed.url !== val) {\\n      url = parsed.url;\\n      if (parsed.password && parsed.password.length === 4) {\\n        password = parsed.password;\\n      }\\n    }\\n  }\\n}\\n$: guestPrice = previewData ? pricingSettings.base + pricingSettings.per_gb * previewData.total_size_gb : 0;\\n$: memberCredits = previewData ? previewData.total_size_gb : 0;\\n$: estimatedSeconds = previewData ? previewData.total_size_gb * 1024 * 1024 * 1024 / (80 * 1024 * 1024) : 0;\\n$: fileSize = previewData ? previewData.total_size_gb : 0;\\n$: hasSufficientBalance = userBalance !== null && fileSize > 0 && userBalance.balance_gb >= fileSize;\\n$: hasPartialBalance = userBalance !== null && userBalance.balance_gb > 0 && userBalance.balance_gb < fileSize;\\n$: hasNoBalance = userBalance !== null && userBalance.balance_gb === 0;\\n$: remainingBalance = userBalance ? Math.max(0, userBalance.balance_gb - fileSize) : 0;\\n$: oneTimePrice = pricingSettings.base + pricingSettings.per_gb * fileSize;\\n$: recommendedPkg = dynamicPackages.find((p) => p.size_gb >= fileSize) ?? dynamicPackages[dynamicPackages.length - 1];\\n$: if ($userStore && currentState === \\"result\\") {\\n  fetchBalance().then((b) => {\\n    userBalance = b;\\n  }).catch(() => {\\n  });\\n}\\nonMount(() => {\\n  const handleVisibility = () => {\\n    if (document.visibilityState === \\"visible\\" && $userStore && currentState === \\"result\\") {\\n      fetchBalance().then((b) => userBalance = b).catch(() => {\\n      });\\n    }\\n  };\\n  document.addEventListener(\\"visibilitychange\\", handleVisibility);\\n  return () => document.removeEventListener(\\"visibilitychange\\", handleVisibility);\\n});\\nasync function runRadarAnimation() {\\n  for (let i = 0; i < radarTexts.length; i++) {\\n    currentRadarText = radarTexts[i];\\n    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));\\n  }\\n}\\nasync function initiateScan() {\\n  if (!isValidUrl) {\\n    errorMsg = \\"Please enter a valid Baidu Pan link\\";\\n    return;\\n  }\\n  errorMsg = \\"\\";\\n  currentState = \\"scanning\\";\\n  const [previewRes] = await Promise.allSettled([\\n    preview({ url, password: password || void 0 }),\\n    runRadarAnimation()\\n  ]);\\n  if (previewRes.status === \\"fulfilled\\") {\\n    previewData = previewRes.value;\\n    currentState = \\"result\\";\\n    if ($userStore) {\\n      try {\\n        userBalance = await fetchBalance();\\n      } catch {\\n        userBalance = null;\\n      }\\n    }\\n  } else {\\n    const err = previewRes.reason;\\n    if (err.message.toLowerCase().includes(\\"password\\") || err.message.toLowerCase().includes(\\"extraction code\\") || err.status === 401) {\\n      currentState = \\"password_prompt\\";\\n      errorMsg = \\"\\";\\n    } else {\\n      errorMsg = err.message || \\"Failed to analyze link\\";\\n      currentState = \\"idle\\";\\n    }\\n  }\\n}\\nfunction requestTeleportTask(method) {\\n  teleportMethod = method;\\n  teleportModalOpen = true;\\n}\\nasync function confirmTeleportTask() {\\n  if (!previewData) return;\\n  errorMsg = \\"\\";\\n  submitLoading = true;\\n  try {\\n    const res = await createTask({\\n      url,\\n      password: password || void 0,\\n      size_gb: previewData.total_size_gb\\n    });\\n    clearResult();\\n    url = \\"\\";\\n    password = \\"\\";\\n    if (res.payment_required) {\\n      goto(\`/payment/\${res.task.id}\`);\\n    } else {\\n      goto(\`/task/\${res.task.id}\`);\\n    }\\n  } catch (err) {\\n    errorMsg = err instanceof ApiError ? err.message : \\"Failed to create task\\";\\n    submitLoading = false;\\n  }\\n}\\nfunction formatTime(seconds) {\\n  if (seconds < 60) return \`\${Math.round(seconds)} Seconds\`;\\n  const m = Math.floor(seconds / 60);\\n  const s = Math.round(seconds % 60);\\n  return \`\${m}m \${s}s\`;\\n}\\nfunction fileIcon(file) {\\n  if (file.is_dir) return \\"\\\\u{1F4C1}\\";\\n  const ext = file.path.split(\\".\\").pop()?.toLowerCase() || \\"\\";\\n  if ([\\"mp4\\", \\"mkv\\", \\"avi\\"].includes(ext)) return \\"\\\\u{1F3AC}\\";\\n  if ([\\"zip\\", \\"rar\\", \\"7z\\"].includes(ext)) return \\"\\\\u{1F4E6}\\";\\n  if ([\\"pdf\\", \\"doc\\", \\"txt\\"].includes(ext)) return \\"\\\\u{1F4C4}\\";\\n  return \\"\\\\u{1F4C4}\\";\\n}\\nlet passInput;\\nonMount(() => {\\n  fetchPackages().then((res) => {\\n    if (res && res.tiers) {\\n      dynamicPackages = res.tiers;\\n      if (res.default) {\\n        pricingSettings = {\\n          base: res.default.base ?? 0.99,\\n          per_gb: res.default.per_gb ?? 0.5\\n        };\\n      }\\n    }\\n  }).catch(console.error);\\n  const saved = loadPreviewState();\\n  if (saved) {\\n    url = saved.url;\\n    password = saved.password;\\n    currentState = saved.currentState;\\n    previewData = saved.previewData;\\n    userBalance = saved.userBalance;\\n  }\\n});\\n$: if (currentState === \\"result\\" && previewData) {\\n  savePreviewState({\\n    url,\\n    password,\\n    currentState,\\n    previewData,\\n    userBalance\\n  });\\n}\\nfunction clearResult() {\\n  clearPreviewState();\\n  currentState = \\"idle\\";\\n  previewData = null;\\n  userBalance = null;\\n  errorMsg = \\"\\";\\n}\\nasync function showPasswordPrompt() {\\n  currentState = \\"password_prompt\\";\\n  errorMsg = \\"\\";\\n  await tick();\\n  if (passInput) passInput.focus();\\n}\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>FastBaidu | Teleport Files at 80MB/s</title>\\n</svelte:head>\\n\\n<div\\n\\tclass=\\"min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden\\"\\n>\\n\\t<!-- Background Elements -->\\n\\t<div class=\\"absolute inset-0 bg-surface-950 -z-20\\"></div>\\n\\t<div\\n\\t\\tclass=\\"absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-900 via-surface-950 to-surface-950 -z-10\\"\\n\\t></div>\\n\\n\\t<!-- Shared Header (Always visible) -->\\n\\t<div\\n\\t\\tclass=\\"text-center mb-10 max-w-4xl w-full px-4 z-10 transition-all duration-500 {currentState !==\\n\\t\\t'idle'\\n\\t\\t\\t? 'opacity-0 h-0 overflow-hidden mb-0 scale-95'\\n\\t\\t\\t: 'opacity-100 scale-100'}\\"\\n\\t>\\n\\t\\t<h1\\n\\t\\t\\tclass=\\"text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4\\"\\n\\t\\t>\\n\\t\\t\\tDownload Baidu Files <br />\\n\\t\\t\\t<span\\n\\t\\t\\t\\tclass=\\"text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500\\"\\n\\t\\t\\t\\t>Without SVIP Limits</span\\n\\t\\t\\t>\\n\\t\\t</h1>\\n\\t\\t<p class=\\"text-surface-400 text-lg sm:text-xl font-medium\\">\\n\\t\\t\\tNo queues. No speed limits. Just paste your link and fly.\\n\\t\\t</p>\\n\\t</div>\\n\\n\\t<!-- Main Interaction Area -->\\n\\t<div class=\\"w-full max-w-3xl relative z-10\\">\\n\\t\\t{#if errorMsg && currentState !== \\"password_prompt\\"}\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center font-medium animate-fade-in\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{errorMsg}\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\n\\t\\t<!-- STATE 1: IDLE -->\\n\\t\\t{#if currentState === \\"idle\\"}\\n\\t\\t\\t<div class=\\"animate-fade-in\\">\\n\\t\\t\\t\\t<form\\n\\t\\t\\t\\t\\ton:submit|preventDefault={() => {\\n\\t\\t\\t\\t\\t\\tinitiateScan();\\n\\t\\t\\t\\t\\t}}\\n\\t\\t\\t\\t\\tclass=\\"relative group\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<!-- Glow effect behind input -->\\n\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\tclass=\\"absolute -inset-1 bg-gradient-to-r from-brand-500 to-blue-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000 group-hover:duration-200\\"\\n\\t\\t\\t\\t\\t></div>\\n\\n\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\tclass=\\"relative flex flex-col sm:flex-row bg-surface-900 border border-surface-700/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 {displayUrlError\\n\\t\\t\\t\\t\\t\\t\\t? 'border-red-500/50 shadow-red-500/10'\\n\\t\\t\\t\\t\\t\\t\\t: ''}\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<div class=\\"flex-1 relative flex items-center\\">\\n\\t\\t\\t\\t\\t\\t\\t<input\\n\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"url\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tbind:value={url}\\n\\t\\t\\t\\t\\t\\t\\t\\ton:input={handleUrlInput}\\n\\t\\t\\t\\t\\t\\t\\t\\tplaceholder=\\"Paste Baidu Pan link (share text supported)...\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"w-full bg-transparent px-6 py-5 pr-24 text-lg text-white placeholder:text-surface-500 focus:outline-none\\"\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t{#if url}\\n\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 animate-fade-in\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"w-px h-8 bg-surface-700/80\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t></div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<input\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"text\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tbind:value={password}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tplaceholder=\\"PWD\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tmaxlength=\\"4\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"w-14 bg-surface-950/50 border border-surface-600 text-center rounded-lg px-1 py-1.5 text-sm text-brand-400 font-mono tracking-widest focus:outline-none focus:border-brand-500 transition-colors placeholder:tracking-normal\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t</div>\\n\\n\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\ttype=\\"submit\\"\\n\\t\\t\\t\\t\\t\\t\\tdisabled={!url || displayUrlError}\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"px-8 py-5 sm:w-auto w-full bg-white text-surface-950 font-black text-lg sm:text-xl tracking-wide hover:bg-surface-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 group/btn\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-yellow-500 group-hover/btn:scale-110 transition-transform\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\u26A1</span\\n\\t\\t\\t\\t\\t\\t\\t> SCAN\\n\\t\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t</div>\\n\\n\\t\\t\\t\\t\\t{#if displayUrlError}\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"absolute -bottom-8 left-2 text-red-500 text-xs sm:text-sm font-semibold animate-fade-in flex items-center gap-1.5\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<svg\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"w-4 h-4\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tfill=\\"none\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tviewBox=\\"0 0 24 24\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tstroke=\\"currentColor\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t<path\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tstroke-linecap=\\"round\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tstroke-linejoin=\\"round\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tstroke-width=\\"2\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\td=\\"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t</svg>\\n\\t\\t\\t\\t\\t\\t\\tInvalid Baidu link. Please check the format. (Share ID\\n\\t\\t\\t\\t\\t\\t\\tlength must be 23 characters)\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</form>\\n\\n\\t\\t\\t\\t<!-- Trust Badges -->\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tclass=\\"mt-8 flex flex-col md:flex-row flex-wrap justify-center items-start md:items-center gap-x-6 gap-y-3 text-sm font-medium text-surface-400 mx-auto w-fit\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<div class=\\"flex items-start gap-2 text-left\\">\\n\\t\\t\\t\\t\\t\\t<span class=\\"text-brand-500 shrink-0\\">\u2705</span>\\n\\t\\t\\t\\t\\t\\t<span>High-Speed Cloud Transfers</span>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"flex items-start gap-2 text-left\\">\\n\\t\\t\\t\\t\\t\\t<span class=\\"text-brand-500 shrink-0\\">\u2705</span>\\n\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t>100% Privacy <span class=\\"text-surface-600\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>(Auto-delete)</span\\n\\t\\t\\t\\t\\t\\t\\t></span\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"flex items-start gap-2 text-left\\">\\n\\t\\t\\t\\t\\t\\t<span class=\\"text-brand-500 shrink-0\\">\u2705</span>\\n\\t\\t\\t\\t\\t\\t<span>No Account Needed for Preview</span>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\n\\t\\t<!-- STATE 2: SCANNING & ANIMATION -->\\n\\t\\t{#if currentState === \\"scanning\\"}\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"bg-surface-900 border border-surface-700/50 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden animate-fade-in\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<!-- Radar Beam Overlay -->\\n\\t\\t\\t\\t<div class=\\"absolute inset-0 pointer-events-none\\">\\n\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\tclass=\\"absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent animate-[radar_2s_linear_infinite]\\"\\n\\t\\t\\t\\t\\t></div>\\n\\t\\t\\t\\t</div>\\n\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tclass=\\"flex flex-col items-center justify-center space-y-8 relative z-10 h-32\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<!-- Spinner / Tech Element -->\\n\\t\\t\\t\\t\\t<div class=\\"relative w-16 h-16\\">\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"absolute inset-0 rounded-full border-t-2 border-brand-400 animate-spin\\"\\n\\t\\t\\t\\t\\t\\t></div>\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"absolute inset-2 rounded-full border-r-2 border-blue-400 animate-[spin_1.5s_linear_infinite_reverse]\\"\\n\\t\\t\\t\\t\\t\\t></div>\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"absolute inset-4 rounded-full border-b-2 border-emerald-400 animate-spin\\"\\n\\t\\t\\t\\t\\t\\t></div>\\n\\t\\t\\t\\t\\t</div>\\n\\n\\t\\t\\t\\t\\t<!-- Text Sequence -->\\n\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\tclass=\\"font-mono text-emerald-400 text-lg text-center h-6 overflow-hidden\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t{#key currentRadarText}\\n\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"animate-[slide-up_0.3s_ease-out_forwards]\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t{currentRadarText}\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t{/key}\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\n\\t\\t<!-- STATE 3: RESULT PANEL -->\\n\\t\\t{#if currentState === \\"result\\" && previewData}\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"bg-surface-900 border border-surface-700/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<!-- Panel Header -->\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tclass=\\"bg-surface-950/50 px-6 py-5 border-b border-surface-800 flex items-center gap-4\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\tclass=\\"w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"w-3 h-3 rounded-full bg-emerald-500 animate-pulse\\"\\n\\t\\t\\t\\t\\t\\t></div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"flex-1\\">\\n\\t\\t\\t\\t\\t\\t<h2 class=\\"text-emerald-400 font-bold tracking-wide\\">\\n\\t\\t\\t\\t\\t\\t\\tSCAN COMPLETE\\n\\t\\t\\t\\t\\t\\t</h2>\\n\\t\\t\\t\\t\\t\\t<p class=\\"text-surface-300 text-sm\\">\\n\\t\\t\\t\\t\\t\\t\\tFile is online and ready to teleport.\\n\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\ton:click={clearResult}\\n\\t\\t\\t\\t\\t\\tclass=\\"w-10 h-10 rounded-xl flex items-center justify-center text-surface-300 bg-surface-800 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-surface-700 transition-all text-lg font-bold\\"\\n\\t\\t\\t\\t\\t\\ttitle=\\"New scan\\">\u2715</button\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t</div>\\n\\n\\t\\t\\t\\t<div class=\\"p-6 sm:p-8 space-y-8\\">\\n\\t\\t\\t\\t\\t<!-- Section A: File Structure -->\\n\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\tclass=\\"border border-surface-700/50 rounded-xl bg-surface-950/30 font-mono text-sm p-4 overflow-hidden relative\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"absolute top-0 right-0 px-3 py-1 bg-surface-800 text-surface-400 rounded-bl-xl text-xs\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\tPreview\\n\\t\\t\\t\\t\\t\\t</div>\\n\\n\\t\\t\\t\\t\\t\\t{#if previewData.files.length > 0}\\n\\t\\t\\t\\t\\t\\t\\t{@const firstFile = previewData.files[0]}\\n\\t\\t\\t\\t\\t\\t\\t{@const isSingleFile =\\n\\t\\t\\t\\t\\t\\t\\t\\tpreviewData.files.length === 1 &&\\n\\t\\t\\t\\t\\t\\t\\t\\t!firstFile.is_dir}\\n\\n\\t\\t\\t\\t\\t\\t\\t{#if isSingleFile}\\n\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex items-center gap-2 text-surface-200\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<span>{fileIcon(firstFile)}</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"truncate\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{firstFile.name}</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"text-surface-500\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{formatBytes(firstFile.size, 0)}</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- Tree View Simulation -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-surface-200 flex items-center gap-2 mb-2\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<span>\u{1F4C1}</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"font-bold border-b border-surface-700/50 pb-0.5\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>Scanned_Content_Root</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"pl-4 border-l border-surface-700/50 ml-2 space-y-2 text-surface-400\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each previewData.files.slice(0, 4) as file, i}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"flex items-center gap-2\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"text-surface-600\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{i ===\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tpreviewData.files.slice(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t0,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t4,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t).length -\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t1 &&\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tpreviewData.files.length <= 4\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? \\"\u2514\u2500\u2500\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: \\"\u251C\u2500\u2500\\"}</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span>{fileIcon(file)}</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"truncate max-w-[200px] sm:max-w-xs text-surface-300\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{file.name}</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if !file.is_dir}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"text-surface-500\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>({formatBytes(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tfile.size,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t0,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)})</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if previewData.files.length > 4}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex items-center gap-2 text-surface-500 italic\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"text-surface-600\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\u2514\u2500\u2500</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t... and {previewData.files.length -\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t4} more files/folders.\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"text-surface-500 italic\\">\\n\\t\\t\\t\\t\\t\\t\\t\\tEmpty folder.\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t</div>\\n\\n\\t\\t\\t\\t\\t<!-- Section B: The Analysis (The Math) -->\\n\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\tclass=\\"grid grid-cols-2 bg-surface-800/40 rounded-xl p-1 relative overflow-hidden\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<!-- Progress bar background effect -->\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"absolute inset-y-0 left-0 bg-brand-500/5 w-full\\"\\n\\t\\t\\t\\t\\t\\t></div>\\n\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"p-4 relative z-10 flex flex-col items-center border-r border-surface-700/50\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-surface-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t<span>\u{1F4E6}</span> TOTAL SIZE\\n\\t\\t\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-2xl sm:text-3xl font-black text-white\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>{previewData.total_size_gb.toFixed(2)} GB</span\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"p-4 relative z-10 flex flex-col items-center\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-surface-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t<span>\u23F1\uFE0F</span> EST. TIME\\n\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"normal-case opacity-60\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>(80MB/s)</span\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-2xl sm:text-3xl font-black text-brand-400\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>~ {formatTime(estimatedSeconds)}</span\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\n\\t\\t\\t\\t\\t<!-- Section C: FINAL ACTION AREA -->\\n\\t\\t\\t\\t\\t<div class=\\"mt-8\\">\\n\\t\\t\\t\\t\\t\\t<!-- ====================== ACTION AREA ====================== -->\\n\\t\\t\\t\\t\\t\\t<!-- Account Status Bar -->\\n\\t\\t\\t\\t\\t\\t{#if $userStore && userBalance}\\n\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"mt-5 flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700/50 text-sm\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"text-surface-400\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tYour Balance: <strong class=\\"text-brand-400\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{userBalance.balance_gb.toFixed(2)} GB</strong\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"mx-2 text-surface-700\\">|</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tStatus:\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"{userBalance.balance_gb >= 1\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? 'text-emerald-400'\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'text-surface-400'} font-semibold\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{userBalance.balance_gb >= 1\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? \\"Premium Member\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: \\"Free Account\\"}</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() => goto(\\"/dashboard\\")}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"px-3 py-1 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 font-semibold text-xs transition-colors\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\u{1F4B3} RECHARGE</button\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t{/if}\\n\\n\\t\\t\\t\\t\\t\\t{#if $userStore}\\n\\t\\t\\t\\t\\t\\t\\t{#if userBalance === null}\\n\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"mt-4 h-14 rounded-xl bg-surface-800/50 animate-pulse\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t></div>\\n\\t\\t\\t\\t\\t\\t\\t{:else if hasSufficientBalance}\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- CASE 1: Balance >= File Size -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"mt-5 rounded-xl border border-surface-700/60 bg-surface-800/40 overflow-hidden\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"px-4 py-2.5 bg-surface-800/80 border-b border-surface-700/50\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<h3\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-xs font-bold text-surface-400 tracking-widest uppercase\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\u26A1 Transfer Summary\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</h3>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"p-5\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"grid grid-cols-3 gap-3 mb-5 text-center\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"rounded-lg bg-surface-900/60 p-3\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-xs text-surface-500 mb-1\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tCurrent Balance\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-base font-bold text-white\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{userBalance.balance_gb.toFixed(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t2,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)} GB\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"rounded-lg bg-red-500/10 p-3\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-xs text-surface-500 mb-1\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tTransfer Cost\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-base font-bold text-red-400\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\u2212{fileSize.toFixed(2)} GB\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"rounded-lg bg-emerald-500/10 p-3\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-xs text-surface-500 mb-1\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tRemaining\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-base font-bold text-emerald-400\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{remainingBalance.toFixed(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t2,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)} GB\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"flex gap-3\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={clearResult}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"px-5 py-3.5 rounded-xl bg-surface-800 hover:bg-red-500/20 text-surface-300 hover:text-white font-semibold transition-all border border-surface-700 hover:border-red-500/30\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>Cancel</button>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() =>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\trequestTeleportTask(\\"balance\\")}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tdisabled={submitLoading}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"relative flex-1 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-brand-500/30 overflow-hidden group\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t></span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{submitLoading\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? \\"\u23F3 Starting...\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: \\"\u{1F680} START TELEPORT NOW\\"}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t{:else if hasPartialBalance}\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- CASE 2: Partial Balance -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"mt-5 rounded-xl border border-amber-500/30 bg-surface-800/40 overflow-hidden\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span>\u26A0\uFE0F</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<h3\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-xs font-bold text-amber-300 tracking-widest uppercase\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tInsufficient Balance\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</h3>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"p-5\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-sm text-surface-400 mb-4\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tYou need <strong class=\\"text-white\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{fileSize.toFixed(2)} GB</strong\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tbut only have\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<strong class=\\"text-amber-400\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{userBalance.balance_gb.toFixed(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t2,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)} GB</strong\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>.\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex rounded-lg overflow-hidden border border-surface-700 mb-5\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() =>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t(balanceTab = \\"packages\\")}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex-1 py-2 text-sm font-semibold transition-colors {balanceTab ===\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t'packages'\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? 'bg-brand-500 text-white'\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'text-surface-400 hover:text-white'}\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>Recharge Packages</button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() =>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t(balanceTab = \\"onetime\\")}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex-1 py-2 text-sm font-semibold transition-colors {balanceTab ===\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t'onetime'\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? 'bg-brand-500 text-white'\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'text-surface-400 hover:text-white'}\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>One-time Transfer</button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if balanceTab === \\"packages\\"}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"space-y-2 mb-5\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each dynamicPackages as pkg}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex items-center justify-between p-3 rounded-lg border {pkg ===\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\trecommendedPkg\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? 'border-amber-400/60 bg-amber-400/10'\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'border-surface-700 bg-surface-900/40'}\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"font-bold text-white text-sm\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\${pkg.price}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\u2192 {pkg.size_gb}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tGB</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-xs text-surface-500 ml-2\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>(\${(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tpkg.price /\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tpkg.size_gb\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t).toFixed(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t2,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)}/GB)</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if pkg === recommendedPkg}<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"ml-2 text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>Recommended</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() =>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tgoto(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\"/dashboard\\",\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"px-3 py-1 text-xs rounded-lg font-semibold {pkg ===\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\trecommendedPkg\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? 'bg-amber-500 text-black'\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'bg-surface-700 text-white'} transition-colors\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>Buy</button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"p-4 rounded-xl bg-surface-900/60 border border-surface-700 mb-5 text-center\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-3xl font-black text-white\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\${oneTimePrice.toFixed(2)}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-sm text-surface-500\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tOne-time transfer for this\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tfile\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() => goto(\\"/dashboard\\")}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/30\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\u{1F4B3} TOP UP & START</button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t{:else if hasNoBalance}\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- CASE 3: Zero balance -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"mt-5\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<h3\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-center text-xs font-bold text-surface-400 uppercase tracking-widest mb-4\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tChoose Your Plan\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</h3>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"grid sm:grid-cols-2 gap-4\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex flex-col h-full rounded-xl border-2 border-brand-500/60 bg-brand-500/10 p-5\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<h4\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-xs font-bold uppercase text-brand-300 tracking-wider mb-3\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\u{1F680} Member Packages\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</h4>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"space-y-1.5 mb-4\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each dynamicPackages as pkg}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex justify-between text-sm\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-surface-300\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\${pkg.price}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\u2192 {pkg.size_gb} GB</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-surface-500 text-xs\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\${(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tpkg.price /\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tpkg.size_gb\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t).toFixed(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t2,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)}/GB</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() => goto(\\"/topup\\")}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"w-full mt-auto py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/30\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\u{1F680} RECHARGE NOW</button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex flex-col h-full rounded-xl border border-surface-700/60 bg-surface-800/30 p-5\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<h4\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-xs font-bold uppercase text-surface-400 tracking-wider mb-3\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\u{1F4B3} One-time Transfer\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</h4>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-3xl font-black text-white mb-1\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\${oneTimePrice.toFixed(2)}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<p class=\\"text-xs text-surface-500\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tPrice for this file\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"mt-2 mb-4 p-2 rounded-lg bg-surface-900/50 border border-surface-700/30 text-[11px] text-surface-400 font-mono tracking-tight flex flex-col gap-1\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex justify-between\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span>Base Fee:</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\${pricingSettings.base.toFixed(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t2,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)}</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex justify-between\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>Data Cost (\${pricingSettings.per_gb.toFixed(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t2,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)}/GB):</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>+ \${(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tpricingSettings.per_gb *\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tfileSize\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t).toFixed(2)}</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"border-t border-surface-700/50 mt-1 pt-1 flex justify-between text-surface-300 font-bold\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span>Total:</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\${oneTimePrice.toFixed(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t2,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)}</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() =>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\trequestTeleportTask(\\"onetime\\")}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tdisabled={submitLoading}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"w-full mt-auto py-3 rounded-xl border border-surface-600 bg-surface-800 hover:bg-surface-700 text-white font-bold transition-all\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>PAY FOR THIS FILE</button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t{:else}\\n\\t\\t\\t\\t\\t\\t\\t<!-- NOT LOGGED IN / GUEST CHECKOUT -->\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"mt-5 max-w-2xl mx-auto space-y-4\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"grid sm:grid-cols-2 gap-4\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<!-- Guest Checkout Quick Action -->\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() =>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\trequestTeleportTask(\\"onetime\\")}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tdisabled={submitLoading}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"w-full py-3.5 rounded-xl border border-surface-600 bg-surface-800 hover:bg-surface-700 hover:border-surface-500 text-white font-bold transition-all flex flex-col items-center justify-center gap-1\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"text-base\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\u26A1 PAY \${guestPrice.toFixed(\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t2,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t)}</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-xs text-surface-400 font-normal\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>One-time guest transfer</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</button>\\n\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<!-- Login & Save Main Action -->\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() => ($authModalOpen = true)}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tdisabled={submitLoading}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"relative w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/30 overflow-hidden group flex flex-col items-center justify-center gap-1\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t></span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"text-base z-10 relative\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\u{1F680} LOGIN & GET FREE CREDITS</span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-[11px] text-blue-50 font-medium z-10 relative bg-black/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10 mt-0.5 tracking-wide\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tSign up to buy packages & save\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={() => ($authModalOpen = true)}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"w-full py-2.5 text-sm rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors flex items-center justify-center gap-2 font-semibold\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\u{1F381} Link Telegram for +1GB Free Quota\\n\\t\\t\\t\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t<!-- ===================== END ACTION AREA ===================== -->\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t</div>\\n</div>\\n\\n<!-- EDGE CASE: PASSWORD REQUIRED MODAL -->\\n{#if currentState === \\"password_prompt\\"}\\n\\t<div\\n\\t\\tclass=\\"fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm animate-fade-in\\"\\n\\t>\\n\\t\\t<div\\n\\t\\t\\tclass=\\"bg-surface-900 border border-surface-700/50 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden\\"\\n\\t\\t\\trole=\\"button\\"\\n\\t\\t\\ttabindex=\\"0\\"\\n\\t\\t\\ton:click|stopPropagation={() => {}}\\n\\t\\t\\ton:keydown|stopPropagation={(e) => {\\n\\t\\t\\t\\tif (e.key === 'Enter' || e.key === ' ') {\\n\\t\\t\\t\\t\\te.preventDefault();\\n\\t\\t\\t\\t}\\n\\t\\t\\t}}\\n\\t\\t>\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"h-2 w-full bg-gradient-to-r from-amber-500 to-orange-500\\"\\n\\t\\t\\t></div>\\n\\n\\t\\t\\t<div class=\\"p-6\\">\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tclass=\\"w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-2xl mb-4\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\u{1F512}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<h3 class=\\"text-xl font-bold text-white mb-2\\">\\n\\t\\t\\t\\t\\tProtected Link\\n\\t\\t\\t\\t</h3>\\n\\t\\t\\t\\t<p class=\\"text-surface-400 mb-6 text-sm\\">\\n\\t\\t\\t\\t\\tThis Baidu link requires an access code.\\n\\t\\t\\t\\t\\t{#if errorMsg}<br /><span class=\\"text-red-400 mt-1 block\\"\\n\\t\\t\\t\\t\\t\\t\\t>{errorMsg}</span\\n\\t\\t\\t\\t\\t\\t>{/if}\\n\\t\\t\\t\\t</p>\\n\\n\\t\\t\\t\\t<form\\n\\t\\t\\t\\t\\ton:submit|preventDefault={() => {\\n\\t\\t\\t\\t\\t\\tinitiateScan();\\n\\t\\t\\t\\t\\t}}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<input\\n\\t\\t\\t\\t\\t\\tbind:this={passInput}\\n\\t\\t\\t\\t\\t\\ttype=\\"text\\"\\n\\t\\t\\t\\t\\t\\tbind:value={password}\\n\\t\\t\\t\\t\\t\\tplaceholder=\\"Enter 4-digit code\\"\\n\\t\\t\\t\\t\\t\\tmaxlength=\\"4\\"\\n\\t\\t\\t\\t\\t\\tclass=\\"w-full bg-surface-950 border border-surface-700 rounded-xl px-4 py-3 text-center text-xl tracking-[1em] text-white font-mono placeholder:tracking-normal placeholder:text-sm placeholder:text-surface-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors mb-4\\"\\n\\t\\t\\t\\t\\t\\trequired\\n\\t\\t\\t\\t\\t/>\\n\\n\\t\\t\\t\\t\\t<div class=\\"flex gap-3\\">\\n\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\ttype=\\"button\\"\\n\\t\\t\\t\\t\\t\\t\\ton:click={() => {\\n\\t\\t\\t\\t\\t\\t\\t\\tcurrentState = \\"idle\\";\\n\\t\\t\\t\\t\\t\\t\\t\\tpassword = \\"\\";\\n\\t\\t\\t\\t\\t\\t\\t}}\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"flex-1 py-3 rounded-xl border border-surface-700 text-surface-300 font-semibold hover:bg-surface-800 transition-colors\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\tCANCEL\\n\\t\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\t\\t\\ttype=\\"submit\\"\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"flex-1 py-3 rounded-xl bg-amber-500 text-surface-950 font-bold hover:bg-amber-400 transition-colors\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\tUNLOCK\\n\\t\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</form>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n{/if}\\n\\n<ConfirmModal\\n\\tbind:open={teleportModalOpen}\\n\\ttitle=\\"Confirm Teleport\\"\\n\\tmessage={previewData ? \`Are you sure you want to spend \${previewData.total_size_gb.toFixed(2)} GB to teleport this file? This action cannot be canceled.\` : \\"Are you sure you want to proceed?\\"}\\n\\tconfirmText=\\"Start Teleport\\"\\n\\tcancelText=\\"Go Back\\"\\n\\ticon=\\"\u{1F680}\\"\\n\\tconfirmClass=\\"bg-brand-500 text-white hover:bg-brand-400 border border-brand-500/30 shadow-brand-500/20\\"\\n\\tonConfirm={confirmTeleportTask}\\n/>\\n\\n<style>\\n\\t@keyframes radar {\\n\\t\\t0% {\\n\\t\\t\\ttransform: translateX(-100%) skewX(-15deg);\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\ttransform: translateX(400%) skewX(-15deg);\\n\\t\\t}\\n\\t}\\n\\t@keyframes slide-up {\\n\\t\\t0% {\\n\\t\\t\\ttransform: translateY(100%);\\n\\t\\t\\topacity: 0;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\ttransform: translateY(0);\\n\\t\\t\\topacity: 1;\\n\\t\\t}\\n\\t}\\n\\t@keyframes shine {\\n\\t\\t100% {\\n\\t\\t\\tmargin-left: 200%;\\n\\t\\t}\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AAqjCC,WAAW,oBAAM,CAChB,EAAG,CACF,SAAS,CAAE,WAAW,KAAK,CAAC,CAAC,MAAM,MAAM,CAC1C,CACA,IAAK,CACJ,SAAS,CAAE,WAAW,IAAI,CAAC,CAAC,MAAM,MAAM,CACzC,CACD,CACA,WAAW,uBAAS,CACnB,EAAG,CACF,SAAS,CAAE,WAAW,IAAI,CAAC,CAC3B,OAAO,CAAE,CACV,CACA,IAAK,CACJ,SAAS,CAAE,WAAW,CAAC,CAAC,CACxB,OAAO,CAAE,CACV,CACD,CACA,WAAW,oBAAM,CAChB,IAAK,CACJ,WAAW,CAAE,IACd,CACD"}`
    };
    isValidBaiduPattern = /^(https?:\/\/)?(pan|yun)\.baidu\.com\/(s\/|e\/|share\/init\?surl=)[A-Za-z0-9_-]{22,23}$/;
    Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let isValidUrl;
      let displayUrlError;
      let fileSize;
      let $$unsubscribe_userStore;
      let $$unsubscribe_authModalOpen;
      $$unsubscribe_userStore = subscribe(userStore, (value) => value);
      $$unsubscribe_authModalOpen = subscribe(authModalOpen, (value) => value);
      let url = "";
      let teleportModalOpen = false;
      let dynamicPackages = [];
      async function confirmTeleportTask() {
        return;
      }
      $$result.css.add(css2);
      let $$settled;
      let $$rendered;
      let previous_head = $$result.head;
      do {
        $$settled = true;
        $$result.head = previous_head;
        isValidUrl = isValidBaiduPattern.test(url);
        displayUrlError = url.length > 0 && !isValidUrl;
        fileSize = 0;
        dynamicPackages.find((p) => p.size_gb >= fileSize) ?? dynamicPackages[dynamicPackages.length - 1];
        $$rendered = `${$$result.head += `<!-- HEAD_svelte-f60kod_START -->${$$result.title = `<title>FastBaidu | Teleport Files at 80MB/s</title>`, ""}<!-- HEAD_svelte-f60kod_END -->`, ""} <div class="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden"> <div class="absolute inset-0 bg-surface-950 -z-20"></div> <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-900 via-surface-950 to-surface-950 -z-10"></div>  <div class="${"text-center mb-10 max-w-4xl w-full px-4 z-10 transition-all duration-500 " + escape(
          "opacity-100 scale-100",
          true
        )}"><h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4" data-svelte-h="svelte-1pqpc3f">Download Baidu Files <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">Without SVIP Limits</span></h1> <p class="text-surface-400 text-lg sm:text-xl font-medium" data-svelte-h="svelte-zdkrd9">No queues. No speed limits. Just paste your link and fly.</p></div>  <div class="w-full max-w-3xl relative z-10">${``}  ${`<div class="animate-fade-in"><form class="relative group"> <div class="absolute -inset-1 bg-gradient-to-r from-brand-500 to-blue-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000 group-hover:duration-200"></div> <div class="${"relative flex flex-col sm:flex-row bg-surface-900 border border-surface-700/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 " + escape(
          displayUrlError ? "border-red-500/50 shadow-red-500/10" : "",
          true
        )}"><div class="flex-1 relative flex items-center"><input type="url" placeholder="Paste Baidu Pan link (share text supported)..." class="w-full bg-transparent px-6 py-5 pr-24 text-lg text-white placeholder:text-surface-500 focus:outline-none"${add_attribute("value", url, 0)}> ${``}</div> <button type="submit" ${"disabled"} class="px-8 py-5 sm:w-auto w-full bg-white text-surface-950 font-black text-lg sm:text-xl tracking-wide hover:bg-surface-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 group/btn"><span class="text-yellow-500 group-hover/btn:scale-110 transition-transform" data-svelte-h="svelte-1wemmnr">\u26A1</span> SCAN</button></div> ${displayUrlError ? `<div class="absolute -bottom-8 left-2 text-red-500 text-xs sm:text-sm font-semibold animate-fade-in flex items-center gap-1.5" data-svelte-h="svelte-wzi1cg"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
							Invalid Baidu link. Please check the format. (Share ID
							length must be 23 characters)</div>` : ``}</form>  <div class="mt-8 flex flex-col md:flex-row flex-wrap justify-center items-start md:items-center gap-x-6 gap-y-3 text-sm font-medium text-surface-400 mx-auto w-fit" data-svelte-h="svelte-14970f7"><div class="flex items-start gap-2 text-left"><span class="text-brand-500 shrink-0">\u2705</span> <span>High-Speed Cloud Transfers</span></div> <div class="flex items-start gap-2 text-left"><span class="text-brand-500 shrink-0">\u2705</span> <span>100% Privacy <span class="text-surface-600">(Auto-delete)</span></span></div> <div class="flex items-start gap-2 text-left"><span class="text-brand-500 shrink-0">\u2705</span> <span>No Account Needed for Preview</span></div></div></div>`}  ${``}  ${``}</div></div>  ${``} ${validate_component(ConfirmModal, "ConfirmModal").$$render(
          $$result,
          {
            title: "Confirm Teleport",
            message: "Are you sure you want to proceed?",
            confirmText: "Start Teleport",
            cancelText: "Go Back",
            icon: "\u{1F680}",
            confirmClass: "bg-brand-500 text-white hover:bg-brand-400 border border-brand-500/30 shadow-brand-500/20",
            onConfirm: confirmTeleportTask,
            open: teleportModalOpen
          },
          {
            open: ($$value) => {
              teleportModalOpen = $$value;
              $$settled = false;
            }
          },
          {}
        )}`;
      } while (!$$settled);
      $$unsubscribe_userStore();
      $$unsubscribe_authModalOpen();
      return $$rendered;
    });
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports3 = {};
__export(__exports3, {
  component: () => component3,
  fonts: () => fonts3,
  imports: () => imports3,
  index: () => index3,
  stylesheets: () => stylesheets3
});
var index3, component_cache3, component3, imports3, stylesheets3, fonts3;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    index3 = 2;
    component3 = async () => component_cache3 ??= (await Promise.resolve().then(() => (init_page_svelte(), page_svelte_exports))).default;
    imports3 = ["_app/immutable/nodes/2.DpPC66LY.js", "_app/immutable/chunks/UhH-2GMu.js", "_app/immutable/chunks/CELniAmD.js", "_app/immutable/chunks/D0QH3NT1.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/BxXFuEcV.js", "_app/immutable/chunks/RVXhQOml.js", "_app/immutable/chunks/B-UrQ5_i.js", "_app/immutable/chunks/DWITx2Ic.js", "_app/immutable/chunks/Z-QoULFV.js", "_app/immutable/chunks/DotA6MXx.js", "_app/immutable/chunks/DW4Susd9.js"];
    stylesheets3 = ["_app/immutable/assets/2.CuTqr9T9.css"];
    fonts3 = [];
  }
});

// .svelte-kit/output/server/entries/pages/dashboard/_page.svelte.js
var page_svelte_exports2 = {};
__export(page_svelte_exports2, {
  default: () => Page2
});
var Page2;
var init_page_svelte2 = __esm({
  ".svelte-kit/output/server/entries/pages/dashboard/_page.svelte.js"() {
    init_ssr();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    init_auth();
    init_ConfirmModal();
    Page2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_authModalOpen;
      let $$unsubscribe_userStore;
      $$unsubscribe_authModalOpen = subscribe(authModalOpen, (value) => value);
      $$unsubscribe_userStore = subscribe(userStore, (value) => value);
      let deleteModalOpen = false;
      async function confirmDelete() {
        return;
      }
      let $$settled;
      let $$rendered;
      let previous_head = $$result.head;
      do {
        $$settled = true;
        $$result.head = previous_head;
        $$rendered = `${$$result.head += `<!-- HEAD_svelte-dxceq8_START -->${$$result.title = `<title>My Account \u2014 FastBaidu</title>`, ""}<!-- HEAD_svelte-dxceq8_END -->`, ""} <div class="max-w-6xl mx-auto px-4 py-10">${`<div class="flex justify-center py-20" data-svelte-h="svelte-u7all4"><div class="w-12 h-12 border-4 border-surface-700/50 border-t-brand-500 rounded-full animate-spin"></div></div>`}</div>  ${validate_component(ConfirmModal, "ConfirmModal").$$render(
          $$result,
          {
            title: "Delete this task?",
            message: "This action cannot be undone. The task record will be permanently removed.",
            confirmText: "Delete",
            cancelText: "Cancel",
            icon: "\u{1F5D1}\uFE0F",
            onConfirm: confirmDelete,
            open: deleteModalOpen
          },
          {
            open: ($$value) => {
              deleteModalOpen = $$value;
              $$settled = false;
            }
          },
          {}
        )}`;
      } while (!$$settled);
      $$unsubscribe_authModalOpen();
      $$unsubscribe_userStore();
      return $$rendered;
    });
  }
});

// .svelte-kit/output/server/nodes/3.js
var __exports4 = {};
__export(__exports4, {
  component: () => component4,
  fonts: () => fonts4,
  imports: () => imports4,
  index: () => index4,
  stylesheets: () => stylesheets4
});
var index4, component_cache4, component4, imports4, stylesheets4, fonts4;
var init__4 = __esm({
  ".svelte-kit/output/server/nodes/3.js"() {
    index4 = 3;
    component4 = async () => component_cache4 ??= (await Promise.resolve().then(() => (init_page_svelte2(), page_svelte_exports2))).default;
    imports4 = ["_app/immutable/nodes/3.D3DrIojw.js", "_app/immutable/chunks/UhH-2GMu.js", "_app/immutable/chunks/CELniAmD.js", "_app/immutable/chunks/D0QH3NT1.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/DotA6MXx.js", "_app/immutable/chunks/B-UrQ5_i.js", "_app/immutable/chunks/RVXhQOml.js", "_app/immutable/chunks/DW4Susd9.js", "_app/immutable/chunks/DWITx2Ic.js"];
    stylesheets4 = [];
    fonts4 = [];
  }
});

// .svelte-kit/output/server/entries/pages/payment/_id_/_page.svelte.js
var page_svelte_exports3 = {};
__export(page_svelte_exports3, {
  default: () => Page3
});
var Page3;
var init_page_svelte3 = __esm({
  ".svelte-kit/output/server/entries/pages/payment/_id_/_page.svelte.js"() {
    init_ssr();
    init_stores();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    Page3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      $page.params.id;
      $$unsubscribe_page();
      return `<div class="flex items-center justify-center min-h-[50vh] text-surface-400" data-svelte-h="svelte-15u08ct"><div class="flex flex-col items-center gap-4"><div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div> <p>Redirecting to Top-Up...</p></div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/4.js
var __exports5 = {};
__export(__exports5, {
  component: () => component5,
  fonts: () => fonts5,
  imports: () => imports5,
  index: () => index5,
  stylesheets: () => stylesheets5
});
var index5, component_cache5, component5, imports5, stylesheets5, fonts5;
var init__5 = __esm({
  ".svelte-kit/output/server/nodes/4.js"() {
    index5 = 4;
    component5 = async () => component_cache5 ??= (await Promise.resolve().then(() => (init_page_svelte3(), page_svelte_exports3))).default;
    imports5 = ["_app/immutable/nodes/4.CRQXOQ11.js", "_app/immutable/chunks/UhH-2GMu.js", "_app/immutable/chunks/CELniAmD.js", "_app/immutable/chunks/fIZEV6l_.js", "_app/immutable/chunks/Z-QoULFV.js", "_app/immutable/chunks/DotA6MXx.js", "_app/immutable/chunks/B-UrQ5_i.js"];
    stylesheets5 = [];
    fonts5 = [];
  }
});

// .svelte-kit/output/server/entries/pages/payment/purchase/_page.svelte.js
var page_svelte_exports4 = {};
__export(page_svelte_exports4, {
  default: () => Page4
});
var css3, Page4;
var init_page_svelte4 = __esm({
  ".svelte-kit/output/server/entries/pages/payment/purchase/_page.svelte.js"() {
    init_ssr();
    init_stores();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    init_auth();
    css3 = {
      code: "@keyframes svelte-wi226f-shine{100%{margin-left:200%}}",
      map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { page } from \\"$app/stores\\";\\nimport { onMount } from \\"svelte\\";\\nimport { goto } from \\"$app/navigation\\";\\nimport { ordersApi } from \\"$lib/api/client\\";\\nimport { fetchPackages } from \\"$lib/api\\";\\nlet packages = [];\\nlet selectedPackage = null;\\nlet loading = true;\\nlet submitting = false;\\nlet error = \\"\\";\\n$: tierParam = $page.url.searchParams.get(\\"tier\\");\\n$: if (packages.length > 0 && tierParam !== null) {\\n  const idx = parseInt(tierParam, 10);\\n  if (idx >= 0 && idx < packages.length) {\\n    selectedPackage = packages[idx];\\n  } else {\\n    selectedPackage = null;\\n  }\\n}\\nonMount(async () => {\\n  try {\\n    const pkgData = await fetchPackages();\\n    packages = pkgData.tiers || [];\\n  } catch (e) {\\n    error = e.message || \\"Failed to load packages\\";\\n  } finally {\\n    loading = false;\\n  }\\n});\\nasync function handlePayment(method) {\\n  if (!selectedPackage) return;\\n  submitting = true;\\n  error = \\"\\";\\n  try {\\n    const res = await ordersApi.create(selectedPackage.name, method);\\n    if (res.payment_url) {\\n      window.location.href = res.payment_url;\\n    } else {\\n      error = \\"No payment URL returned from server.\\";\\n      submitting = false;\\n    }\\n  } catch (e) {\\n    error = e.message || \\"Failed to initialize payment\\";\\n    submitting = false;\\n  }\\n}\\n<\/script>\\n\\n<svelte:head>\\n    <title>Checkout \u2014 FastBaidu</title>\\n</svelte:head>\\n\\n<div class=\\"max-w-2xl mx-auto px-4 py-12\\">\\n    <div class=\\"text-center mb-8\\">\\n        <h1 class=\\"text-3xl font-bold text-white mb-2\\">Select Payment Method</h1>\\n        <p class=\\"text-surface-400\\">Complete your secure checkout for the selected package.</p>\\n    </div>\\n\\n    {#if loading}\\n        <div class=\\"h-64 bg-surface-800/50 rounded-2xl animate-pulse\\"></div>\\n    {:else if error}\\n        <div class=\\"text-center py-12 bg-red-500/10 border border-red-500/20 rounded-2xl\\">\\n            <div class=\\"text-4xl mb-4\\">\u26A0\uFE0F</div>\\n            <p class=\\"text-red-400 font-medium\\">{error}</p>\\n            <button\\n                on:click={() => goto('/topup')}\\n                class=\\"mt-4 px-6 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-white transition-colors\\"\\n            >\\n                Back to Packages\\n            </button>\\n        </div>\\n    {:else if !selectedPackage}\\n        <div class=\\"text-center py-12 bg-surface-800/30 rounded-2xl border border-surface-700/50\\">\\n            <p class=\\"text-surface-400 mb-4\\">No package selected or invalid tier.</p>\\n            <button\\n                on:click={() => goto('/topup')}\\n                class=\\"px-6 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-bold transition-colors\\"\\n            >\\n                View Packages\\n            </button>\\n        </div>\\n    {:else}\\n        <!-- Selected Package Summary -->\\n        <div class=\\"glass rounded-2xl p-6 mb-8 border border-surface-700/50\\">\\n            <div class=\\"flex justify-between items-center mb-4\\">\\n                <span class=\\"text-surface-400 text-sm font-semibold uppercase tracking-wider\\">Order Summary</span>\\n                <span class=\\"px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300\\">FastBaidu Top-Up</span>\\n            </div>\\n            \\n            <div class=\\"flex items-end justify-between border-b border-surface-700/50 pb-6 mb-6\\">\\n                <div>\\n                    <h2 class=\\"text-2xl font-bold text-white leading-tight\\">{selectedPackage.name} Package</h2>\\n                    <p class=\\"text-brand-400 font-medium mt-1\\">+{selectedPackage.size_gb} GB Quota</p>\\n                </div>\\n                <div class=\\"text-right\\">\\n                    <span class=\\"text-3xl font-black text-white\\">\${selectedPackage.price.toFixed(2)}</span>\\n                    <span class=\\"block text-surface-500 text-xs\\">USD One-time</span>\\n                </div>\\n            </div>\\n\\n            <!-- Payment Methods -->\\n            <div class=\\"space-y-4\\">\\n                <h3 class=\\"text-sm font-medium text-surface-300 mb-3\\">Pay securely with:</h3>\\n                \\n                <button\\n                    on:click={() => handlePayment('paypal')}\\n                    disabled={submitting}\\n                    class=\\"w-full relative group overflow-hidden bg-[#003087] hover:bg-[#00205e] disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.01] shadow-lg\\"\\n                >\\n                    <span class=\\"absolute inset-0 w-1/4 h-full bg-white/10 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]\\"></span>\\n                    <div class=\\"flex items-center gap-4 relative z-10\\">\\n                        <div class=\\"w-12 h-12 rounded-lg bg-white p-2.5 flex items-center justify-center\\">\\n                            <span class=\\"text-xl font-bold text-[#003087] italic\\">PayPal</span>\\n                        </div>\\n                        <div class=\\"text-left\\">\\n                            <div class=\\"font-bold text-lg\\">PayPal / Credit Card</div>\\n                            <div class=\\"text-blue-200 text-sm\\">Instant activation</div>\\n                        </div>\\n                    </div>\\n                    <span class=\\"relative z-10 text-2xl\\">\u2192</span>\\n                </button>\\n\\n                <button\\n                    on:click={() => handlePayment('nowpayments')}\\n                    disabled={submitting}\\n                    class=\\"w-full relative group overflow-hidden bg-surface-800 hover:bg-surface-700 border border-surface-600 hover:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.01] shadow-lg\\"\\n                >\\n                    <span class=\\"absolute inset-0 w-1/4 h-full bg-white/5 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]\\"></span>\\n                    <div class=\\"flex items-center gap-4 relative z-10\\">\\n                        <div class=\\"w-12 h-12 rounded-lg bg-surface-900 border border-surface-700 flex items-center justify-center text-xl\\">\\n                            \u{1FA99}\\n                        </div>\\n                        <div class=\\"text-left\\">\\n                            <div class=\\"font-bold text-lg text-white\\">Cryptocurrency</div>\\n                            <div class=\\"text-surface-400 text-sm\\">USDT, BTC, ETH, etc. (Powered by NOWPayments)</div>\\n                        </div>\\n                    </div>\\n                    <span class=\\"relative z-10 text-2xl text-surface-500 group-hover:text-brand-400 transition-colors\\">\u2192</span>\\n                </button>\\n            </div>\\n            \\n            {#if submitting}\\n                <div class=\\"mt-6 flex flex-col items-center justify-center text-surface-400\\">\\n                    <div class=\\"w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2\\"></div>\\n                    <span class=\\"text-sm font-medium\\">Redirecting to payment gateway...</span>\\n                </div>\\n            {/if}\\n        </div>\\n        \\n        <p class=\\"text-center text-xs text-surface-500 flex items-center justify-center gap-1\\">\\n            \u{1F512} Payments are processed securely on the gateway's website.\\n        </p>\\n    {/if}\\n</div>\\n\\n<style>\\n    @keyframes shine {\\n        100% {\\n            margin-left: 200%;\\n        }\\n    }\\n</style>\\n"],"names":[],"mappings":"AA4JI,WAAW,mBAAM,CACb,IAAK,CACD,WAAW,CAAE,IACjB,CACJ"}`
    };
    Page4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      $$result.css.add(css3);
      $page.url.searchParams.get("tier");
      $$unsubscribe_page();
      return `${$$result.head += `<!-- HEAD_svelte-qp0pae_START -->${$$result.title = `<title>Checkout \u2014 FastBaidu</title>`, ""}<!-- HEAD_svelte-qp0pae_END -->`, ""} <div class="max-w-2xl mx-auto px-4 py-12"><div class="text-center mb-8" data-svelte-h="svelte-vezixu"><h1 class="text-3xl font-bold text-white mb-2">Select Payment Method</h1> <p class="text-surface-400">Complete your secure checkout for the selected package.</p></div> ${`<div class="h-64 bg-surface-800/50 rounded-2xl animate-pulse"></div>`} </div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/5.js
var __exports6 = {};
__export(__exports6, {
  component: () => component6,
  fonts: () => fonts6,
  imports: () => imports6,
  index: () => index6,
  stylesheets: () => stylesheets6
});
var index6, component_cache6, component6, imports6, stylesheets6, fonts6;
var init__6 = __esm({
  ".svelte-kit/output/server/nodes/5.js"() {
    index6 = 5;
    component6 = async () => component_cache6 ??= (await Promise.resolve().then(() => (init_page_svelte4(), page_svelte_exports4))).default;
    imports6 = ["_app/immutable/nodes/5.C47qIs8p.js", "_app/immutable/chunks/UhH-2GMu.js", "_app/immutable/chunks/CELniAmD.js", "_app/immutable/chunks/fIZEV6l_.js", "_app/immutable/chunks/Z-QoULFV.js", "_app/immutable/chunks/DotA6MXx.js", "_app/immutable/chunks/B-UrQ5_i.js", "_app/immutable/chunks/RVXhQOml.js", "_app/immutable/chunks/BxXFuEcV.js"];
    stylesheets6 = ["_app/immutable/assets/5.lMtJqAl1.css"];
    fonts6 = [];
  }
});

// .svelte-kit/output/server/entries/pages/task/_id_/_page.svelte.js
var page_svelte_exports5 = {};
__export(page_svelte_exports5, {
  default: () => Page5
});
var Page5;
var init_page_svelte5 = __esm({
  ".svelte-kit/output/server/entries/pages/task/_id_/_page.svelte.js"() {
    init_ssr();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    init_auth();
    Page5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let taskId;
      let { data } = $$props;
      onDestroy(() => {
      });
      if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
      taskId = data.taskId;
      return `${$$result.head += `<!-- HEAD_svelte-1sx05pi_START -->${$$result.title = `<title>Task ${escape(taskId)} \u2014 FastBaidu</title>`, ""}<!-- HEAD_svelte-1sx05pi_END -->`, ""} <div class="max-w-3xl mx-auto px-4 py-12">${` <div class="space-y-6 animate-pulse" data-svelte-h="svelte-1aim5ph"><div class="h-8 w-1/3 bg-surface-800 rounded-lg"></div> <div class="h-24 bg-surface-800 rounded-2xl"></div> <div class="h-48 bg-surface-800 rounded-2xl"></div></div>`}</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/6.js
var __exports7 = {};
__export(__exports7, {
  component: () => component7,
  fonts: () => fonts7,
  imports: () => imports7,
  index: () => index7,
  stylesheets: () => stylesheets7,
  universal: () => universal,
  universal_id: () => universal_id
});
var index7, component_cache7, component7, universal, universal_id, imports7, stylesheets7, fonts7;
var init__7 = __esm({
  ".svelte-kit/output/server/nodes/6.js"() {
    index7 = 6;
    component7 = async () => component_cache7 ??= (await Promise.resolve().then(() => (init_page_svelte5(), page_svelte_exports5))).default;
    universal = {
      "ssr": false,
      "load": null
    };
    universal_id = "src/routes/task/[id]/+page.ts";
    imports7 = ["_app/immutable/nodes/6.C51pgKQB.js", "_app/immutable/chunks/UhH-2GMu.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/CELniAmD.js", "_app/immutable/chunks/Z-QoULFV.js", "_app/immutable/chunks/DotA6MXx.js", "_app/immutable/chunks/B-UrQ5_i.js", "_app/immutable/chunks/RVXhQOml.js", "_app/immutable/chunks/DWITx2Ic.js"];
    stylesheets7 = [];
    fonts7 = [];
  }
});

// .svelte-kit/output/server/entries/pages/topup/_page.svelte.js
var page_svelte_exports6 = {};
__export(page_svelte_exports6, {
  default: () => Page6
});
var Page6;
var init_page_svelte6 = __esm({
  ".svelte-kit/output/server/entries/pages/topup/_page.svelte.js"() {
    init_ssr();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    init_auth();
    init_ConfirmModal();
    Page6 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_authModalOpen;
      $$unsubscribe_authModalOpen = subscribe(authModalOpen, (value) => value);
      let buyModalOpen = false;
      function confirmBuy() {
      }
      let $$settled;
      let $$rendered;
      let previous_head = $$result.head;
      do {
        $$settled = true;
        $$result.head = previous_head;
        $$rendered = `${$$result.head += `<!-- HEAD_svelte-17swdhw_START -->${$$result.title = `<title>Top Up Credits \u2014 FastBaidu</title>`, ""}<!-- HEAD_svelte-17swdhw_END -->`, ""} <div class="max-w-5xl mx-auto px-4 py-12"><div class="text-center mb-12"><h1 class="text-3xl font-bold text-white mb-3" data-svelte-h="svelte-v2pwxl">Top Up Credits</h1> <p class="text-surface-400 text-lg" data-svelte-h="svelte-1f5m1he">Choose a package to start teleporting your files.</p> ${``}</div> ${`<div class="grid md:grid-cols-3 gap-6">${each(Array(3), (_) => {
          return `<div class="h-64 bg-surface-800/50 rounded-2xl animate-pulse"></div>`;
        })}</div>`} <div class="text-center mt-8" data-svelte-h="svelte-c2fyv3"><a href="/" class="text-surface-500 hover:text-brand-400 text-sm transition-colors">\u2190 Back to Home</a></div></div> ${validate_component(ConfirmModal, "ConfirmModal").$$render(
          $$result,
          {
            title: "Confirm Purchase",
            message: "",
            confirmText: "Proceed to Checkout",
            cancelText: "Cancel",
            icon: "\u{1F6CD}\uFE0F",
            confirmClass: "bg-brand-500 text-white hover:bg-brand-400 border border-brand-500/30 shadow-brand-500/20",
            onConfirm: confirmBuy,
            open: buyModalOpen
          },
          {
            open: ($$value) => {
              buyModalOpen = $$value;
              $$settled = false;
            }
          },
          {}
        )}`;
      } while (!$$settled);
      $$unsubscribe_authModalOpen();
      return $$rendered;
    });
  }
});

// .svelte-kit/output/server/nodes/7.js
var __exports8 = {};
__export(__exports8, {
  component: () => component8,
  fonts: () => fonts8,
  imports: () => imports8,
  index: () => index8,
  stylesheets: () => stylesheets8
});
var index8, component_cache8, component8, imports8, stylesheets8, fonts8;
var init__8 = __esm({
  ".svelte-kit/output/server/nodes/7.js"() {
    index8 = 7;
    component8 = async () => component_cache8 ??= (await Promise.resolve().then(() => (init_page_svelte6(), page_svelte_exports6))).default;
    imports8 = ["_app/immutable/nodes/7.D5NThPoq.js", "_app/immutable/chunks/UhH-2GMu.js", "_app/immutable/chunks/CELniAmD.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/Z-QoULFV.js", "_app/immutable/chunks/DotA6MXx.js", "_app/immutable/chunks/B-UrQ5_i.js", "_app/immutable/chunks/BxXFuEcV.js", "_app/immutable/chunks/RVXhQOml.js", "_app/immutable/chunks/DW4Susd9.js"];
    stylesheets8 = [];
    fonts8 = [];
  }
});

// node_modules/@sveltejs/kit/src/exports/index.js
init_internal();

// node_modules/esm-env/true.js
var true_default = true;

// node_modules/esm-env/dev-fallback.js
var node_env = globalThis.process?.env?.NODE_ENV;
var dev_fallback_default = node_env && !node_env.toLowerCase().startsWith("prod");

// node_modules/@sveltejs/kit/src/runtime/utils.js
var text_encoder = new TextEncoder();
var text_decoder = new TextDecoder();

// node_modules/@sveltejs/kit/src/exports/index.js
function error(status, body2) {
  if ((!true_default || dev_fallback_default) && (isNaN(status) || status < 400 || status > 599)) {
    throw new Error(`HTTP error status codes must be between 400 and 599 \u2014 ${status} is invalid`);
  }
  throw new HttpError(status, body2);
}
function json(data, init2) {
  const body2 = JSON.stringify(data);
  const headers2 = new Headers(init2?.headers);
  if (!headers2.has("content-length")) {
    headers2.set("content-length", text_encoder.encode(body2).byteLength.toString());
  }
  if (!headers2.has("content-type")) {
    headers2.set("content-type", "application/json");
  }
  return new Response(body2, {
    ...init2,
    headers: headers2
  });
}
function text(body2, init2) {
  const headers2 = new Headers(init2?.headers);
  if (!headers2.has("content-length")) {
    const encoded = text_encoder.encode(body2);
    headers2.set("content-length", encoded.byteLength.toString());
    return new Response(encoded, {
      ...init2,
      headers: headers2
    });
  }
  return new Response(body2, {
    ...init2,
    headers: headers2
  });
}

// .svelte-kit/output/server/chunks/shared.js
init_internal();
init_server();

// node_modules/devalue/src/utils.js
var escaped = {
  "<": "\\u003C",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var DevalueError = class extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   * @param {any} [value] - The value that failed to be serialized
   * @param {any} [root] - The root value being serialized
   */
  constructor(message, keys, value, root) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
    this.value = value;
    this.root = root;
  }
};
function is_primitive(thing) {
  return Object(thing) !== thing;
}
var object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(
  Object.prototype
).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const char = str[i];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i) + replacement;
      last_pos = i + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
var is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function stringify_key(key2) {
  return is_identifier.test(key2) ? "." + key2 : "[" + JSON.stringify(key2) + "]";
}
function is_valid_array_index(s3) {
  if (s3.length === 0) return false;
  if (s3.length > 1 && s3.charCodeAt(0) === 48) return false;
  for (let i = 0; i < s3.length; i++) {
    const c2 = s3.charCodeAt(i);
    if (c2 < 48 || c2 > 57) return false;
  }
  const n2 = +s3;
  if (n2 >= 2 ** 32 - 1) return false;
  if (n2 < 0) return false;
  return true;
}
function valid_array_indices(array2) {
  const keys = Object.keys(array2);
  for (var i = keys.length - 1; i >= 0; i--) {
    if (is_valid_array_index(keys[i])) {
      break;
    }
  }
  keys.length = i + 1;
  return keys;
}

// node_modules/devalue/src/uneval.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafe_chars = /[<\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
function uneval(value, replacer) {
  const counts = /* @__PURE__ */ new Map();
  const keys = [];
  const custom = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (!is_primitive(thing)) {
      if (counts.has(thing)) {
        counts.set(thing, counts.get(thing) + 1);
        return;
      }
      counts.set(thing, 1);
      if (replacer) {
        const str2 = replacer(thing, (value2) => uneval(value2, replacer));
        if (typeof str2 === "string") {
          custom.set(thing, str2);
          return;
        }
      }
      if (typeof thing === "function") {
        throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "BigInt":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
        case "URL":
        case "URLSearchParams":
          return;
        case "Array":
          thing.forEach((value2, i) => {
            keys.push(`[${i}]`);
            walk(value2);
            keys.pop();
          });
          break;
        case "Set":
          Array.from(thing).forEach(walk);
          break;
        case "Map":
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive(key2) : "..."})`
            );
            walk(value2);
            keys.pop();
          }
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
          walk(thing.buffer);
          return;
        case "ArrayBuffer":
          return;
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          return;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys,
              thing,
              value
            );
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys,
              thing,
              value
            );
          }
          for (const key2 of Object.keys(thing)) {
            if (key2 === "__proto__") {
              throw new DevalueError(
                `Cannot stringify objects with __proto__ keys`,
                keys,
                thing,
                value
              );
            }
            keys.push(stringify_key(key2));
            walk(thing[key2]);
            keys.pop();
          }
      }
    }
  }
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
    names.set(entry[0], get_name(i));
  });
  function stringify3(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (is_primitive(thing)) {
      return stringify_primitive(thing);
    }
    if (custom.has(thing)) {
      return custom.get(thing);
    }
    const type = get_type(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return `Object(${stringify3(thing.valueOf())})`;
      case "RegExp":
        return `new RegExp(${stringify_string(thing.source)}, "${thing.flags}")`;
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "URL":
        return `new URL(${stringify_string(thing.toString())})`;
      case "URLSearchParams":
        return `new URLSearchParams(${stringify_string(thing.toString())})`;
      case "Array": {
        let has_holes = false;
        let result = "[";
        for (let i = 0; i < thing.length; i += 1) {
          if (i > 0) result += ",";
          if (Object.hasOwn(thing, i)) {
            result += stringify3(thing[i]);
          } else if (!has_holes) {
            const populated_keys = valid_array_indices(
              /** @type {any[]} */
              thing
            );
            const population = populated_keys.length;
            const d = String(thing.length).length;
            const hole_cost = thing.length + 2;
            const sparse_cost = 25 + d + population * (d + 2);
            if (hole_cost > sparse_cost) {
              const entries = populated_keys.map((k) => `${k}:${stringify3(thing[k])}`).join(",");
              return `Object.assign(Array(${thing.length}),{${entries}})`;
            }
            has_holes = true;
            i -= 1;
          }
        }
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return result + tail + "]";
      }
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify3).join(",")}])`;
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "BigInt64Array":
      case "BigUint64Array": {
        let str2 = `new ${type}`;
        if (counts.get(thing.buffer) === 1) {
          const array2 = new thing.constructor(thing.buffer);
          str2 += `([${array2}])`;
        } else {
          str2 += `([${stringify3(thing.buffer)}])`;
        }
        const a = thing.byteOffset;
        const b = a + thing.byteLength;
        if (a > 0 || b !== thing.buffer.byteLength) {
          const m = +/(\d+)/.exec(type)[1] / 8;
          str2 += `.subarray(${a / m},${b / m})`;
        }
        return str2;
      }
      case "ArrayBuffer": {
        const ui8 = new Uint8Array(thing);
        return `new Uint8Array([${ui8.toString()}]).buffer`;
      }
      case "Temporal.Duration":
      case "Temporal.Instant":
      case "Temporal.PlainDate":
      case "Temporal.PlainTime":
      case "Temporal.PlainDateTime":
      case "Temporal.PlainMonthDay":
      case "Temporal.PlainYearMonth":
      case "Temporal.ZonedDateTime":
        return `${type}.from(${stringify_string(thing.toString())})`;
      default:
        const keys2 = Object.keys(thing);
        const obj = keys2.map((key2) => `${safe_key(key2)}:${stringify3(thing[key2])}`).join(",");
        const proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return keys2.length > 0 ? `{${obj},__proto__:null}` : `{__proto__:null}`;
        }
        return `{${obj}}`;
    }
  }
  const str = stringify3(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    names.forEach((name, thing) => {
      params.push(name);
      if (custom.has(thing)) {
        values.push(
          /** @type {string} */
          custom.get(thing)
        );
        return;
      }
      if (is_primitive(thing)) {
        values.push(stringify_primitive(thing));
        return;
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values.push(`Object(${stringify3(thing.valueOf())})`);
          break;
        case "RegExp":
          values.push(thing.toString());
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v, i) => {
            statements.push(`${name}[${i}]=${stringify3(v)}`);
          });
          break;
        case "Set":
          values.push(`new Set`);
          statements.push(
            `${name}.${Array.from(thing).map((v) => `add(${stringify3(v)})`).join(".")}`
          );
          break;
        case "Map":
          values.push(`new Map`);
          statements.push(
            `${name}.${Array.from(thing).map(([k, v]) => `set(${stringify3(k)}, ${stringify3(v)})`).join(".")}`
          );
          break;
        case "ArrayBuffer":
          values.push(
            `new Uint8Array([${new Uint8Array(thing).join(",")}]).buffer`
          );
          break;
        default:
          values.push(
            Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}"
          );
          Object.keys(thing).forEach((key2) => {
            statements.push(
              `${name}${safe_prop(key2)}=${stringify3(thing[key2])}`
            );
          });
      }
    });
    statements.push(`return ${str}`);
    return `(function(${params.join(",")}){${statements.join(
      ";"
    )}}(${values.join(",")}))`;
  } else {
    return str;
  }
}
function get_name(num) {
  let name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? `${name}0` : name;
}
function escape_unsafe_char(c2) {
  return escaped[c2] || c2;
}
function escape_unsafe_chars(str) {
  return str.replace(unsafe_chars, escape_unsafe_char);
}
function safe_key(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escape_unsafe_chars(JSON.stringify(key2));
}
function safe_prop(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? `.${key2}` : `[${escape_unsafe_chars(JSON.stringify(key2))}]`;
}
function stringify_primitive(thing) {
  if (typeof thing === "string") return stringify_string(thing);
  if (thing === void 0) return "void 0";
  if (thing === 0 && 1 / thing < 0) return "-0";
  const str = String(thing);
  if (typeof thing === "number") return str.replace(/^(-)?0\./, "$1.");
  if (typeof thing === "bigint") return thing + "n";
  return str;
}

// node_modules/devalue/src/base64.js
function encode64(arraybuffer) {
  const dv = new DataView(arraybuffer);
  let binaryString = "";
  for (let i = 0; i < arraybuffer.byteLength; i++) {
    binaryString += String.fromCharCode(dv.getUint8(i));
  }
  return binaryToAscii(binaryString);
}
function decode64(string) {
  const binaryString = asciiToBinary(string);
  const arraybuffer = new ArrayBuffer(binaryString.length);
  const dv = new DataView(arraybuffer);
  for (let i = 0; i < arraybuffer.byteLength; i++) {
    dv.setUint8(i, binaryString.charCodeAt(i));
  }
  return arraybuffer;
}
var KEY_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function asciiToBinary(data) {
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }
  let output = "";
  let buffer = 0;
  let accumulatedBits = 0;
  for (let i = 0; i < data.length; i++) {
    buffer <<= 6;
    buffer |= KEY_STRING.indexOf(data[i]);
    accumulatedBits += 6;
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 16711680) >> 16);
      output += String.fromCharCode((buffer & 65280) >> 8);
      output += String.fromCharCode(buffer & 255);
      buffer = accumulatedBits = 0;
    }
  }
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 65280) >> 8);
    output += String.fromCharCode(buffer & 255);
  }
  return output;
}
function binaryToAscii(str) {
  let out = "";
  for (let i = 0; i < str.length; i += 3) {
    const groupsOfSix = [void 0, void 0, void 0, void 0];
    groupsOfSix[0] = str.charCodeAt(i) >> 2;
    groupsOfSix[1] = (str.charCodeAt(i) & 3) << 4;
    if (str.length > i + 1) {
      groupsOfSix[1] |= str.charCodeAt(i + 1) >> 4;
      groupsOfSix[2] = (str.charCodeAt(i + 1) & 15) << 2;
    }
    if (str.length > i + 2) {
      groupsOfSix[2] |= str.charCodeAt(i + 2) >> 6;
      groupsOfSix[3] = str.charCodeAt(i + 2) & 63;
    }
    for (let j = 0; j < groupsOfSix.length; j++) {
      if (typeof groupsOfSix[j] === "undefined") {
        out += "=";
      } else {
        out += KEY_STRING[groupsOfSix[j]];
      }
    }
  }
  return out;
}

// node_modules/devalue/src/constants.js
var UNDEFINED = -1;
var HOLE = -2;
var NAN = -3;
var POSITIVE_INFINITY = -4;
var NEGATIVE_INFINITY = -5;
var NEGATIVE_ZERO = -6;
var SPARSE = -7;

// node_modules/devalue/src/parse.js
function parse(serialized, revivers) {
  return unflatten(JSON.parse(serialized), revivers);
}
function unflatten(parsed, revivers) {
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  let hydrating = null;
  function hydrate(index9, standalone = false) {
    if (index9 === UNDEFINED) return void 0;
    if (index9 === NAN) return NaN;
    if (index9 === POSITIVE_INFINITY) return Infinity;
    if (index9 === NEGATIVE_INFINITY) return -Infinity;
    if (index9 === NEGATIVE_ZERO) return -0;
    if (standalone || typeof index9 !== "number") {
      throw new Error(`Invalid input`);
    }
    if (index9 in hydrated) return hydrated[index9];
    const value = values[index9];
    if (!value || typeof value !== "object") {
      hydrated[index9] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
        if (reviver) {
          let i = value[1];
          if (typeof i !== "number") {
            i = values.push(value[1]) - 1;
          }
          hydrating ??= /* @__PURE__ */ new Set();
          if (hydrating.has(i)) {
            throw new Error("Invalid circular reference");
          }
          hydrating.add(i);
          hydrated[index9] = reviver(hydrate(i));
          hydrating.delete(i);
          return hydrated[index9];
        }
        switch (type) {
          case "Date":
            hydrated[index9] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index9] = set;
            for (let i = 1; i < value.length; i += 1) {
              set.add(hydrate(value[i]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index9] = map;
            for (let i = 1; i < value.length; i += 2) {
              map.set(hydrate(value[i]), hydrate(value[i + 1]));
            }
            break;
          case "RegExp":
            hydrated[index9] = new RegExp(value[1], value[2]);
            break;
          case "Object":
            hydrated[index9] = Object(value[1]);
            break;
          case "BigInt":
            hydrated[index9] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index9] = obj;
            for (let i = 1; i < value.length; i += 2) {
              obj[value[i]] = hydrate(value[i + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array": {
            if (values[value[1]][0] !== "ArrayBuffer") {
              throw new Error("Invalid data");
            }
            const TypedArrayConstructor = globalThis[type];
            const buffer = hydrate(value[1]);
            const typedArray = new TypedArrayConstructor(buffer);
            hydrated[index9] = value[2] !== void 0 ? typedArray.subarray(value[2], value[3]) : typedArray;
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            if (typeof base64 !== "string") {
              throw new Error("Invalid ArrayBuffer encoding");
            }
            const arraybuffer = decode64(base64);
            hydrated[index9] = arraybuffer;
            break;
          }
          case "Temporal.Duration":
          case "Temporal.Instant":
          case "Temporal.PlainDate":
          case "Temporal.PlainTime":
          case "Temporal.PlainDateTime":
          case "Temporal.PlainMonthDay":
          case "Temporal.PlainYearMonth":
          case "Temporal.ZonedDateTime": {
            const temporalName = type.slice(9);
            hydrated[index9] = Temporal[temporalName].from(value[1]);
            break;
          }
          case "URL": {
            const url = new URL(value[1]);
            hydrated[index9] = url;
            break;
          }
          case "URLSearchParams": {
            const url = new URLSearchParams(value[1]);
            hydrated[index9] = url;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else if (value[0] === SPARSE) {
        const len = value[1];
        const array2 = new Array(len);
        hydrated[index9] = array2;
        for (let i = 2; i < value.length; i += 2) {
          const idx = value[i];
          array2[idx] = hydrate(value[i + 1]);
        }
      } else {
        const array2 = new Array(value.length);
        hydrated[index9] = array2;
        for (let i = 0; i < value.length; i += 1) {
          const n2 = value[i];
          if (n2 === HOLE) continue;
          array2[i] = hydrate(n2);
        }
      }
    } else {
      const object = {};
      hydrated[index9] = object;
      for (const key2 of Object.keys(value)) {
        if (key2 === "__proto__") {
          throw new Error("Cannot parse an object with a `__proto__` property");
        }
        const n2 = value[key2];
        object[key2] = hydrate(n2);
      }
    }
    return hydrated[index9];
  }
  return hydrate(0);
}

// node_modules/devalue/src/stringify.js
function stringify(value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  if (reducers) {
    for (const key2 of Object.getOwnPropertyNames(reducers)) {
      custom.push({ key: key2, fn: reducers[key2] });
    }
  }
  const keys = [];
  let p = 0;
  function flatten(thing) {
    if (thing === void 0) return UNDEFINED;
    if (Number.isNaN(thing)) return NAN;
    if (thing === Infinity) return POSITIVE_INFINITY;
    if (thing === -Infinity) return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;
    if (indexes.has(thing)) return indexes.get(thing);
    const index10 = p++;
    indexes.set(thing, index10);
    for (const { key: key2, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index10] = `["${key2}",${flatten(value2)}]`;
        return index10;
      }
    }
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive2(thing);
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          str = `["Object",${stringify_primitive2(thing)}]`;
          break;
        case "BigInt":
          str = `["BigInt",${thing}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "URL":
          str = `["URL",${stringify_string(thing.toString())}]`;
          break;
        case "URLSearchParams":
          str = `["URLSearchParams",${stringify_string(thing.toString())}]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array": {
          let mostly_dense = false;
          str = "[";
          for (let i = 0; i < thing.length; i += 1) {
            if (i > 0) str += ",";
            if (Object.hasOwn(thing, i)) {
              keys.push(`[${i}]`);
              str += flatten(thing[i]);
              keys.pop();
            } else if (mostly_dense) {
              str += HOLE;
            } else {
              const populated_keys = valid_array_indices(
                /** @type {any[]} */
                thing
              );
              const population = populated_keys.length;
              const d = String(thing.length).length;
              const hole_cost = (thing.length - population) * 3;
              const sparse_cost = 4 + d + population * (d + 1);
              if (hole_cost > sparse_cost) {
                str = "[" + SPARSE + "," + thing.length;
                for (let j = 0; j < populated_keys.length; j++) {
                  const key2 = populated_keys[j];
                  keys.push(`[${key2}]`);
                  str += "," + key2 + "," + flatten(thing[key2]);
                  keys.pop();
                }
                break;
              } else {
                mostly_dense = true;
                str += HOLE;
              }
            }
          }
          str += "]";
          break;
        }
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive2(key2) : "..."})`
            );
            str += `,${flatten(key2)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array": {
          const typedArray = thing;
          str = '["' + type + '",' + flatten(typedArray.buffer);
          const a = thing.byteOffset;
          const b = a + thing.byteLength;
          if (a > 0 || b !== typedArray.buffer.byteLength) {
            const m = +/(\d+)/.exec(type)[1] / 8;
            str += `,${a / m},${b / m}`;
          }
          str += "]";
          break;
        }
        case "ArrayBuffer": {
          const arraybuffer = thing;
          const base64 = encode64(arraybuffer);
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          str = `["${type}",${stringify_string(thing.toString())}]`;
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys,
              thing,
              value
            );
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys,
              thing,
              value
            );
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key2 of Object.keys(thing)) {
              if (key2 === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              keys.push(stringify_key(key2));
              str += `,${stringify_string(key2)},${flatten(thing[key2])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key2 of Object.keys(thing)) {
              if (key2 === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              if (started) str += ",";
              started = true;
              keys.push(stringify_key(key2));
              str += `${stringify_string(key2)}:${flatten(thing[key2])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index10] = str;
    return index10;
  }
  const index9 = flatten(value);
  if (index9 < 0) return `${index9}`;
  return `[${stringified.join(",")}]`;
}
function stringify_primitive2(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing instanceof String) return stringify_string(thing.toString());
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}

// .svelte-kit/output/server/chunks/shared.js
init_utils();
var BROWSER = false;
var SVELTE_KIT_ASSETS = "/_svelte_kit_assets";
var ENDPOINT_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
var MUTATIVE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
var PAGE_METHODS = ["GET", "POST", "HEAD"];
function set_nested_value(object, path_string, value) {
  if (path_string.startsWith("n:")) {
    path_string = path_string.slice(2);
    value = value === "" ? void 0 : parseFloat(value);
  } else if (path_string.startsWith("b:")) {
    path_string = path_string.slice(2);
    value = value === "on";
  }
  deep_set(object, split_path(path_string), value);
}
function convert_formdata(data) {
  const result = {};
  for (let key2 of data.keys()) {
    const is_array = key2.endsWith("[]");
    let values = data.getAll(key2);
    if (is_array) key2 = key2.slice(0, -2);
    if (values.length > 1 && !is_array) {
      throw new Error(`Form cannot contain duplicated keys \u2014 "${key2}" has ${values.length} values`);
    }
    values = values.filter(
      (entry) => typeof entry === "string" || entry.name !== "" || entry.size > 0
    );
    if (key2.startsWith("n:")) {
      key2 = key2.slice(2);
      values = values.map((v) => v === "" ? void 0 : parseFloat(
        /** @type {string} */
        v
      ));
    } else if (key2.startsWith("b:")) {
      key2 = key2.slice(2);
      values = values.map((v) => v === "on");
    }
    set_nested_value(result, key2, is_array ? values : values[0]);
  }
  return result;
}
var BINARY_FORM_CONTENT_TYPE = "application/x-sveltekit-formdata";
var BINARY_FORM_VERSION = 0;
var HEADER_BYTES = 1 + 4 + 2;
async function deserialize_binary_form(request) {
  if (request.headers.get("content-type") !== BINARY_FORM_CONTENT_TYPE) {
    const form_data = await request.formData();
    return { data: convert_formdata(form_data), meta: {}, form_data };
  }
  if (!request.body) {
    throw deserialize_error("no body");
  }
  const content_length = parseInt(request.headers.get("content-length") ?? "");
  if (Number.isNaN(content_length)) {
    throw deserialize_error("invalid Content-Length header");
  }
  const reader = request.body.getReader();
  const chunks = [];
  function get_chunk(index9) {
    if (index9 in chunks) return chunks[index9];
    let i = chunks.length;
    while (i <= index9) {
      chunks[i] = reader.read().then((chunk) => chunk.value);
      i++;
    }
    return chunks[index9];
  }
  async function get_buffer(offset, length) {
    let start_chunk;
    let chunk_start = 0;
    let chunk_index;
    for (chunk_index = 0; ; chunk_index++) {
      const chunk = await get_chunk(chunk_index);
      if (!chunk) return null;
      const chunk_end = chunk_start + chunk.byteLength;
      if (offset >= chunk_start && offset < chunk_end) {
        start_chunk = chunk;
        break;
      }
      chunk_start = chunk_end;
    }
    if (offset + length <= chunk_start + start_chunk.byteLength) {
      return start_chunk.subarray(offset - chunk_start, offset + length - chunk_start);
    }
    const chunks2 = [start_chunk.subarray(offset - chunk_start)];
    let cursor = start_chunk.byteLength - offset + chunk_start;
    while (cursor < length) {
      chunk_index++;
      let chunk = await get_chunk(chunk_index);
      if (!chunk) return null;
      if (chunk.byteLength > length - cursor) {
        chunk = chunk.subarray(0, length - cursor);
      }
      chunks2.push(chunk);
      cursor += chunk.byteLength;
    }
    const buffer = new Uint8Array(length);
    cursor = 0;
    for (const chunk of chunks2) {
      buffer.set(chunk, cursor);
      cursor += chunk.byteLength;
    }
    return buffer;
  }
  const header = await get_buffer(0, HEADER_BYTES);
  if (!header) throw deserialize_error("too short");
  if (header[0] !== BINARY_FORM_VERSION) {
    throw deserialize_error(`got version ${header[0]}, expected version ${BINARY_FORM_VERSION}`);
  }
  const header_view = new DataView(header.buffer, header.byteOffset, header.byteLength);
  const data_length = header_view.getUint32(1, true);
  if (HEADER_BYTES + data_length > content_length) {
    throw deserialize_error("data overflow");
  }
  const file_offsets_length = header_view.getUint16(5, true);
  if (HEADER_BYTES + data_length + file_offsets_length > content_length) {
    throw deserialize_error("file offset table overflow");
  }
  const data_buffer = await get_buffer(HEADER_BYTES, data_length);
  if (!data_buffer) throw deserialize_error("data too short");
  let file_offsets;
  let files_start_offset;
  if (file_offsets_length > 0) {
    const file_offsets_buffer = await get_buffer(HEADER_BYTES + data_length, file_offsets_length);
    if (!file_offsets_buffer) throw deserialize_error("file offset table too short");
    const parsed_offsets = JSON.parse(text_decoder2.decode(file_offsets_buffer));
    if (!Array.isArray(parsed_offsets) || parsed_offsets.some((n2) => typeof n2 !== "number" || !Number.isInteger(n2) || n2 < 0)) {
      throw deserialize_error("invalid file offset table");
    }
    file_offsets = /** @type {Array<number>} */
    parsed_offsets;
    files_start_offset = HEADER_BYTES + data_length + file_offsets_length;
  }
  const file_spans = [];
  const [data, meta] = parse(text_decoder2.decode(data_buffer), {
    File: ([name, type, size, last_modified, index9]) => {
      if (typeof name !== "string" || typeof type !== "string" || typeof size !== "number" || typeof last_modified !== "number" || typeof index9 !== "number") {
        throw deserialize_error("invalid file metadata");
      }
      let offset = file_offsets[index9];
      if (offset === void 0) {
        throw deserialize_error("duplicate file offset table index");
      }
      file_offsets[index9] = void 0;
      offset += files_start_offset;
      if (offset + size > content_length) {
        throw deserialize_error("file data overflow");
      }
      file_spans.push({ offset, size });
      return new Proxy(new LazyFile(name, type, size, last_modified, get_chunk, offset), {
        getPrototypeOf() {
          return File.prototype;
        }
      });
    }
  });
  file_spans.sort((a, b) => a.offset - b.offset || a.size - b.size);
  for (let i = 1; i < file_spans.length; i++) {
    const previous = file_spans[i - 1];
    const current2 = file_spans[i];
    const previous_end = previous.offset + previous.size;
    if (previous_end < current2.offset) {
      throw deserialize_error("gaps in file data");
    }
    if (previous_end > current2.offset) {
      throw deserialize_error("overlapping file data");
    }
  }
  void (async () => {
    let has_more = true;
    while (has_more) {
      const chunk = await get_chunk(chunks.length);
      has_more = !!chunk;
    }
  })();
  return { data, meta, form_data: null };
}
function deserialize_error(message) {
  return new SvelteKitError(400, "Bad Request", `Could not deserialize binary form: ${message}`);
}
var LazyFile = class _LazyFile {
  /** @type {(index: number) => Promise<Uint8Array<ArrayBuffer> | undefined>} */
  #get_chunk;
  /** @type {number} */
  #offset;
  /**
   * @param {string} name
   * @param {string} type
   * @param {number} size
   * @param {number} last_modified
   * @param {(index: number) => Promise<Uint8Array<ArrayBuffer> | undefined>} get_chunk
   * @param {number} offset
   */
  constructor(name, type, size, last_modified, get_chunk, offset) {
    this.name = name;
    this.type = type;
    this.size = size;
    this.lastModified = last_modified;
    this.webkitRelativePath = "";
    this.#get_chunk = get_chunk;
    this.#offset = offset;
    this.arrayBuffer = this.arrayBuffer.bind(this);
    this.bytes = this.bytes.bind(this);
    this.slice = this.slice.bind(this);
    this.stream = this.stream.bind(this);
    this.text = this.text.bind(this);
  }
  /** @type {ArrayBuffer | undefined} */
  #buffer;
  async arrayBuffer() {
    this.#buffer ??= await new Response(this.stream()).arrayBuffer();
    return this.#buffer;
  }
  async bytes() {
    return new Uint8Array(await this.arrayBuffer());
  }
  /**
   * @param {number=} start
   * @param {number=} end
   * @param {string=} contentType
   */
  slice(start = 0, end = this.size, contentType = this.type) {
    if (start < 0) {
      start = Math.max(this.size + start, 0);
    } else {
      start = Math.min(start, this.size);
    }
    if (end < 0) {
      end = Math.max(this.size + end, 0);
    } else {
      end = Math.min(end, this.size);
    }
    const size = Math.max(end - start, 0);
    const file = new _LazyFile(
      this.name,
      contentType,
      size,
      this.lastModified,
      this.#get_chunk,
      this.#offset + start
    );
    return file;
  }
  stream() {
    let cursor = 0;
    let chunk_index = 0;
    return new ReadableStream({
      start: async (controller) => {
        let chunk_start = 0;
        let start_chunk;
        for (chunk_index = 0; ; chunk_index++) {
          const chunk = await this.#get_chunk(chunk_index);
          if (!chunk) return null;
          const chunk_end = chunk_start + chunk.byteLength;
          if (this.#offset >= chunk_start && this.#offset < chunk_end) {
            start_chunk = chunk;
            break;
          }
          chunk_start = chunk_end;
        }
        if (this.#offset + this.size <= chunk_start + start_chunk.byteLength) {
          controller.enqueue(
            start_chunk.subarray(this.#offset - chunk_start, this.#offset + this.size - chunk_start)
          );
          controller.close();
        } else {
          controller.enqueue(start_chunk.subarray(this.#offset - chunk_start));
          cursor = start_chunk.byteLength - this.#offset + chunk_start;
        }
      },
      pull: async (controller) => {
        chunk_index++;
        let chunk = await this.#get_chunk(chunk_index);
        if (!chunk) {
          controller.error("incomplete file data");
          controller.close();
          return;
        }
        if (chunk.byteLength > this.size - cursor) {
          chunk = chunk.subarray(0, this.size - cursor);
        }
        controller.enqueue(chunk);
        cursor += chunk.byteLength;
        if (cursor >= this.size) {
          controller.close();
        }
      }
    });
  }
  async text() {
    return text_decoder2.decode(await this.arrayBuffer());
  }
};
var path_regex = /^[a-zA-Z_$]\w*(\.[a-zA-Z_$]\w*|\[\d+\])*$/;
function split_path(path) {
  if (!path_regex.test(path)) {
    throw new Error(`Invalid path ${path}`);
  }
  return path.split(/\.|\[|\]/).filter(Boolean);
}
function check_prototype_pollution(key2) {
  if (key2 === "__proto__" || key2 === "constructor" || key2 === "prototype") {
    throw new Error(
      `Invalid key "${key2}"`
    );
  }
}
function deep_set(object, keys, value) {
  let current2 = object;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key2 = keys[i];
    check_prototype_pollution(key2);
    const is_array = /^\d+$/.test(keys[i + 1]);
    const exists = Object.hasOwn(current2, key2);
    const inner = current2[key2];
    if (exists && is_array !== Array.isArray(inner)) {
      throw new Error(`Invalid array key ${keys[i + 1]}`);
    }
    if (!exists) {
      current2[key2] = is_array ? [] : {};
    }
    current2 = current2[key2];
  }
  const final_key = keys[keys.length - 1];
  check_prototype_pollution(final_key);
  current2[final_key] = value;
}
function negotiate(accept, types) {
  const parts = [];
  accept.split(",").forEach((str, i) => {
    const match = /([^/ \t]+)\/([^; \t]+)[ \t]*(?:;[ \t]*q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      parts.push({ type, subtype, q: +q, i });
    }
  });
  parts.sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex(
      (part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*")
    );
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
function is_content_type(request, ...types) {
  const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
  return types.includes(type.toLowerCase());
}
function is_form_content_type(request) {
  return is_content_type(
    request,
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain",
    BINARY_FORM_CONTENT_TYPE
  );
}
function coalesce_to_error(err) {
  return err instanceof Error || err && /** @type {any} */
  err.name && /** @type {any} */
  err.message ? (
    /** @type {Error} */
    err
  ) : new Error(JSON.stringify(err));
}
function normalize_error(error2) {
  return (
    /** @type {import('../exports/internal/index.js').Redirect | HttpError | SvelteKitError | Error} */
    error2
  );
}
function get_status(error2) {
  return error2 instanceof HttpError || error2 instanceof SvelteKitError ? error2.status : 500;
}
function get_message(error2) {
  return error2 instanceof SvelteKitError ? error2.text : "Internal Error";
}
var escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
  // Svelte also escapes < because the escape function could be called inside a `noscript` there
  // https://github.com/sveltejs/svelte/security/advisories/GHSA-8266-84wp-wv5c
  // However, that doesn't apply in SvelteKit
};
var escape_html_dict = {
  "&": "&amp;",
  "<": "&lt;"
};
var surrogates = (
  // high surrogate without paired low surrogate
  "[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]"
);
var escape_html_attr_regex = new RegExp(
  `[${Object.keys(escape_html_attr_dict).join("")}]|` + surrogates,
  "g"
);
var escape_html_regex = new RegExp(
  `[${Object.keys(escape_html_dict).join("")}]|` + surrogates,
  "g"
);
function escape_html(str, is_attr) {
  const dict = is_attr ? escape_html_attr_dict : escape_html_dict;
  const escaped_str = str.replace(is_attr ? escape_html_attr_regex : escape_html_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return escaped_str;
}
function method_not_allowed(mod, method) {
  return text(`${method} method not allowed`, {
    status: 405,
    headers: {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: allowed_methods(mod).join(", ")
    }
  });
}
function allowed_methods(mod) {
  const allowed = ENDPOINT_METHODS.filter((method) => method in mod);
  if ("GET" in mod && !("HEAD" in mod)) {
    allowed.push("HEAD");
  }
  return allowed;
}
function get_global_name(options2) {
  return `__sveltekit_${options2.version_hash}`;
}
function static_error_page(options2, status, message) {
  let page2 = options2.templates.error({ status, message: escape_html(message) });
  return text(page2, {
    headers: { "content-type": "text/html; charset=utf-8" },
    status
  });
}
async function handle_fatal_error(event, state, options2, error2) {
  error2 = error2 instanceof HttpError ? error2 : coalesce_to_error(error2);
  const status = get_status(error2);
  const body2 = await handle_error_and_jsonify(event, state, options2, error2);
  const type = negotiate(event.request.headers.get("accept") || "text/html", [
    "application/json",
    "text/html"
  ]);
  if (event.isDataRequest || type === "application/json") {
    return json(body2, {
      status
    });
  }
  return static_error_page(options2, status, body2.message);
}
async function handle_error_and_jsonify(event, state, options2, error2) {
  if (error2 instanceof HttpError) {
    return { message: "Unknown Error", ...error2.body };
  }
  const status = get_status(error2);
  const message = get_message(error2);
  return await with_request_store(
    { event, state },
    () => options2.hooks.handleError({ error: error2, event, status, message })
  ) ?? { message };
}
function redirect_response(status, location) {
  const response = new Response(void 0, {
    status,
    headers: { location }
  });
  return response;
}
function clarify_devalue_error(event, error2) {
  if (error2.path) {
    return `Data returned from \`load\` while rendering ${event.route.id} is not serializable: ${error2.message} (${error2.path}). If you need to serialize/deserialize custom types, use transport hooks: https://svelte.dev/docs/kit/hooks#Universal-hooks-transport.`;
  }
  if (error2.path === "") {
    return `Data returned from \`load\` while rendering ${event.route.id} is not a plain object`;
  }
  return error2.message;
}
function serialize_uses(node) {
  const uses = {};
  if (node.uses && node.uses.dependencies.size > 0) {
    uses.dependencies = Array.from(node.uses.dependencies);
  }
  if (node.uses && node.uses.search_params.size > 0) {
    uses.search_params = Array.from(node.uses.search_params);
  }
  if (node.uses && node.uses.params.size > 0) {
    uses.params = Array.from(node.uses.params);
  }
  if (node.uses?.parent) uses.parent = 1;
  if (node.uses?.route) uses.route = 1;
  if (node.uses?.url) uses.url = 1;
  return uses;
}
function has_prerendered_path(manifest2, pathname) {
  return manifest2._.prerendered_routes.has(pathname) || pathname.at(-1) === "/" && manifest2._.prerendered_routes.has(pathname.slice(0, -1));
}
function format_server_error(status, error2, event) {
  const formatted_text = `
\x1B[1;31m[${status}] ${event.request.method} ${event.url.pathname}\x1B[0m`;
  if (status === 404) {
    return formatted_text;
  }
  return `${formatted_text}
${error2.stack}`;
}
function get_node_type(node_id) {
  const parts = node_id?.split("/");
  const filename = parts?.at(-1);
  if (!filename) return "unknown";
  const dot_parts = filename.split(".");
  return dot_parts.slice(0, -1).join(".");
}
var INVALIDATED_PARAM = "x-sveltekit-invalidated";
var TRAILING_SLASH_PARAM = "x-sveltekit-trailing-slash";
function stringify2(data, transport) {
  const encoders = Object.fromEntries(Object.entries(transport).map(([k, v]) => [k, v.encode]));
  return stringify(data, encoders);
}
function parse_remote_arg(string, transport) {
  if (!string) return void 0;
  const json_string = text_decoder2.decode(
    // no need to add back `=` characters, atob can handle it
    base64_decode(string.replaceAll("-", "+").replaceAll("_", "/"))
  );
  const decoders = Object.fromEntries(Object.entries(transport).map(([k, v]) => [k, v.decode]));
  return parse(json_string, decoders);
}
function create_remote_key(id, payload) {
  return id + "/" + payload;
}

// .svelte-kit/output/server/index.js
init_internal();
init_server();

// .svelte-kit/output/server/chunks/environment.js
var base = "";
var assets = base;
var app_dir = "_app";
var relative = true;
var initial = { base, assets };
function override(paths) {
  base = paths.base;
  assets = paths.assets;
}
function reset() {
  base = initial.base;
  assets = initial.assets;
}

// .svelte-kit/output/server/index.js
init_exports();
init_utils();
init_chunks();

// .svelte-kit/output/server/chunks/internal.js
init_ssr();
init_ssr2();
var public_env = {};
function set_private_env(environment) {
}
function set_public_env(environment) {
  public_env = environment;
}
var read_implementation = null;
function set_read_implementation(fn) {
  read_implementation = fn;
}
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { constructors } = $$props;
  let { components = [] } = $$props;
  let { form } = $$props;
  let { data_0 = null } = $$props;
  let { data_1 = null } = $$props;
  {
    setContext("__svelte__", stores);
  }
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0) $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0) $$bindings.page(page2);
  if ($$props.constructors === void 0 && $$bindings.constructors && constructors !== void 0) $$bindings.constructors(constructors);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0) $$bindings.components(components);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  if ($$props.data_0 === void 0 && $$bindings.data_0 && data_0 !== void 0) $$bindings.data_0(data_0);
  if ($$props.data_1 === void 0 && $$bindings.data_1 && data_1 !== void 0) $$bindings.data_1(data_1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      stores.page.set(page2);
    }
    $$rendered = `  ${constructors[1] ? `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      {
        data: data_0,
        params: page2.params,
        this: components[0]
      },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(constructors[1] || missing_component, "svelte:component").$$render(
            $$result,
            {
              data: data_1,
              form,
              params: page2.params,
              this: components[1]
            },
            {
              this: ($$value) => {
                components[1] = $$value;
                $$settled = false;
              }
            },
            {}
          )}`;
        }
      }
    )}` : `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      {
        data: data_0,
        form,
        params: page2.params,
        this: components[0]
      },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {}
    )}`} ${``}`;
  } while (!$$settled);
  return $$rendered;
});
var options = {
  app_template_contains_nonce: false,
  async: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: true,
  csrf_trusted_origins: [],
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hash_routing: false,
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root: Root,
  service_worker: false,
  service_worker_options: void 0,
  templates: {
    app: ({ head, body: body2, assets: assets2, nonce, env }) => '<!doctype html>\n<html lang="en">\n\n<head>\n	<meta charset="utf-8" />\n	<meta name="viewport" content="width=device-width, initial-scale=1" />\n	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />\n	' + head + '\n</head>\n\n<body data-sveltekit-preload-data="hover">\n	<div style="display: contents">' + body2 + "</div>\n</body>\n\n</html>",
    error: ({ status, message }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
  },
  version_hash: "vuix6c"
};
async function get_hooks() {
  let handle;
  let handleFetch;
  let handleError;
  let handleValidationError;
  let init2;
  let reroute;
  let transport;
  return {
    handle,
    handleFetch,
    handleError,
    handleValidationError,
    init: init2,
    reroute,
    transport
  };
}

// .svelte-kit/output/server/index.js
var import_cookie = __toESM(require_cookie(), 1);

// node_modules/set-cookie-parser/lib/set-cookie.js
var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false,
  split: "auto"
  // auto = split strings but not arrays
};
function isForbiddenKey(key2) {
  return typeof key2 !== "string" || key2 in {};
}
function createNullObj() {
  return /* @__PURE__ */ Object.create(null);
}
function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options2) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);
  var nameValuePairStr = parts.shift();
  var parsed = parseNameValuePair(nameValuePairStr);
  var name = parsed.name;
  var value = parsed.value;
  options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
  if (isForbiddenKey(name)) {
    return null;
  }
  try {
    value = options2.decodeValues ? decodeURIComponent(value) : value;
  } catch (e3) {
    console.error(
      "set-cookie-parser: failed to decode cookie value. Set options.decodeValues=false to disable decoding.",
      e3
    );
  }
  var cookie = createNullObj();
  cookie.name = name;
  cookie.value = value;
  parts.forEach(function(part) {
    var sides = part.split("=");
    var key2 = sides.shift().trimLeft().toLowerCase();
    if (isForbiddenKey(key2)) {
      return;
    }
    var value2 = sides.join("=");
    if (key2 === "expires") {
      cookie.expires = new Date(value2);
    } else if (key2 === "max-age") {
      var n2 = parseInt(value2, 10);
      if (!Number.isNaN(n2)) cookie.maxAge = n2;
    } else if (key2 === "secure") {
      cookie.secure = true;
    } else if (key2 === "httponly") {
      cookie.httpOnly = true;
    } else if (key2 === "samesite") {
      cookie.sameSite = value2;
    } else if (key2 === "partitioned") {
      cookie.partitioned = true;
    } else if (key2) {
      cookie[key2] = value2;
    }
  });
  return cookie;
}
function parseNameValuePair(nameValuePairStr) {
  var name = "";
  var value = "";
  var nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}
function parseSetCookie(input, options2) {
  options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
  if (!input) {
    if (!options2.map) {
      return [];
    } else {
      return createNullObj();
    }
  }
  if (input.headers) {
    if (typeof input.headers.getSetCookie === "function") {
      input = input.headers.getSetCookie();
    } else if (input.headers["set-cookie"]) {
      input = input.headers["set-cookie"];
    } else {
      var sch = input.headers[Object.keys(input.headers).find(function(key2) {
        return key2.toLowerCase() === "set-cookie";
      })];
      if (!sch && input.headers.cookie && !options2.silent) {
        console.warn(
          "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
        );
      }
      input = sch;
    }
  }
  var split = options2.split;
  var isArray = Array.isArray(input);
  if (split === "auto") {
    split = !isArray;
  }
  if (!isArray) {
    input = [input];
  }
  input = input.filter(isNonEmptyString);
  if (split) {
    input = input.map(splitCookiesString).flat();
  }
  if (!options2.map) {
    return input.map(function(str) {
      return parseString(str, options2);
    }).filter(Boolean);
  } else {
    var cookies = createNullObj();
    return input.reduce(function(cookies2, str) {
      var cookie = parseString(str, options2);
      if (cookie && !isForbiddenKey(cookie.name)) {
        cookies2[cookie.name] = cookie;
      }
      return cookies2;
    }, cookies);
  }
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
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
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
parseSetCookie.parseSetCookie = parseSetCookie;
parseSetCookie.parse = parseSetCookie;
parseSetCookie.parseString = parseString;
parseSetCookie.splitCookiesString = splitCookiesString;

// .svelte-kit/output/server/index.js
function with_resolvers() {
  let resolve2;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve2 = res;
    reject = rej;
  });
  return { promise, resolve: resolve2, reject };
}
var NULL_BODY_STATUS = [101, 103, 204, 205, 304];
var IN_WEBCONTAINER2 = !!globalThis.process?.versions?.webcontainer;
async function render_endpoint(event, event_state, mod, state) {
  const method = (
    /** @type {import('types').HttpMethod} */
    event.request.method
  );
  let handler = mod[method] || mod.fallback;
  if (method === "HEAD" && !mod.HEAD && mod.GET) {
    handler = mod.GET;
  }
  if (!handler) {
    return method_not_allowed(mod, method);
  }
  const prerender = mod.prerender ?? state.prerender_default;
  if (prerender && (mod.POST || mod.PATCH || mod.PUT || mod.DELETE)) {
    throw new Error("Cannot prerender endpoints that have mutative methods");
  }
  if (state.prerendering && !state.prerendering.inside_reroute && !prerender) {
    if (state.depth > 0) {
      throw new Error(`${event.route.id} is not prerenderable`);
    } else {
      return new Response(void 0, { status: 204 });
    }
  }
  try {
    event_state.allows_commands = true;
    const response = await with_request_store(
      { event, state: event_state },
      () => handler(
        /** @type {import('@sveltejs/kit').RequestEvent<Record<string, any>>} */
        event
      )
    );
    if (!(response instanceof Response)) {
      throw new Error(
        `Invalid response from route ${event.url.pathname}: handler should return a Response object`
      );
    }
    if (state.prerendering && (!state.prerendering.inside_reroute || prerender)) {
      const cloned = new Response(response.clone().body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers)
      });
      cloned.headers.set("x-sveltekit-prerender", String(prerender));
      if (state.prerendering.inside_reroute && prerender) {
        cloned.headers.set(
          "x-sveltekit-routeid",
          encodeURI(
            /** @type {string} */
            event.route.id
          )
        );
        state.prerendering.dependencies.set(event.url.pathname, { response: cloned, body: null });
      } else {
        return cloned;
      }
    }
    return response;
  } catch (e3) {
    if (e3 instanceof Redirect) {
      return new Response(void 0, {
        status: e3.status,
        headers: { location: e3.location }
      });
    }
    throw e3;
  }
}
function is_endpoint_request(event) {
  const { method, headers: headers2 } = event.request;
  if (ENDPOINT_METHODS.includes(method) && !PAGE_METHODS.includes(method)) {
    return true;
  }
  if (method === "POST" && headers2.get("x-sveltekit-action") === "true") return false;
  const accept = event.request.headers.get("accept") ?? "*/*";
  return negotiate(accept, ["*", "text/html"]) !== "text/html";
}
function compact(arr) {
  return arr.filter(
    /** @returns {val is NonNullable<T>} */
    (val) => val != null
  );
}
var DATA_SUFFIX = "/__data.json";
var HTML_DATA_SUFFIX = ".html__data.json";
function has_data_suffix2(pathname) {
  return pathname.endsWith(DATA_SUFFIX) || pathname.endsWith(HTML_DATA_SUFFIX);
}
function add_data_suffix2(pathname) {
  if (pathname.endsWith(".html")) return pathname.replace(/\.html$/, HTML_DATA_SUFFIX);
  return pathname.replace(/\/$/, "") + DATA_SUFFIX;
}
function strip_data_suffix2(pathname) {
  if (pathname.endsWith(HTML_DATA_SUFFIX)) {
    return pathname.slice(0, -HTML_DATA_SUFFIX.length) + ".html";
  }
  return pathname.slice(0, -DATA_SUFFIX.length);
}
var ROUTE_SUFFIX = "/__route.js";
function has_resolution_suffix2(pathname) {
  return pathname.endsWith(ROUTE_SUFFIX);
}
function add_resolution_suffix2(pathname) {
  return pathname.replace(/\/$/, "") + ROUTE_SUFFIX;
}
function strip_resolution_suffix2(pathname) {
  return pathname.slice(0, -ROUTE_SUFFIX.length);
}
var noop_span = {
  spanContext() {
    return noop_span_context;
  },
  setAttribute() {
    return this;
  },
  setAttributes() {
    return this;
  },
  addEvent() {
    return this;
  },
  setStatus() {
    return this;
  },
  updateName() {
    return this;
  },
  end() {
    return this;
  },
  isRecording() {
    return false;
  },
  recordException() {
    return this;
  },
  addLink() {
    return this;
  },
  addLinks() {
    return this;
  }
};
var noop_span_context = {
  traceId: "",
  spanId: "",
  traceFlags: 0
};
async function record_span({ name, attributes, fn }) {
  {
    return fn(noop_span);
  }
}
function is_action_json_request(event) {
  const accept = negotiate(event.request.headers.get("accept") ?? "*/*", [
    "application/json",
    "text/html"
  ]);
  return accept === "application/json" && event.request.method === "POST";
}
async function handle_action_json_request(event, event_state, options2, server2) {
  const actions = server2?.actions;
  if (!actions) {
    const no_actions_error = new SvelteKitError(
      405,
      "Method Not Allowed",
      `POST method not allowed. No form actions exist for ${"this page"}`
    );
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, event_state, options2, no_actions_error)
      },
      {
        status: no_actions_error.status,
        headers: {
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
          // "The server must generate an Allow header field in a 405 status code response"
          allow: "GET"
        }
      }
    );
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, event_state, actions);
    if (BROWSER) ;
    if (data instanceof ActionFailure) {
      return action_json({
        type: "failure",
        status: data.status,
        // @ts-expect-error we assign a string to what is supposed to be an object. That's ok
        // because we don't use the object outside, and this way we have better code navigation
        // through knowing where the related interface is used.
        data: stringify_action_response(
          data.data,
          /** @type {string} */
          event.route.id,
          options2.hooks.transport
        )
      });
    } else {
      return action_json({
        type: "success",
        status: data ? 200 : 204,
        // @ts-expect-error see comment above
        data: stringify_action_response(
          data,
          /** @type {string} */
          event.route.id,
          options2.hooks.transport
        )
      });
    }
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return action_json_redirect(err);
    }
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(
          event,
          event_state,
          options2,
          check_incorrect_fail_use(err)
        )
      },
      {
        status: get_status(err)
      }
    );
  }
}
function check_incorrect_fail_use(error2) {
  return error2 instanceof ActionFailure ? new Error('Cannot "throw fail()". Use "return fail()"') : error2;
}
function action_json_redirect(redirect) {
  return action_json({
    type: "redirect",
    status: redirect.status,
    location: redirect.location
  });
}
function action_json(data, init2) {
  return json(data, init2);
}
function is_action_request(event) {
  return event.request.method === "POST";
}
async function handle_action_request(event, event_state, server2) {
  const actions = server2?.actions;
  if (!actions) {
    event.setHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: "GET"
    });
    return {
      type: "error",
      error: new SvelteKitError(
        405,
        "Method Not Allowed",
        `POST method not allowed. No form actions exist for ${"this page"}`
      )
    };
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, event_state, actions);
    if (BROWSER) ;
    if (data instanceof ActionFailure) {
      return {
        type: "failure",
        status: data.status,
        data: data.data
      };
    } else {
      return {
        type: "success",
        status: 200,
        // @ts-expect-error this will be removed upon serialization, so `undefined` is the same as omission
        data
      };
    }
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return {
        type: "redirect",
        status: err.status,
        location: err.location
      };
    }
    return {
      type: "error",
      error: check_incorrect_fail_use(err)
    };
  }
}
function check_named_default_separate(actions) {
  if (actions.default && Object.keys(actions).length > 1) {
    throw new Error(
      "When using named actions, the default action cannot be used. See the docs for more info: https://svelte.dev/docs/kit/form-actions#named-actions"
    );
  }
}
async function call_action(event, event_state, actions) {
  const url = new URL(event.request.url);
  let name = "default";
  for (const param of url.searchParams) {
    if (param[0].startsWith("/")) {
      name = param[0].slice(1);
      if (name === "default") {
        throw new Error('Cannot use reserved action name "default"');
      }
      break;
    }
  }
  const action = actions[name];
  if (!action) {
    throw new SvelteKitError(404, "Not Found", `No action with name '${name}' found`);
  }
  if (!is_form_content_type(event.request)) {
    throw new SvelteKitError(
      415,
      "Unsupported Media Type",
      `Form actions expect form-encoded data \u2014 received ${event.request.headers.get(
        "content-type"
      )}`
    );
  }
  return record_span({
    name: "sveltekit.form_action",
    attributes: {
      "http.route": event.route.id || "unknown"
    },
    fn: async (current2) => {
      const traced_event = merge_tracing(event, current2);
      event_state.allows_commands = true;
      const result = await with_request_store(
        { event: traced_event, state: event_state },
        () => action(traced_event)
      );
      if (result instanceof ActionFailure) {
        current2.setAttributes({
          "sveltekit.form_action.result.type": "failure",
          "sveltekit.form_action.result.status": result.status
        });
      }
      return result;
    }
  });
}
function uneval_action_response(data, route_id, transport) {
  const replacer = (thing) => {
    for (const key2 in transport) {
      const encoded = transport[key2].encode(thing);
      if (encoded) {
        return `app.decode('${key2}', ${uneval(encoded, replacer)})`;
      }
    }
  };
  return try_serialize(data, (value) => uneval(value, replacer), route_id);
}
function stringify_action_response(data, route_id, transport) {
  const encoders = Object.fromEntries(
    Object.entries(transport).map(([key2, value]) => [key2, value.encode])
  );
  return try_serialize(data, (value) => stringify(value, encoders), route_id);
}
function try_serialize(data, fn, route_id) {
  try {
    return fn(data);
  } catch (e3) {
    const error2 = (
      /** @type {any} */
      e3
    );
    if (data instanceof Response) {
      throw new Error(
        `Data returned from action inside ${route_id} is not serializable. Form actions need to return plain objects or fail(). E.g. return { success: true } or return fail(400, { message: "invalid" });`,
        { cause: e3 }
      );
    }
    if ("path" in error2) {
      let message = `Data returned from action inside ${route_id} is not serializable: ${error2.message}`;
      if (error2.path !== "") message += ` (data.${error2.path})`;
      throw new Error(message, { cause: e3 });
    }
    throw error2;
  }
}
function create_async_iterator() {
  let resolved = -1;
  let returned = -1;
  const deferred = [];
  return {
    iterate: (transform = (x) => x) => {
      return {
        [Symbol.asyncIterator]() {
          return {
            next: async () => {
              const next = deferred[++returned];
              if (!next) return { value: null, done: true };
              const value = await next.promise;
              return { value: transform(value), done: false };
            }
          };
        }
      };
    },
    add: (promise) => {
      deferred.push(with_resolvers());
      void promise.then((value) => {
        deferred[++resolved].resolve(value);
      });
    }
  };
}
function server_data_serializer(event, event_state, options2) {
  let promise_id = 1;
  let max_nodes = -1;
  const iterator = create_async_iterator();
  const global = get_global_name(options2);
  function get_replacer(index9) {
    return function replacer(thing) {
      if (typeof thing?.then === "function") {
        const id = promise_id++;
        const promise = thing.then(
          /** @param {any} data */
          (data) => ({ data })
        ).catch(
          /** @param {any} error */
          async (error2) => ({
            error: await handle_error_and_jsonify(event, event_state, options2, error2)
          })
        ).then(
          /**
           * @param {{data: any; error: any}} result
           */
          async ({ data, error: error2 }) => {
            let str;
            try {
              str = uneval(error2 ? [, error2] : [data], replacer);
            } catch {
              error2 = await handle_error_and_jsonify(
                event,
                event_state,
                options2,
                new Error(`Failed to serialize promise while rendering ${event.route.id}`)
              );
              str = uneval([, error2], replacer);
            }
            return {
              index: index9,
              str: `${global}.resolve(${id}, ${str.includes("app.decode") ? `(app) => ${str}` : `() => ${str}`})`
            };
          }
        );
        iterator.add(promise);
        return `${global}.defer(${id})`;
      } else {
        for (const key2 in options2.hooks.transport) {
          const encoded = options2.hooks.transport[key2].encode(thing);
          if (encoded) {
            return `app.decode('${key2}', ${uneval(encoded, replacer)})`;
          }
        }
      }
    };
  }
  const strings = (
    /** @type {string[]} */
    []
  );
  return {
    set_max_nodes(i) {
      max_nodes = i;
    },
    add_node(i, node) {
      try {
        if (!node) {
          strings[i] = "null";
          return;
        }
        const payload = { type: "data", data: node.data, uses: serialize_uses(node) };
        if (node.slash) payload.slash = node.slash;
        strings[i] = uneval(payload, get_replacer(i));
      } catch (e3) {
        e3.path = e3.path.slice(1);
        throw new Error(clarify_devalue_error(
          event,
          /** @type {any} */
          e3
        ), { cause: e3 });
      }
    },
    get_data(csp) {
      const open = `<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>`;
      const close = `<\/script>
`;
      return {
        data: `[${compact(max_nodes > -1 ? strings.slice(0, max_nodes) : strings).join(",")}]`,
        chunks: promise_id > 1 ? iterator.iterate(({ index: index9, str }) => {
          if (max_nodes > -1 && index9 >= max_nodes) {
            return "";
          }
          return open + str + close;
        }) : null
      };
    }
  };
}
function server_data_serializer_json(event, event_state, options2) {
  let promise_id = 1;
  const iterator = create_async_iterator();
  const reducers = {
    ...Object.fromEntries(
      Object.entries(options2.hooks.transport).map(([key2, value]) => [key2, value.encode])
    ),
    /** @param {any} thing */
    Promise: (thing) => {
      if (typeof thing?.then !== "function") {
        return;
      }
      const id = promise_id++;
      let key2 = "data";
      const promise = thing.catch(
        /** @param {any} e */
        async (e3) => {
          key2 = "error";
          return handle_error_and_jsonify(
            event,
            event_state,
            options2,
            /** @type {any} */
            e3
          );
        }
      ).then(
        /** @param {any} value */
        async (value) => {
          let str;
          try {
            str = stringify(value, reducers);
          } catch {
            const error2 = await handle_error_and_jsonify(
              event,
              event_state,
              options2,
              new Error(`Failed to serialize promise while rendering ${event.route.id}`)
            );
            key2 = "error";
            str = stringify(error2, reducers);
          }
          return `{"type":"chunk","id":${id},"${key2}":${str}}
`;
        }
      );
      iterator.add(promise);
      return id;
    }
  };
  const strings = (
    /** @type {string[]} */
    []
  );
  return {
    add_node(i, node) {
      try {
        if (!node) {
          strings[i] = "null";
          return;
        }
        if (node.type === "error" || node.type === "skip") {
          strings[i] = JSON.stringify(node);
          return;
        }
        strings[i] = `{"type":"data","data":${stringify(node.data, reducers)},"uses":${JSON.stringify(
          serialize_uses(node)
        )}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
      } catch (e3) {
        e3.path = "data" + e3.path;
        throw new Error(clarify_devalue_error(
          event,
          /** @type {any} */
          e3
        ), { cause: e3 });
      }
    },
    get_data() {
      return {
        data: `{"type":"data","nodes":[${strings.join(",")}]}
`,
        chunks: promise_id > 1 ? iterator.iterate() : null
      };
    }
  };
}
async function load_server_data({ event, event_state, state, node, parent }) {
  if (!node?.server) return null;
  let is_tracking = true;
  const uses = {
    dependencies: /* @__PURE__ */ new Set(),
    params: /* @__PURE__ */ new Set(),
    parent: false,
    route: false,
    url: false,
    search_params: /* @__PURE__ */ new Set()
  };
  const load = node.server.load;
  const slash = node.server.trailingSlash;
  if (!load) {
    return { type: "data", data: null, uses, slash };
  }
  const url = make_trackable(
    event.url,
    () => {
      if (is_tracking) {
        uses.url = true;
      }
    },
    (param) => {
      if (is_tracking) {
        uses.search_params.add(param);
      }
    }
  );
  if (state.prerendering) {
    disable_search(url);
  }
  const result = await record_span({
    name: "sveltekit.load",
    attributes: {
      "sveltekit.load.node_id": node.server_id || "unknown",
      "sveltekit.load.node_type": get_node_type(node.server_id),
      "http.route": event.route.id || "unknown"
    },
    fn: async (current2) => {
      const traced_event = merge_tracing(event, current2);
      const result2 = await with_request_store(
        { event: traced_event, state: event_state },
        () => load.call(null, {
          ...traced_event,
          fetch: (info, init2) => {
            new URL(info instanceof Request ? info.url : info, event.url);
            return event.fetch(info, init2);
          },
          /** @param {string[]} deps */
          depends: (...deps) => {
            for (const dep of deps) {
              const { href } = new URL(dep, event.url);
              uses.dependencies.add(href);
            }
          },
          params: new Proxy(event.params, {
            get: (target, key2) => {
              if (is_tracking) {
                uses.params.add(key2);
              }
              return target[
                /** @type {string} */
                key2
              ];
            }
          }),
          parent: async () => {
            if (is_tracking) {
              uses.parent = true;
            }
            return parent();
          },
          route: new Proxy(event.route, {
            get: (target, key2) => {
              if (is_tracking) {
                uses.route = true;
              }
              return target[
                /** @type {'id'} */
                key2
              ];
            }
          }),
          url,
          untrack(fn) {
            is_tracking = false;
            try {
              return fn();
            } finally {
              is_tracking = true;
            }
          }
        })
      );
      return result2;
    }
  });
  return {
    type: "data",
    data: result ?? null,
    uses,
    slash
  };
}
async function load_data({
  event,
  event_state,
  fetched,
  node,
  parent,
  server_data_promise,
  state,
  resolve_opts,
  csr
}) {
  const server_data_node = await server_data_promise;
  const load = node?.universal?.load;
  if (!load) {
    return server_data_node?.data ?? null;
  }
  const result = await record_span({
    name: "sveltekit.load",
    attributes: {
      "sveltekit.load.node_id": node.universal_id || "unknown",
      "sveltekit.load.node_type": get_node_type(node.universal_id),
      "http.route": event.route.id || "unknown"
    },
    fn: async (current2) => {
      const traced_event = merge_tracing(event, current2);
      return await with_request_store(
        { event: traced_event, state: event_state },
        () => load.call(null, {
          url: event.url,
          params: event.params,
          data: server_data_node?.data ?? null,
          route: event.route,
          fetch: create_universal_fetch(event, state, fetched, csr, resolve_opts),
          setHeaders: event.setHeaders,
          depends: () => {
          },
          parent,
          untrack: (fn) => fn(),
          tracing: traced_event.tracing
        })
      );
    }
  });
  return result ?? null;
}
function create_universal_fetch(event, state, fetched, csr, resolve_opts) {
  const universal_fetch = async (input, init2) => {
    const cloned_body = input instanceof Request && input.body ? input.clone().body : null;
    const cloned_headers = input instanceof Request && [...input.headers].length ? new Headers(input.headers) : init2?.headers;
    let response = await event.fetch(input, init2);
    const url = new URL(input instanceof Request ? input.url : input, event.url);
    const same_origin = url.origin === event.url.origin;
    let dependency;
    if (same_origin) {
      if (state.prerendering) {
        dependency = { response, body: null };
        state.prerendering.dependencies.set(url.pathname, dependency);
      }
    } else if (url.protocol === "https:" || url.protocol === "http:") {
      const mode = input instanceof Request ? input.mode : init2?.mode ?? "cors";
      if (mode === "no-cors") {
        response = new Response("", {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } else {
        const acao = response.headers.get("access-control-allow-origin");
        if (!acao || acao !== event.url.origin && acao !== "*") {
          throw new Error(
            `CORS error: ${acao ? "Incorrect" : "No"} 'Access-Control-Allow-Origin' header is present on the requested resource`
          );
        }
      }
    }
    let teed_body;
    const proxy = new Proxy(response, {
      get(response2, key2, receiver) {
        async function push_fetched(body2, is_b64) {
          const status_number = Number(response2.status);
          if (isNaN(status_number)) {
            throw new Error(
              `response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`
            );
          }
          fetched.push({
            url: same_origin ? url.href.slice(event.url.origin.length) : url.href,
            method: event.request.method,
            request_body: (
              /** @type {string | ArrayBufferView | undefined} */
              input instanceof Request && cloned_body ? await stream_to_string(cloned_body) : init2?.body
            ),
            request_headers: cloned_headers,
            response_body: body2,
            response: response2,
            is_b64
          });
        }
        if (key2 === "body") {
          if (response2.body === null) {
            return null;
          }
          if (teed_body) {
            return teed_body;
          }
          const [a, b] = response2.body.tee();
          void (async () => {
            let result = new Uint8Array();
            for await (const chunk of a) {
              const combined = new Uint8Array(result.length + chunk.length);
              combined.set(result, 0);
              combined.set(chunk, result.length);
              result = combined;
            }
            if (dependency) {
              dependency.body = new Uint8Array(result);
            }
            void push_fetched(base64_encode(result), true);
          })();
          return teed_body = b;
        }
        if (key2 === "arrayBuffer") {
          return async () => {
            const buffer = await response2.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            if (dependency) {
              dependency.body = bytes;
            }
            if (buffer instanceof ArrayBuffer) {
              await push_fetched(base64_encode(bytes), true);
            }
            return buffer;
          };
        }
        async function text2() {
          const body2 = await response2.text();
          if (body2 === "" && NULL_BODY_STATUS.includes(response2.status)) {
            await push_fetched(void 0, false);
            return void 0;
          }
          if (!body2 || typeof body2 === "string") {
            await push_fetched(body2, false);
          }
          if (dependency) {
            dependency.body = body2;
          }
          return body2;
        }
        if (key2 === "text") {
          return text2;
        }
        if (key2 === "json") {
          return async () => {
            const body2 = await text2();
            return body2 ? JSON.parse(body2) : void 0;
          };
        }
        const value = Reflect.get(response2, key2, response2);
        if (value instanceof Function) {
          return Object.defineProperties(
            /**
             * @this {any}
             */
            function() {
              return Reflect.apply(value, this === receiver ? response2 : this, arguments);
            },
            {
              name: { value: value.name },
              length: { value: value.length }
            }
          );
        }
        return value;
      }
    });
    if (csr) {
      const get = response.headers.get;
      response.headers.get = (key2) => {
        const lower = key2.toLowerCase();
        const value = get.call(response.headers, lower);
        if (value && !lower.startsWith("x-sveltekit-")) {
          const included = resolve_opts.filterSerializedResponseHeaders(lower, value);
          if (!included) {
            throw new Error(
              `Failed to get response header "${lower}" \u2014 it must be included by the \`filterSerializedResponseHeaders\` option: https://svelte.dev/docs/kit/hooks#Server-hooks-handle (at ${event.route.id})`
            );
          }
        }
        return value;
      };
    }
    return proxy;
  };
  return (input, init2) => {
    const response = universal_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
async function stream_to_string(stream) {
  let result = "";
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += text_decoder2.decode(value);
  }
  return result;
}
function hash(...values) {
  let hash2 = 5381;
  for (const value of values) {
    if (typeof value === "string") {
      let i = value.length;
      while (i) hash2 = hash2 * 33 ^ value.charCodeAt(--i);
    } else if (ArrayBuffer.isView(value)) {
      const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      let i = buffer.length;
      while (i) hash2 = hash2 * 33 ^ buffer[--i];
    } else {
      throw new TypeError("value must be a string or TypedArray");
    }
  }
  return (hash2 >>> 0).toString(36);
}
var replacements = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var pattern = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");
function serialize_data(fetched, filter, prerendering = false) {
  const headers2 = {};
  let cache_control = null;
  let age = null;
  let varyAny = false;
  for (const [key2, value] of fetched.response.headers) {
    if (filter(key2, value)) {
      headers2[key2] = value;
    }
    if (key2 === "cache-control") cache_control = value;
    else if (key2 === "age") age = value;
    else if (key2 === "vary" && value.trim() === "*") varyAny = true;
  }
  const payload = {
    status: fetched.response.status,
    statusText: fetched.response.statusText,
    headers: headers2,
    body: fetched.response_body
  };
  const safe_payload = JSON.stringify(payload).replace(pattern, (match) => replacements[match]);
  const attrs = [
    'type="application/json"',
    "data-sveltekit-fetched",
    `data-url="${escape_html(fetched.url, true)}"`
  ];
  if (fetched.is_b64) {
    attrs.push("data-b64");
  }
  if (fetched.request_headers || fetched.request_body) {
    const values = [];
    if (fetched.request_headers) {
      values.push([...new Headers(fetched.request_headers)].join(","));
    }
    if (fetched.request_body) {
      values.push(fetched.request_body);
    }
    attrs.push(`data-hash="${hash(...values)}"`);
  }
  if (!prerendering && fetched.method === "GET" && cache_control && !varyAny) {
    const match = /s-maxage=(\d+)/g.exec(cache_control) ?? /max-age=(\d+)/g.exec(cache_control);
    if (match) {
      const ttl = +match[1] - +(age ?? "0");
      attrs.push(`data-ttl="${ttl}"`);
    }
  }
  return `<script ${attrs.join(" ")}>${safe_payload}<\/script>`;
}
var s = JSON.stringify;
function sha256(data) {
  if (!key[0]) precompute();
  const out = init.slice(0);
  const array2 = encode(data);
  for (let i = 0; i < array2.length; i += 16) {
    const w = array2.subarray(i, i + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i2 = 0; i2 < 64; i2++) {
      if (i2 < 16) {
        tmp = w[i2];
      } else {
        a = w[i2 + 1 & 15];
        b = w[i2 + 14 & 15];
        tmp = w[i2 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i2 & 15] + w[i2 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i2];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return btoa(String.fromCharCode(...bytes));
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x) {
    return (x - Math.floor(x)) * 4294967296;
  }
  let prime = 2;
  for (let i = 0; i < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i < 8) {
        init[i] = frac(prime ** (1 / 2));
      }
      key[i] = frac(prime ** (1 / 3));
      i++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i = 0; i < bytes.length; i += 4) {
    const a = bytes[i + 0];
    const b = bytes[i + 1];
    const c2 = bytes[i + 2];
    const d = bytes[i + 3];
    bytes[i + 0] = d;
    bytes[i + 1] = c2;
    bytes[i + 2] = b;
    bytes[i + 3] = a;
  }
}
function encode(str) {
  const encoded = text_encoder2.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
var array = new Uint8Array(16);
function generate_nonce() {
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample",
  "wasm-unsafe-eval",
  "script"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var BaseProvider = class {
  /** @type {boolean} */
  #use_hashes;
  /** @type {boolean} */
  #script_needs_csp;
  /** @type {boolean} */
  #script_src_needs_csp;
  /** @type {boolean} */
  #script_src_elem_needs_csp;
  /** @type {boolean} */
  #style_needs_csp;
  /** @type {boolean} */
  #style_src_needs_csp;
  /** @type {boolean} */
  #style_src_attr_needs_csp;
  /** @type {boolean} */
  #style_src_elem_needs_csp;
  /** @type {import('types').CspDirectives} */
  #directives;
  /** @type {Set<import('types').Csp.Source>} */
  #script_src;
  /** @type {Set<import('types').Csp.Source>} */
  #script_src_elem;
  /** @type {Set<import('types').Csp.Source>} */
  #style_src;
  /** @type {Set<import('types').Csp.Source>} */
  #style_src_attr;
  /** @type {Set<import('types').Csp.Source>} */
  #style_src_elem;
  /** @type {boolean} */
  script_needs_nonce;
  /** @type {boolean} */
  style_needs_nonce;
  /** @type {boolean} */
  script_needs_hash;
  /** @type {string} */
  #nonce;
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    this.#use_hashes = use_hashes;
    this.#directives = directives;
    const d = this.#directives;
    this.#script_src = /* @__PURE__ */ new Set();
    this.#script_src_elem = /* @__PURE__ */ new Set();
    this.#style_src = /* @__PURE__ */ new Set();
    this.#style_src_attr = /* @__PURE__ */ new Set();
    this.#style_src_elem = /* @__PURE__ */ new Set();
    const effective_script_src = d["script-src"] || d["default-src"];
    const script_src_elem = d["script-src-elem"];
    const effective_style_src = d["style-src"] || d["default-src"];
    const style_src_attr = d["style-src-attr"];
    const style_src_elem = d["style-src-elem"];
    const style_needs_csp = (directive) => !!directive && !directive.some((value) => value === "unsafe-inline");
    const script_needs_csp = (directive) => !!directive && (!directive.some((value) => value === "unsafe-inline") || directive.some((value) => value === "strict-dynamic"));
    this.#script_src_needs_csp = script_needs_csp(effective_script_src);
    this.#script_src_elem_needs_csp = script_needs_csp(script_src_elem);
    this.#style_src_needs_csp = style_needs_csp(effective_style_src);
    this.#style_src_attr_needs_csp = style_needs_csp(style_src_attr);
    this.#style_src_elem_needs_csp = style_needs_csp(style_src_elem);
    this.#script_needs_csp = this.#script_src_needs_csp || this.#script_src_elem_needs_csp;
    this.#style_needs_csp = this.#style_src_needs_csp || this.#style_src_attr_needs_csp || this.#style_src_elem_needs_csp;
    this.script_needs_nonce = this.#script_needs_csp && !this.#use_hashes;
    this.style_needs_nonce = this.#style_needs_csp && !this.#use_hashes;
    this.script_needs_hash = this.#script_needs_csp && this.#use_hashes;
    this.#nonce = nonce;
  }
  /** @param {string} content */
  add_script(content) {
    if (!this.#script_needs_csp) return;
    const source = this.#use_hashes ? `sha256-${sha256(content)}` : `nonce-${this.#nonce}`;
    if (this.#script_src_needs_csp) {
      this.#script_src.add(source);
    }
    if (this.#script_src_elem_needs_csp) {
      this.#script_src_elem.add(source);
    }
  }
  /** @param {`sha256-${string}`[]} hashes */
  add_script_hashes(hashes) {
    for (const hash2 of hashes) {
      if (this.#script_src_needs_csp) {
        this.#script_src.add(hash2);
      }
      if (this.#script_src_elem_needs_csp) {
        this.#script_src_elem.add(hash2);
      }
    }
  }
  /** @param {string} content */
  add_style(content) {
    if (!this.#style_needs_csp) return;
    const source = this.#use_hashes ? `sha256-${sha256(content)}` : `nonce-${this.#nonce}`;
    if (this.#style_src_needs_csp) {
      this.#style_src.add(source);
    }
    if (this.#style_src_attr_needs_csp) {
      this.#style_src_attr.add(source);
    }
    if (this.#style_src_elem_needs_csp) {
      const sha256_empty_comment_hash = "sha256-9OlNO0DNEeaVzHL4RZwCLsBHA8WBQ8toBp/4F5XV2nc=";
      const d = this.#directives;
      if (d["style-src-elem"] && !d["style-src-elem"].includes(sha256_empty_comment_hash) && !this.#style_src_elem.has(sha256_empty_comment_hash)) {
        this.#style_src_elem.add(sha256_empty_comment_hash);
      }
      if (source !== sha256_empty_comment_hash) {
        this.#style_src_elem.add(source);
      }
    }
  }
  /**
   * @param {boolean} [is_meta]
   */
  get_header(is_meta = false) {
    const header = [];
    const directives = { ...this.#directives };
    if (this.#style_src.size > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...this.#style_src
      ];
    }
    if (this.#style_src_attr.size > 0) {
      directives["style-src-attr"] = [
        ...directives["style-src-attr"] || [],
        ...this.#style_src_attr
      ];
    }
    if (this.#style_src_elem.size > 0) {
      directives["style-src-elem"] = [
        ...directives["style-src-elem"] || [],
        ...this.#style_src_elem
      ];
    }
    if (this.#script_src.size > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...this.#script_src
      ];
    }
    if (this.#script_src_elem.size > 0) {
      directives["script-src-elem"] = [
        ...directives["script-src-elem"] || [],
        ...this.#script_src_elem
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = (
        /** @type {string[] | true} */
        directives[key2]
      );
      if (!value) continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
};
var CspProvider = class extends BaseProvider {
  get_meta() {
    const content = this.get_header(true);
    if (!content) {
      return;
    }
    return `<meta http-equiv="content-security-policy" content="${escape_html(content, true)}">`;
  }
};
var CspReportOnlyProvider = class extends BaseProvider {
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    super(use_hashes, directives, nonce);
    if (Object.values(directives).filter((v) => !!v).length > 0) {
      const has_report_to = directives["report-to"]?.length ?? 0 > 0;
      const has_report_uri = directives["report-uri"]?.length ?? 0 > 0;
      if (!has_report_to && !has_report_uri) {
        throw Error(
          "`content-security-policy-report-only` must be specified with either the `report-to` or `report-uri` directives, or both"
        );
      }
    }
  }
};
var Csp = class {
  /** @readonly */
  nonce = generate_nonce();
  /** @type {CspProvider} */
  csp_provider;
  /** @type {CspReportOnlyProvider} */
  report_only_provider;
  /**
   * @param {import('./types.js').CspConfig} config
   * @param {import('./types.js').CspOpts} opts
   */
  constructor({ mode, directives, reportOnly }, { prerender }) {
    const use_hashes = mode === "hash" || mode === "auto" && prerender;
    this.csp_provider = new CspProvider(use_hashes, directives, this.nonce);
    this.report_only_provider = new CspReportOnlyProvider(use_hashes, reportOnly, this.nonce);
  }
  get script_needs_hash() {
    return this.csp_provider.script_needs_hash || this.report_only_provider.script_needs_hash;
  }
  get script_needs_nonce() {
    return this.csp_provider.script_needs_nonce || this.report_only_provider.script_needs_nonce;
  }
  get style_needs_nonce() {
    return this.csp_provider.style_needs_nonce || this.report_only_provider.style_needs_nonce;
  }
  /** @param {string} content */
  add_script(content) {
    this.csp_provider.add_script(content);
    this.report_only_provider.add_script(content);
  }
  /** @param {`sha256-${string}`[]} hashes */
  add_script_hashes(hashes) {
    this.csp_provider.add_script_hashes(hashes);
    this.report_only_provider.add_script_hashes(hashes);
  }
  /** @param {string} content */
  add_style(content) {
    this.csp_provider.add_style(content);
    this.report_only_provider.add_style(content);
  }
};
function exec(match, params, matchers) {
  const result = {};
  const values = match.slice(1);
  const values_needing_match = values.filter((value) => value !== void 0);
  let buffered = 0;
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    let value = values[i - buffered];
    if (param.chained && param.rest && buffered) {
      value = values.slice(i - buffered, i + 1).filter((s22) => s22).join("/");
      buffered = 0;
    }
    if (value === void 0) {
      if (param.rest) {
        value = "";
      } else {
        continue;
      }
    }
    if (!param.matcher || matchers[param.matcher](value)) {
      result[param.name] = value;
      const next_param = params[i + 1];
      const next_value = values[i + 1];
      if (next_param && !next_param.rest && next_param.optional && next_value && param.chained) {
        buffered = 0;
      }
      if (!next_param && !next_value && Object.keys(result).length === values_needing_match.length) {
        buffered = 0;
      }
      continue;
    }
    if (param.optional && param.chained) {
      buffered++;
      continue;
    }
    return;
  }
  if (buffered) return;
  return result;
}
function find_route(path, routes, matchers) {
  for (const route of routes) {
    const match = route.pattern.exec(path);
    if (!match) continue;
    const matched = exec(match, route.params, matchers);
    if (matched) {
      return {
        route,
        params: decode_params(matched)
      };
    }
  }
  return null;
}
function generate_route_object(route, url, manifest2) {
  const { errors, layouts, leaf } = route;
  const nodes = [...errors, ...layouts.map((l) => l?.[1]), leaf[1]].filter((n2) => typeof n2 === "number").map((n2) => `'${n2}': () => ${create_client_import(manifest2._.client.nodes?.[n2], url)}`).join(",\n		");
  return [
    `{
	id: ${s(route.id)}`,
    `errors: ${s(route.errors)}`,
    `layouts: ${s(route.layouts)}`,
    `leaf: ${s(route.leaf)}`,
    `nodes: {
		${nodes}
	}
}`
  ].join(",\n	");
}
function create_client_import(import_path, url) {
  if (!import_path) return "Promise.resolve({})";
  if (import_path[0] === "/") {
    return `import('${import_path}')`;
  }
  if (assets !== "") {
    return `import('${assets}/${import_path}')`;
  }
  let path = get_relative_path(url.pathname, `${base}/${import_path}`);
  if (path[0] !== ".") path = `./${path}`;
  return `import('${path}')`;
}
async function resolve_route(resolved_path, url, manifest2) {
  if (!manifest2._.client.routes) {
    return text("Server-side route resolution disabled", { status: 400 });
  }
  const matchers = await manifest2._.matchers();
  const result = find_route(resolved_path, manifest2._.client.routes, matchers);
  return create_server_routing_response(result?.route ?? null, result?.params ?? {}, url, manifest2).response;
}
function create_server_routing_response(route, params, url, manifest2) {
  const headers2 = new Headers({
    "content-type": "application/javascript; charset=utf-8"
  });
  if (route) {
    const csr_route = generate_route_object(route, url, manifest2);
    const body2 = `${create_css_import(route, url, manifest2)}
export const route = ${csr_route}; export const params = ${JSON.stringify(params)};`;
    return { response: text(body2, { headers: headers2 }), body: body2 };
  } else {
    return { response: text("", { headers: headers2 }), body: "" };
  }
}
function create_css_import(route, url, manifest2) {
  const { errors, layouts, leaf } = route;
  let css4 = "";
  for (const node of [...errors, ...layouts.map((l) => l?.[1]), leaf[1]]) {
    if (typeof node !== "number") continue;
    const node_css = manifest2._.client.css?.[node];
    for (const css_path of node_css ?? []) {
      css4 += `'${assets || base}/${css_path}',`;
    }
  }
  if (!css4) return "";
  return `${create_client_import(
    /** @type {string} */
    manifest2._.client.start,
    url
  )}.then(x => x.load_css([${css4}]));`;
}
var updated = {
  ...readable(false),
  check: () => false
};
async function render_response({
  branch,
  fetched,
  options: options2,
  manifest: manifest2,
  state,
  page_config,
  status,
  error: error2 = null,
  event,
  event_state,
  resolve_opts,
  action_result,
  data_serializer
}) {
  if (state.prerendering) {
    if (options2.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options2.app_template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
    }
  }
  const { client } = manifest2._;
  const modulepreloads = new Set(client.imports);
  const stylesheets9 = new Set(client.stylesheets);
  const fonts9 = new Set(client.fonts);
  const link_headers = /* @__PURE__ */ new Set();
  const inline_styles = /* @__PURE__ */ new Map();
  let rendered;
  const form_value = action_result?.type === "success" || action_result?.type === "failure" ? action_result.data ?? null : null;
  let base$1 = base;
  let assets$1 = assets;
  let base_expression = s(base);
  const csp = new Csp(options2.csp, {
    prerender: !!state.prerendering
  });
  {
    if (!state.prerendering?.fallback) {
      const segments = event.url.pathname.slice(base.length).split("/").slice(2);
      base$1 = segments.map(() => "..").join("/") || ".";
      base_expression = `new URL(${s(base$1)}, location).pathname.slice(0, -1)`;
      if (!assets || assets[0] === "/" && assets !== SVELTE_KIT_ASSETS) {
        assets$1 = base$1;
      }
    } else if (options2.hash_routing) {
      base_expression = "new URL('.', location).pathname.slice(0, -1)";
    }
  }
  if (page_config.ssr) {
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        updated
      },
      constructors: await Promise.all(
        branch.map(({ node }) => {
          if (!node.component) {
            throw new Error(`Missing +page.svelte component for route ${event.route.id}`);
          }
          return node.component();
        })
      ),
      form: form_value
    };
    let data2 = {};
    for (let i = 0; i < branch.length; i += 1) {
      data2 = { ...data2, ...branch[i].data };
      props[`data_${i}`] = data2;
    }
    props.page = {
      error: error2,
      params: (
        /** @type {Record<string, any>} */
        event.params
      ),
      route: event.route,
      status,
      url: event.url,
      data: data2,
      form: form_value,
      state: {}
    };
    const render_opts = {
      context: /* @__PURE__ */ new Map([
        [
          "__request__",
          {
            page: props.page
          }
        ]
      ]),
      csp: csp.script_needs_nonce ? { nonce: csp.nonce } : { hash: csp.script_needs_hash }
    };
    const fetch2 = globalThis.fetch;
    try {
      if (BROWSER) ;
      event_state.allows_commands = false;
      rendered = await with_request_store({ event, state: event_state }, async () => {
        if (relative) override({ base: base$1, assets: assets$1 });
        const maybe_promise = options2.root.render(props, render_opts);
        const rendered2 = options2.async && "then" in maybe_promise ? (
          /** @type {ReturnType<typeof options.root.render> & Promise<any>} */
          maybe_promise.then((r3) => r3)
        ) : maybe_promise;
        if (options2.async) {
          reset();
        }
        const { head: head2, html: html2, css: css4, hashes } = (
          /** @type {ReturnType<typeof options.root.render>} */
          options2.async ? await rendered2 : rendered2
        );
        if (hashes) {
          csp.add_script_hashes(hashes.script);
        }
        return { head: head2, html: html2, css: css4, hashes };
      });
    } finally {
      reset();
    }
    for (const { node } of branch) {
      for (const url of node.imports) modulepreloads.add(url);
      for (const url of node.stylesheets) stylesheets9.add(url);
      for (const url of node.fonts) fonts9.add(url);
      if (node.inline_styles && !client.inline) {
        Object.entries(await node.inline_styles()).forEach(([filename, css4]) => {
          if (typeof css4 === "string") {
            inline_styles.set(filename, css4);
            return;
          }
          inline_styles.set(filename, css4(`${assets$1}/${app_dir}/immutable/assets`, assets$1));
        });
      }
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null }, hashes: { script: [] } };
  }
  const head = new Head(rendered.head, !!state.prerendering);
  let body2 = rendered.html;
  const prefixed = (path) => {
    if (path.startsWith("/")) {
      return base + path;
    }
    return `${assets$1}/${path}`;
  };
  const style = client.inline ? client.inline?.style : Array.from(inline_styles.values()).join("\n");
  if (style) {
    const attributes = [];
    if (csp.style_needs_nonce) attributes.push(`nonce="${csp.nonce}"`);
    csp.add_style(style);
    head.add_style(style, attributes);
  }
  for (const dep of stylesheets9) {
    const path = prefixed(dep);
    const attributes = ['rel="stylesheet"'];
    if (inline_styles.has(dep)) {
      attributes.push("disabled", 'media="(max-width: 0)"');
    } else {
      if (resolve_opts.preload({ type: "css", path })) {
        link_headers.add(`<${encodeURI(path)}>; rel="preload"; as="style"; nopush`);
      }
    }
    head.add_stylesheet(path, attributes);
  }
  for (const dep of fonts9) {
    const path = prefixed(dep);
    if (resolve_opts.preload({ type: "font", path })) {
      const ext = dep.slice(dep.lastIndexOf(".") + 1);
      head.add_link_tag(path, ['rel="preload"', 'as="font"', `type="font/${ext}"`, "crossorigin"]);
      link_headers.add(
        `<${encodeURI(path)}>; rel="preload"; as="font"; type="font/${ext}"; crossorigin; nopush`
      );
    }
  }
  const global = get_global_name(options2);
  const { data, chunks } = data_serializer.get_data(csp);
  if (page_config.ssr && page_config.csr) {
    body2 += `
			${fetched.map(
      (item) => serialize_data(item, resolve_opts.filterSerializedResponseHeaders, !!state.prerendering)
    ).join("\n			")}`;
  }
  if (page_config.csr) {
    const route = manifest2._.client.routes?.find((r3) => r3.id === event.route.id) ?? null;
    if (client.uses_env_dynamic_public && state.prerendering) {
      modulepreloads.add(`${app_dir}/env.js`);
    }
    if (!client.inline) {
      const included_modulepreloads = Array.from(modulepreloads, (dep) => prefixed(dep)).filter(
        (path) => resolve_opts.preload({ type: "js", path })
      );
      for (const path of included_modulepreloads) {
        link_headers.add(`<${encodeURI(path)}>; rel="modulepreload"; nopush`);
        if (options2.preload_strategy !== "modulepreload") {
          head.add_script_preload(path);
        } else {
          head.add_link_tag(path, ['rel="modulepreload"']);
        }
      }
    }
    if (manifest2._.client.routes && state.prerendering && !state.prerendering.fallback) {
      const pathname = add_resolution_suffix2(event.url.pathname);
      state.prerendering.dependencies.set(
        pathname,
        create_server_routing_response(route, event.params, new URL(pathname, event.url), manifest2)
      );
    }
    const blocks = [];
    const load_env_eagerly = client.uses_env_dynamic_public && state.prerendering;
    const properties = [`base: ${base_expression}`];
    if (assets) {
      properties.push(`assets: ${s(assets)}`);
    }
    if (client.uses_env_dynamic_public) {
      properties.push(`env: ${load_env_eagerly ? "null" : s(public_env)}`);
    }
    if (chunks) {
      blocks.push("const deferred = new Map();");
      properties.push(`defer: (id) => new Promise((fulfil, reject) => {
							deferred.set(id, { fulfil, reject });
						})`);
      let app_declaration = "";
      if (Object.keys(options2.hooks.transport).length > 0) {
        if (client.inline) {
          app_declaration = `const app = __sveltekit_${options2.version_hash}.app.app;`;
        } else if (client.app) {
          app_declaration = `const app = await import(${s(prefixed(client.app))});`;
        } else {
          app_declaration = `const { app } = await import(${s(prefixed(client.start))});`;
        }
      }
      const prelude = app_declaration ? `${app_declaration}
							const [data, error] = fn(app);` : `const [data, error] = fn();`;
      properties.push(`resolve: async (id, fn) => {
							${prelude}

							const try_to_resolve = () => {
								if (!deferred.has(id)) {
									setTimeout(try_to_resolve, 0);
									return;
								}
								const { fulfil, reject } = deferred.get(id);
								deferred.delete(id);
								if (error) reject(error);
								else fulfil(data);
							}
							try_to_resolve();
						}`);
    }
    blocks.push(`${global} = {
						${properties.join(",\n						")}
					};`);
    const args = ["element"];
    blocks.push("const element = document.currentScript.parentElement;");
    if (page_config.ssr) {
      const serialized = { form: "null", error: "null" };
      if (form_value) {
        serialized.form = uneval_action_response(
          form_value,
          /** @type {string} */
          event.route.id,
          options2.hooks.transport
        );
      }
      if (error2) {
        serialized.error = uneval(error2);
      }
      const hydrate = [
        `node_ids: [${branch.map(({ node }) => node.index).join(", ")}]`,
        `data: ${data}`,
        `form: ${serialized.form}`,
        `error: ${serialized.error}`
      ];
      if (status !== 200) {
        hydrate.push(`status: ${status}`);
      }
      if (manifest2._.client.routes) {
        if (route) {
          const stringified = generate_route_object(route, event.url, manifest2).replaceAll(
            "\n",
            "\n							"
          );
          hydrate.push(`params: ${uneval(event.params)}`, `server_route: ${stringified}`);
        }
      } else if (options2.embedded) {
        hydrate.push(`params: ${uneval(event.params)}`, `route: ${s(event.route)}`);
      }
      const indent = "	".repeat(load_env_eagerly ? 7 : 6);
      args.push(`{
${indent}	${hydrate.join(`,
${indent}	`)}
${indent}}`);
    }
    const { remote_data: remote_cache } = event_state;
    let serialized_remote_data = "";
    if (remote_cache) {
      const remote = {};
      for (const [info, cache] of remote_cache) {
        if (!info.id) continue;
        for (const key2 in cache) {
          remote[create_remote_key(info.id, key2)] = await cache[key2];
        }
      }
      const replacer = (thing) => {
        for (const key2 in options2.hooks.transport) {
          const encoded = options2.hooks.transport[key2].encode(thing);
          if (encoded) {
            return `app.decode('${key2}', ${uneval(encoded, replacer)})`;
          }
        }
      };
      serialized_remote_data = `${global}.data = ${uneval(remote, replacer)};

						`;
    }
    const boot = client.inline ? `${client.inline.script}

					${serialized_remote_data}${global}.app.start(${args.join(", ")});` : client.app ? `Promise.all([
						import(${s(prefixed(client.start))}),
						import(${s(prefixed(client.app))})
					]).then(([kit, app]) => {
						${serialized_remote_data}kit.start(app, ${args.join(", ")});
					});` : `import(${s(prefixed(client.start))}).then((app) => {
						${serialized_remote_data}app.start(${args.join(", ")})
					});`;
    if (load_env_eagerly) {
      blocks.push(`import(${s(`${base$1}/${app_dir}/env.js`)}).then(({ env }) => {
						${global}.env = env;

						${boot.replace(/\n/g, "\n	")}
					});`);
    } else {
      blocks.push(boot);
    }
    if (options2.service_worker) {
      let opts = "";
      if (options2.service_worker_options != null) {
        const service_worker_options = { ...options2.service_worker_options };
        opts = `, ${s(service_worker_options)}`;
      }
      blocks.push(`if ('serviceWorker' in navigator) {
						addEventListener('load', function () {
							navigator.serviceWorker.register('${prefixed("service-worker.js")}'${opts});
						});
					}`);
    }
    const init_app = `
				{
					${blocks.join("\n\n					")}
				}
			`;
    csp.add_script(init_app);
    body2 += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_app}<\/script>
		`;
  }
  const headers2 = new Headers({
    "x-sveltekit-page": "true",
    "content-type": "text/html"
  });
  if (state.prerendering) {
    const csp_headers = csp.csp_provider.get_meta();
    if (csp_headers) {
      head.add_http_equiv(csp_headers);
    }
    if (state.prerendering.cache) {
      head.add_http_equiv(
        `<meta http-equiv="cache-control" content="${state.prerendering.cache}">`
      );
    }
  } else {
    const csp_header = csp.csp_provider.get_header();
    if (csp_header) {
      headers2.set("content-security-policy", csp_header);
    }
    const report_only_header = csp.report_only_provider.get_header();
    if (report_only_header) {
      headers2.set("content-security-policy-report-only", report_only_header);
    }
    if (link_headers.size) {
      headers2.set("link", Array.from(link_headers).join(", "));
    }
  }
  const html = options2.templates.app({
    head: head.build(),
    body: body2,
    assets: assets$1,
    nonce: (
      /** @type {string} */
      csp.nonce
    ),
    env: public_env
  });
  const transformed = await resolve_opts.transformPageChunk({
    html,
    done: true
  }) || "";
  if (!chunks) {
    headers2.set("etag", `"${hash(transformed)}"`);
  }
  return !chunks ? text(transformed, {
    status,
    headers: headers2
  }) : new Response(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(text_encoder2.encode(transformed + "\n"));
        for await (const chunk of chunks) {
          if (chunk.length) controller.enqueue(text_encoder2.encode(chunk));
        }
        controller.close();
      },
      type: "bytes"
    }),
    {
      headers: headers2
    }
  );
}
var Head = class {
  #rendered;
  #prerendering;
  /** @type {string[]} */
  #http_equiv = [];
  /** @type {string[]} */
  #link_tags = [];
  /** @type {string[]} */
  #script_preloads = [];
  /** @type {string[]} */
  #style_tags = [];
  /** @type {string[]} */
  #stylesheet_links = [];
  /**
   * @param {string} rendered
   * @param {boolean} prerendering
   */
  constructor(rendered, prerendering) {
    this.#rendered = rendered;
    this.#prerendering = prerendering;
  }
  build() {
    return [
      ...this.#http_equiv,
      ...this.#link_tags,
      ...this.#script_preloads,
      this.#rendered,
      ...this.#style_tags,
      ...this.#stylesheet_links
    ].join("\n		");
  }
  /**
   * @param {string} style
   * @param {string[]} attributes
   */
  add_style(style, attributes) {
    this.#style_tags.push(
      `<style${attributes.length ? " " + attributes.join(" ") : ""}>${style}</style>`
    );
  }
  /**
   * @param {string} href
   * @param {string[]} attributes
   */
  add_stylesheet(href, attributes) {
    this.#stylesheet_links.push(`<link href="${href}" ${attributes.join(" ")}>`);
  }
  /** @param {string} href */
  add_script_preload(href) {
    this.#script_preloads.push(
      `<link rel="preload" as="script" crossorigin="anonymous" href="${href}">`
    );
  }
  /**
   * @param {string} href
   * @param {string[]} attributes
   */
  add_link_tag(href, attributes) {
    if (!this.#prerendering) return;
    this.#link_tags.push(`<link href="${href}" ${attributes.join(" ")}>`);
  }
  /** @param {string} tag */
  add_http_equiv(tag) {
    if (!this.#prerendering) return;
    this.#http_equiv.push(tag);
  }
};
var PageNodes = class {
  data;
  /**
   * @param {Array<import('types').SSRNode | undefined>} nodes
   */
  constructor(nodes) {
    this.data = nodes;
  }
  layouts() {
    return this.data.slice(0, -1);
  }
  page() {
    return this.data.at(-1);
  }
  validate() {
    for (const layout of this.layouts()) {
      if (layout) {
        validate_layout_server_exports(
          layout.server,
          /** @type {string} */
          layout.server_id
        );
        validate_layout_exports(
          layout.universal,
          /** @type {string} */
          layout.universal_id
        );
      }
    }
    const page2 = this.page();
    if (page2) {
      validate_page_server_exports(
        page2.server,
        /** @type {string} */
        page2.server_id
      );
      validate_page_exports(
        page2.universal,
        /** @type {string} */
        page2.universal_id
      );
    }
  }
  /**
   * @template {'prerender' | 'ssr' | 'csr' | 'trailingSlash'} Option
   * @param {Option} option
   * @returns {Value | undefined}
   */
  #get_option(option) {
    return this.data.reduce(
      (value, node) => {
        return node?.universal?.[option] ?? node?.server?.[option] ?? value;
      },
      /** @type {Value | undefined} */
      void 0
    );
  }
  csr() {
    return this.#get_option("csr") ?? true;
  }
  ssr() {
    return this.#get_option("ssr") ?? true;
  }
  prerender() {
    return this.#get_option("prerender") ?? false;
  }
  trailing_slash() {
    return this.#get_option("trailingSlash") ?? "never";
  }
  get_config() {
    let current2 = {};
    for (const node of this.data) {
      if (!node?.universal?.config && !node?.server?.config) continue;
      current2 = {
        ...current2,
        // TODO: should we override the server config value with the universal value similar to other page options?
        ...node?.universal?.config,
        ...node?.server?.config
      };
    }
    return Object.keys(current2).length ? current2 : void 0;
  }
  should_prerender_data() {
    return this.data.some(
      // prerender in case of trailingSlash because the client retrieves that value from the server
      (node) => node?.server?.load || node?.server?.trailingSlash !== void 0
    );
  }
};
async function respond_with_error({
  event,
  event_state,
  options: options2,
  manifest: manifest2,
  state,
  status,
  error: error2,
  resolve_opts
}) {
  if (event.request.headers.get("x-sveltekit-error")) {
    return static_error_page(
      options2,
      status,
      /** @type {Error} */
      error2.message
    );
  }
  const fetched = [];
  try {
    const branch = [];
    const default_layout = await manifest2._.nodes[0]();
    const nodes = new PageNodes([default_layout]);
    const ssr = nodes.ssr();
    const csr = nodes.csr();
    const data_serializer = server_data_serializer(event, event_state, options2);
    if (ssr) {
      state.error = true;
      const server_data_promise = load_server_data({
        event,
        event_state,
        state,
        node: default_layout,
        // eslint-disable-next-line @typescript-eslint/require-await
        parent: async () => ({})
      });
      const server_data = await server_data_promise;
      data_serializer.add_node(0, server_data);
      const data = await load_data({
        event,
        event_state,
        fetched,
        node: default_layout,
        // eslint-disable-next-line @typescript-eslint/require-await
        parent: async () => ({}),
        resolve_opts,
        server_data_promise,
        state,
        csr
      });
      branch.push(
        {
          node: default_layout,
          server_data,
          data
        },
        {
          node: await manifest2._.nodes[1](),
          // 1 is always the root error
          data: null,
          server_data: null
        }
      );
    }
    return await render_response({
      options: options2,
      manifest: manifest2,
      state,
      page_config: {
        ssr,
        csr
      },
      status,
      error: await handle_error_and_jsonify(event, event_state, options2, error2),
      branch,
      fetched,
      event,
      event_state,
      resolve_opts,
      data_serializer
    });
  } catch (e3) {
    if (e3 instanceof Redirect) {
      return redirect_response(e3.status, e3.location);
    }
    return static_error_page(
      options2,
      get_status(e3),
      (await handle_error_and_jsonify(event, event_state, options2, e3)).message
    );
  }
}
async function handle_remote_call(event, state, options2, manifest2, id) {
  return record_span({
    name: "sveltekit.remote.call",
    attributes: {},
    fn: (current2) => {
      const traced_event = merge_tracing(event, current2);
      return with_request_store(
        { event: traced_event, state },
        () => handle_remote_call_internal(traced_event, state, options2, manifest2, id)
      );
    }
  });
}
async function handle_remote_call_internal(event, state, options2, manifest2, id) {
  const [hash2, name, additional_args] = id.split("/");
  const remotes = manifest2._.remotes;
  if (!remotes[hash2]) error(404);
  const module = await remotes[hash2]();
  const fn = module.default[name];
  if (!fn) error(404);
  const info = fn.__;
  const transport = options2.hooks.transport;
  event.tracing.current.setAttributes({
    "sveltekit.remote.call.type": info.type,
    "sveltekit.remote.call.name": info.name
  });
  let form_client_refreshes;
  try {
    if (info.type === "query_batch") {
      if (event.request.method !== "POST") {
        throw new SvelteKitError(
          405,
          "Method Not Allowed",
          `\`query.batch\` functions must be invoked via POST request, not ${event.request.method}`
        );
      }
      const { payloads } = await event.request.json();
      const args = await Promise.all(
        payloads.map((payload2) => parse_remote_arg(payload2, transport))
      );
      const results = await with_request_store({ event, state }, () => info.run(args, options2));
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "result",
          result: stringify2(results, transport)
        }
      );
    }
    if (info.type === "form") {
      if (event.request.method !== "POST") {
        throw new SvelteKitError(
          405,
          "Method Not Allowed",
          `\`form\` functions must be invoked via POST request, not ${event.request.method}`
        );
      }
      if (!is_form_content_type(event.request)) {
        throw new SvelteKitError(
          415,
          "Unsupported Media Type",
          `\`form\` functions expect form-encoded data \u2014 received ${event.request.headers.get(
            "content-type"
          )}`
        );
      }
      const { data: data2, meta, form_data } = await deserialize_binary_form(event.request);
      form_client_refreshes = meta.remote_refreshes;
      if (additional_args && !("id" in data2)) {
        data2.id = JSON.parse(decodeURIComponent(additional_args));
      }
      const fn2 = info.fn;
      const result = await with_request_store({ event, state }, () => fn2(data2, meta, form_data));
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "result",
          result: stringify2(result, transport),
          refreshes: result.issues ? void 0 : await serialize_refreshes(meta.remote_refreshes)
        }
      );
    }
    if (info.type === "command") {
      const { payload: payload2, refreshes } = await event.request.json();
      const arg = parse_remote_arg(payload2, transport);
      const data2 = await with_request_store({ event, state }, () => fn(arg));
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "result",
          result: stringify2(data2, transport),
          refreshes: await serialize_refreshes(refreshes)
        }
      );
    }
    const payload = info.type === "prerender" ? additional_args : (
      /** @type {string} */
      // new URL(...) necessary because we're hiding the URL from the user in the event object
      new URL(event.request.url).searchParams.get("payload")
    );
    const data = await with_request_store(
      { event, state },
      () => fn(parse_remote_arg(payload, transport))
    );
    return json(
      /** @type {RemoteFunctionResponse} */
      {
        type: "result",
        result: stringify2(data, transport)
      }
    );
  } catch (error2) {
    if (error2 instanceof Redirect) {
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "redirect",
          location: error2.location,
          refreshes: await serialize_refreshes(form_client_refreshes)
        }
      );
    }
    const status = error2 instanceof HttpError || error2 instanceof SvelteKitError ? error2.status : 500;
    return json(
      /** @type {RemoteFunctionResponse} */
      {
        type: "error",
        error: await handle_error_and_jsonify(event, state, options2, error2),
        status
      },
      {
        // By setting a non-200 during prerendering we fail the prerender process (unless handleHttpError handles it).
        // Errors at runtime will be passed to the client and are handled there
        status: state.prerendering ? status : void 0,
        headers: {
          "cache-control": "private, no-store"
        }
      }
    );
  }
  async function serialize_refreshes(client_refreshes) {
    const refreshes = state.refreshes ?? {};
    if (client_refreshes) {
      for (const key2 of client_refreshes) {
        if (refreshes[key2] !== void 0) continue;
        const [hash3, name2, payload] = key2.split("/");
        const loader = manifest2._.remotes[hash3];
        const fn2 = (await loader?.())?.default?.[name2];
        if (!fn2) error(400, "Bad Request");
        refreshes[key2] = with_request_store(
          { event, state },
          () => fn2(parse_remote_arg(payload, transport))
        );
      }
    }
    if (Object.keys(refreshes).length === 0) {
      return void 0;
    }
    return stringify2(
      Object.fromEntries(
        await Promise.all(
          Object.entries(refreshes).map(async ([key2, promise]) => [key2, await promise])
        )
      ),
      transport
    );
  }
}
async function handle_remote_form_post(event, state, manifest2, id) {
  return record_span({
    name: "sveltekit.remote.form.post",
    attributes: {},
    fn: (current2) => {
      const traced_event = merge_tracing(event, current2);
      return with_request_store(
        { event: traced_event, state },
        () => handle_remote_form_post_internal(traced_event, state, manifest2, id)
      );
    }
  });
}
async function handle_remote_form_post_internal(event, state, manifest2, id) {
  const [hash2, name, action_id] = id.split("/");
  const remotes = manifest2._.remotes;
  const module = await remotes[hash2]?.();
  let form = (
    /** @type {RemoteForm<any, any>} */
    module?.default[name]
  );
  if (!form) {
    event.setHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: "GET"
    });
    return {
      type: "error",
      error: new SvelteKitError(
        405,
        "Method Not Allowed",
        `POST method not allowed. No form actions exist for ${"this page"}`
      )
    };
  }
  if (action_id) {
    form = with_request_store({ event, state }, () => form.for(JSON.parse(action_id)));
  }
  try {
    const fn = (
      /** @type {RemoteInfo & { type: 'form' }} */
      /** @type {any} */
      form.__.fn
    );
    const { data, meta, form_data } = await deserialize_binary_form(event.request);
    if (action_id && !("id" in data)) {
      data.id = JSON.parse(decodeURIComponent(action_id));
    }
    await with_request_store({ event, state }, () => fn(data, meta, form_data));
    return {
      type: "success",
      status: 200
    };
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return {
        type: "redirect",
        status: err.status,
        location: err.location
      };
    }
    return {
      type: "error",
      error: check_incorrect_fail_use(err)
    };
  }
}
function get_remote_id(url) {
  return url.pathname.startsWith(`${base}/${app_dir}/remote/`) && url.pathname.replace(`${base}/${app_dir}/remote/`, "");
}
function get_remote_action(url) {
  return url.searchParams.get("/remote");
}
var MAX_DEPTH = 10;
async function render_page(event, event_state, page2, options2, manifest2, state, nodes, resolve_opts) {
  if (state.depth > MAX_DEPTH) {
    return text(`Not found: ${event.url.pathname}`, {
      status: 404
      // TODO in some cases this should be 500. not sure how to differentiate
    });
  }
  if (is_action_json_request(event)) {
    const node = await manifest2._.nodes[page2.leaf]();
    return handle_action_json_request(event, event_state, options2, node?.server);
  }
  try {
    const leaf_node = (
      /** @type {import('types').SSRNode} */
      nodes.page()
    );
    let status = 200;
    let action_result = void 0;
    if (is_action_request(event)) {
      const remote_id = get_remote_action(event.url);
      if (remote_id) {
        action_result = await handle_remote_form_post(event, event_state, manifest2, remote_id);
      } else {
        action_result = await handle_action_request(event, event_state, leaf_node.server);
      }
      if (action_result?.type === "redirect") {
        return redirect_response(action_result.status, action_result.location);
      }
      if (action_result?.type === "error") {
        status = get_status(action_result.error);
      }
      if (action_result?.type === "failure") {
        status = action_result.status;
      }
    }
    const should_prerender = nodes.prerender();
    if (should_prerender) {
      const mod = leaf_node.server;
      if (mod?.actions) {
        throw new Error("Cannot prerender pages with actions");
      }
    } else if (state.prerendering) {
      return new Response(void 0, {
        status: 204
      });
    }
    state.prerender_default = should_prerender;
    const should_prerender_data = nodes.should_prerender_data();
    const data_pathname = add_data_suffix2(event.url.pathname);
    const fetched = [];
    const ssr = nodes.ssr();
    const csr = nodes.csr();
    if (ssr === false && !(state.prerendering && should_prerender_data)) {
      if (BROWSER && action_result && !event.request.headers.has("x-sveltekit-action")) ;
      return await render_response({
        branch: [],
        fetched,
        page_config: {
          ssr: false,
          csr
        },
        status,
        error: null,
        event,
        event_state,
        options: options2,
        manifest: manifest2,
        state,
        resolve_opts,
        data_serializer: server_data_serializer(event, event_state, options2)
      });
    }
    const branch = [];
    let load_error = null;
    const data_serializer = server_data_serializer(event, event_state, options2);
    const data_serializer_json = state.prerendering && should_prerender_data ? server_data_serializer_json(event, event_state, options2) : null;
    const server_promises = nodes.data.map((node, i) => {
      if (load_error) {
        throw load_error;
      }
      return Promise.resolve().then(async () => {
        try {
          if (node === leaf_node && action_result?.type === "error") {
            throw action_result.error;
          }
          const server_data = await load_server_data({
            event,
            event_state,
            state,
            node,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                const parent = await server_promises[j];
                if (parent) Object.assign(data, parent.data);
              }
              return data;
            }
          });
          if (node) {
            data_serializer.add_node(i, server_data);
          }
          data_serializer_json?.add_node(i, server_data);
          return server_data;
        } catch (e3) {
          load_error = /** @type {Error} */
          e3;
          throw load_error;
        }
      });
    });
    const load_promises = nodes.data.map((node, i) => {
      if (load_error) throw load_error;
      return Promise.resolve().then(async () => {
        try {
          return await load_data({
            event,
            event_state,
            fetched,
            node,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                Object.assign(data, await load_promises[j]);
              }
              return data;
            },
            resolve_opts,
            server_data_promise: server_promises[i],
            state,
            csr
          });
        } catch (e3) {
          load_error = /** @type {Error} */
          e3;
          throw load_error;
        }
      });
    });
    for (const p of server_promises) p.catch(() => {
    });
    for (const p of load_promises) p.catch(() => {
    });
    for (let i = 0; i < nodes.data.length; i += 1) {
      const node = nodes.data[i];
      if (node) {
        try {
          const server_data = await server_promises[i];
          const data = await load_promises[i];
          branch.push({ node, server_data, data });
        } catch (e3) {
          const err = normalize_error(e3);
          if (err instanceof Redirect) {
            if (state.prerendering && should_prerender_data) {
              const body2 = JSON.stringify({
                type: "redirect",
                location: err.location
              });
              state.prerendering.dependencies.set(data_pathname, {
                response: text(body2),
                body: body2
              });
            }
            return redirect_response(err.status, err.location);
          }
          const status2 = get_status(err);
          const error2 = await handle_error_and_jsonify(event, event_state, options2, err);
          while (i--) {
            if (page2.errors[i]) {
              const index9 = (
                /** @type {number} */
                page2.errors[i]
              );
              const node2 = await manifest2._.nodes[index9]();
              let j = i;
              while (!branch[j]) j -= 1;
              data_serializer.set_max_nodes(j + 1);
              const layouts = compact(branch.slice(0, j + 1));
              const nodes2 = new PageNodes(layouts.map((layout) => layout.node));
              return await render_response({
                event,
                event_state,
                options: options2,
                manifest: manifest2,
                state,
                resolve_opts,
                page_config: {
                  ssr: nodes2.ssr(),
                  csr: nodes2.csr()
                },
                status: status2,
                error: error2,
                branch: layouts.concat({
                  node: node2,
                  data: null,
                  server_data: null
                }),
                fetched,
                data_serializer
              });
            }
          }
          return static_error_page(options2, status2, error2.message);
        }
      } else {
        branch.push(null);
      }
    }
    if (state.prerendering && data_serializer_json) {
      let { data, chunks } = data_serializer_json.get_data();
      if (chunks) {
        for await (const chunk of chunks) {
          data += chunk;
        }
      }
      state.prerendering.dependencies.set(data_pathname, {
        response: text(data),
        body: data
      });
    }
    return await render_response({
      event,
      event_state,
      options: options2,
      manifest: manifest2,
      state,
      resolve_opts,
      page_config: {
        csr,
        ssr
      },
      status,
      error: null,
      branch: ssr === false ? [] : compact(branch),
      action_result,
      fetched,
      data_serializer: ssr === false ? server_data_serializer(event, event_state, options2) : data_serializer
    });
  } catch (e3) {
    if (e3 instanceof Redirect) {
      return redirect_response(e3.status, e3.location);
    }
    return await respond_with_error({
      event,
      event_state,
      options: options2,
      manifest: manifest2,
      state,
      status: e3 instanceof HttpError ? e3.status : 500,
      error: e3,
      resolve_opts
    });
  }
}
function once(fn) {
  let done = false;
  let result;
  return () => {
    if (done) return result;
    done = true;
    return result = fn();
  };
}
async function render_data(event, event_state, route, options2, manifest2, state, invalidated_data_nodes, trailing_slash) {
  if (!route.page) {
    return new Response(void 0, {
      status: 404
    });
  }
  try {
    const node_ids = [...route.page.layouts, route.page.leaf];
    const invalidated = invalidated_data_nodes ?? node_ids.map(() => true);
    let aborted = false;
    const url = new URL(event.url);
    url.pathname = normalize_path(url.pathname, trailing_slash);
    const new_event = { ...event, url };
    const functions = node_ids.map((n2, i) => {
      return once(async () => {
        try {
          if (aborted) {
            return (
              /** @type {import('types').ServerDataSkippedNode} */
              {
                type: "skip"
              }
            );
          }
          const node = n2 == void 0 ? n2 : await manifest2._.nodes[n2]();
          return load_server_data({
            event: new_event,
            event_state,
            state,
            node,
            parent: async () => {
              const data2 = {};
              for (let j = 0; j < i; j += 1) {
                const parent = (
                  /** @type {import('types').ServerDataNode | null} */
                  await functions[j]()
                );
                if (parent) {
                  Object.assign(data2, parent.data);
                }
              }
              return data2;
            }
          });
        } catch (e3) {
          aborted = true;
          throw e3;
        }
      });
    });
    const promises = functions.map(async (fn, i) => {
      if (!invalidated[i]) {
        return (
          /** @type {import('types').ServerDataSkippedNode} */
          {
            type: "skip"
          }
        );
      }
      return fn();
    });
    let length = promises.length;
    const nodes = await Promise.all(
      promises.map(
        (p, i) => p.catch(async (error2) => {
          if (error2 instanceof Redirect) {
            throw error2;
          }
          length = Math.min(length, i + 1);
          return (
            /** @type {import('types').ServerErrorNode} */
            {
              type: "error",
              error: await handle_error_and_jsonify(event, event_state, options2, error2),
              status: error2 instanceof HttpError || error2 instanceof SvelteKitError ? error2.status : void 0
            }
          );
        })
      )
    );
    const data_serializer = server_data_serializer_json(event, event_state, options2);
    for (let i = 0; i < nodes.length; i++) data_serializer.add_node(i, nodes[i]);
    const { data, chunks } = data_serializer.get_data();
    if (!chunks) {
      return json_response(data);
    }
    return new Response(
      new ReadableStream({
        async start(controller) {
          controller.enqueue(text_encoder2.encode(data));
          for await (const chunk of chunks) {
            controller.enqueue(text_encoder2.encode(chunk));
          }
          controller.close();
        },
        type: "bytes"
      }),
      {
        headers: {
          // we use a proprietary content type to prevent buffering.
          // the `text` prefix makes it inspectable
          "content-type": "text/sveltekit-data",
          "cache-control": "private, no-store"
        }
      }
    );
  } catch (e3) {
    const error2 = normalize_error(e3);
    if (error2 instanceof Redirect) {
      return redirect_json_response(error2);
    } else {
      return json_response(await handle_error_and_jsonify(event, event_state, options2, error2), 500);
    }
  }
}
function json_response(json2, status = 200) {
  return text(typeof json2 === "string" ? json2 : JSON.stringify(json2), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "private, no-store"
    }
  });
}
function redirect_json_response(redirect) {
  return json_response(
    /** @type {import('types').ServerRedirectNode} */
    {
      type: "redirect",
      location: redirect.location
    }
  );
}
var INVALID_COOKIE_CHARACTER_REGEX = /[\x00-\x1F\x7F()<>@,;:"/[\]?={} \t]/;
function validate_options(options2) {
  if (options2?.path === void 0) {
    throw new Error("You must specify a `path` when setting, deleting or serializing cookies");
  }
}
function generate_cookie_key(domain, path, name) {
  return `${domain || ""}${path}?${encodeURIComponent(name)}`;
}
function get_cookies(request, url) {
  const header = request.headers.get("cookie") ?? "";
  const initial_cookies = (0, import_cookie.parse)(header, { decode: (value) => value });
  let normalized_url;
  const new_cookies = /* @__PURE__ */ new Map();
  const defaults = {
    httpOnly: true,
    sameSite: "lax",
    secure: url.hostname === "localhost" && url.protocol === "http:" ? false : true
  };
  const cookies = {
    // The JSDoc param annotations appearing below for get, set and delete
    // are necessary to expose the `cookie` library types to
    // typescript users. `@type {import('@sveltejs/kit').Cookies}` above is not
    // sufficient to do so.
    /**
     * @param {string} name
     * @param {import('cookie').CookieParseOptions} [opts]
     */
    get(name, opts) {
      const best_match = Array.from(new_cookies.values()).filter((c2) => {
        return c2.name === name && domain_matches(url.hostname, c2.options.domain) && path_matches(url.pathname, c2.options.path);
      }).sort((a, b) => b.options.path.length - a.options.path.length)[0];
      if (best_match) {
        return best_match.options.maxAge === 0 ? void 0 : best_match.value;
      }
      const req_cookies = (0, import_cookie.parse)(header, { decode: opts?.decode });
      const cookie = req_cookies[name];
      return cookie;
    },
    /**
     * @param {import('cookie').CookieParseOptions} [opts]
     */
    getAll(opts) {
      const cookies2 = (0, import_cookie.parse)(header, { decode: opts?.decode });
      const lookup = /* @__PURE__ */ new Map();
      for (const c2 of new_cookies.values()) {
        if (domain_matches(url.hostname, c2.options.domain) && path_matches(url.pathname, c2.options.path)) {
          const existing = lookup.get(c2.name);
          if (!existing || c2.options.path.length > existing.options.path.length) {
            lookup.set(c2.name, c2);
          }
        }
      }
      for (const c2 of lookup.values()) {
        cookies2[c2.name] = c2.value;
      }
      return Object.entries(cookies2).map(([name, value]) => ({ name, value }));
    },
    /**
     * @param {string} name
     * @param {string} value
     * @param {import('./page/types.js').Cookie['options']} options
     */
    set(name, value, options2) {
      const illegal_characters = name.match(INVALID_COOKIE_CHARACTER_REGEX);
      if (illegal_characters) {
        console.warn(
          `The cookie name "${name}" will be invalid in SvelteKit 3.0 as it contains ${illegal_characters.join(
            " and "
          )}. See RFC 2616 for more details https://datatracker.ietf.org/doc/html/rfc2616#section-2.2`
        );
      }
      validate_options(options2);
      set_internal(name, value, { ...defaults, ...options2 });
    },
    /**
     * @param {string} name
     *  @param {import('./page/types.js').Cookie['options']} options
     */
    delete(name, options2) {
      validate_options(options2);
      cookies.set(name, "", { ...options2, maxAge: 0 });
    },
    /**
     * @param {string} name
     * @param {string} value
     *  @param {import('./page/types.js').Cookie['options']} options
     */
    serialize(name, value, options2) {
      validate_options(options2);
      let path = options2.path;
      if (!options2.domain || options2.domain === url.hostname) {
        if (!normalized_url) {
          throw new Error("Cannot serialize cookies until after the route is determined");
        }
        path = resolve(normalized_url, path);
      }
      return (0, import_cookie.serialize)(name, value, { ...defaults, ...options2, path });
    }
  };
  function get_cookie_header(destination, header2) {
    const combined_cookies = {
      // cookies sent by the user agent have lowest precedence
      ...initial_cookies
    };
    for (const cookie of new_cookies.values()) {
      if (!domain_matches(destination.hostname, cookie.options.domain)) continue;
      if (!path_matches(destination.pathname, cookie.options.path)) continue;
      const encoder = cookie.options.encode || encodeURIComponent;
      combined_cookies[cookie.name] = encoder(cookie.value);
    }
    if (header2) {
      const parsed = (0, import_cookie.parse)(header2, { decode: (value) => value });
      for (const name in parsed) {
        combined_cookies[name] = parsed[name];
      }
    }
    return Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
  }
  const internal_queue = [];
  function set_internal(name, value, options2) {
    if (!normalized_url) {
      internal_queue.push(() => set_internal(name, value, options2));
      return;
    }
    let path = options2.path;
    if (!options2.domain || options2.domain === url.hostname) {
      path = resolve(normalized_url, path);
    }
    const cookie_key = generate_cookie_key(options2.domain, path, name);
    const cookie = { name, value, options: { ...options2, path } };
    new_cookies.set(cookie_key, cookie);
  }
  function set_trailing_slash(trailing_slash) {
    normalized_url = normalize_path(url.pathname, trailing_slash);
    internal_queue.forEach((fn) => fn());
  }
  return { cookies, new_cookies, get_cookie_header, set_internal, set_trailing_slash };
}
function domain_matches(hostname, constraint) {
  if (!constraint) return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized) return true;
  return hostname.endsWith("." + normalized);
}
function path_matches(path, constraint) {
  if (!constraint) return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized) return true;
  return path.startsWith(normalized + "/");
}
function add_cookies_to_headers(headers2, cookies) {
  for (const new_cookie of cookies) {
    const { name, value, options: options2 } = new_cookie;
    headers2.append("set-cookie", (0, import_cookie.serialize)(name, value, options2));
    if (options2.path.endsWith(".html")) {
      const path = add_data_suffix2(options2.path);
      headers2.append("set-cookie", (0, import_cookie.serialize)(name, value, { ...options2, path }));
    }
  }
}
function create_fetch({ event, options: options2, manifest: manifest2, state, get_cookie_header, set_internal }) {
  const server_fetch = async (info, init2) => {
    const original_request = normalize_fetch_input(info, init2, event.url);
    let mode = (info instanceof Request ? info.mode : init2?.mode) ?? "cors";
    let credentials = (info instanceof Request ? info.credentials : init2?.credentials) ?? "same-origin";
    return options2.hooks.handleFetch({
      event,
      request: original_request,
      fetch: async (info2, init3) => {
        const request = normalize_fetch_input(info2, init3, event.url);
        const url = new URL(request.url);
        if (!request.headers.has("origin")) {
          request.headers.set("origin", event.url.origin);
        }
        if (info2 !== original_request) {
          mode = (info2 instanceof Request ? info2.mode : init3?.mode) ?? "cors";
          credentials = (info2 instanceof Request ? info2.credentials : init3?.credentials) ?? "same-origin";
        }
        if ((request.method === "GET" || request.method === "HEAD") && (mode === "no-cors" && url.origin !== event.url.origin || url.origin === event.url.origin)) {
          request.headers.delete("origin");
        }
        const decoded = decodeURIComponent(url.pathname);
        if (url.origin !== event.url.origin || base && decoded !== base && !decoded.startsWith(`${base}/`)) {
          if (`.${url.hostname}`.endsWith(`.${event.url.hostname}`) && credentials !== "omit") {
            const cookie = get_cookie_header(url, request.headers.get("cookie"));
            if (cookie) request.headers.set("cookie", cookie);
          }
          return fetch(request);
        }
        const prefix = assets || base;
        const filename = (decoded.startsWith(prefix) ? decoded.slice(prefix.length) : decoded).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = manifest2.assets.has(filename) || filename in manifest2._.server_assets;
        const is_asset_html = manifest2.assets.has(filename_html) || filename_html in manifest2._.server_assets;
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (state.read) {
            const type = is_asset ? manifest2.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            return new Response(state.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          } else if (read_implementation && file in manifest2._.server_assets) {
            const length = manifest2._.server_assets[file];
            const type = manifest2.mimeTypes[file.slice(file.lastIndexOf("."))];
            return new Response(read_implementation(file), {
              headers: {
                "Content-Length": "" + length,
                "Content-Type": type
              }
            });
          }
          return await fetch(request);
        }
        if (has_prerendered_path(manifest2, base + decoded)) {
          return await fetch(request);
        }
        if (credentials !== "omit") {
          const cookie = get_cookie_header(url, request.headers.get("cookie"));
          if (cookie) {
            request.headers.set("cookie", cookie);
          }
          const authorization = event.request.headers.get("authorization");
          if (authorization && !request.headers.has("authorization")) {
            request.headers.set("authorization", authorization);
          }
        }
        if (!request.headers.has("accept")) {
          request.headers.set("accept", "*/*");
        }
        if (!request.headers.has("accept-language")) {
          request.headers.set(
            "accept-language",
            /** @type {string} */
            event.request.headers.get("accept-language")
          );
        }
        const response = await internal_fetch(request, options2, manifest2, state);
        const set_cookie = response.headers.get("set-cookie");
        if (set_cookie) {
          for (const str of splitCookiesString(set_cookie)) {
            const { name, value, ...options3 } = parseString(str, {
              decodeValues: false
            });
            const path = options3.path ?? (url.pathname.split("/").slice(0, -1).join("/") || "/");
            set_internal(name, value, {
              path,
              encode: (value2) => value2,
              .../** @type {import('cookie').CookieSerializeOptions} */
              options3
            });
          }
        }
        return response;
      }
    });
  };
  return (input, init2) => {
    const response = server_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
function normalize_fetch_input(info, init2, url) {
  if (info instanceof Request) {
    return info;
  }
  return new Request(typeof info === "string" ? new URL(info, url) : info, init2);
}
async function internal_fetch(request, options2, manifest2, state) {
  if (request.signal) {
    if (request.signal.aborted) {
      throw new DOMException("The operation was aborted.", "AbortError");
    }
    let remove_abort_listener = () => {
    };
    const abort_promise = new Promise((_, reject) => {
      const on_abort = () => {
        reject(new DOMException("The operation was aborted.", "AbortError"));
      };
      request.signal.addEventListener("abort", on_abort, { once: true });
      remove_abort_listener = () => request.signal.removeEventListener("abort", on_abort);
    });
    const result = await Promise.race([
      respond(request, options2, manifest2, {
        ...state,
        depth: state.depth + 1
      }),
      abort_promise
    ]);
    remove_abort_listener();
    return result;
  } else {
    return await respond(request, options2, manifest2, {
      ...state,
      depth: state.depth + 1
    });
  }
}
var body;
var etag;
var headers;
function get_public_env(request) {
  body ??= `export const env=${JSON.stringify(public_env)}`;
  etag ??= `W/${Date.now()}`;
  headers ??= new Headers({
    "content-type": "application/javascript; charset=utf-8",
    etag
  });
  if (request.headers.get("if-none-match") === etag) {
    return new Response(void 0, { status: 304, headers });
  }
  return new Response(body, { headers });
}
var default_transform = ({ html }) => html;
var default_filter = () => false;
var default_preload = ({ type }) => type === "js" || type === "css";
var page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "POST"]);
var allowed_page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
var respond = propagate_context(internal_respond);
async function internal_respond(request, options2, manifest2, state) {
  const url = new URL(request.url);
  const is_route_resolution_request = has_resolution_suffix2(url.pathname);
  const is_data_request = has_data_suffix2(url.pathname);
  const remote_id = get_remote_id(url);
  {
    const request_origin = request.headers.get("origin");
    if (remote_id) {
      if (request.method !== "GET" && request_origin !== url.origin) {
        const message = "Cross-site remote requests are forbidden";
        return json({ message }, { status: 403 });
      }
    } else if (options2.csrf_check_origin) {
      const forbidden = is_form_content_type(request) && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH" || request.method === "DELETE") && request_origin !== url.origin && (!request_origin || !options2.csrf_trusted_origins.includes(request_origin));
      if (forbidden) {
        const message = `Cross-site ${request.method} form submissions are forbidden`;
        const opts = { status: 403 };
        if (request.headers.get("accept") === "application/json") {
          return json({ message }, opts);
        }
        return text(message, opts);
      }
    }
  }
  if (options2.hash_routing && url.pathname !== base + "/" && url.pathname !== "/[fallback]") {
    return text("Not found", { status: 404 });
  }
  let invalidated_data_nodes;
  if (is_route_resolution_request) {
    url.pathname = strip_resolution_suffix2(url.pathname);
  } else if (is_data_request) {
    url.pathname = strip_data_suffix2(url.pathname) + (url.searchParams.get(TRAILING_SLASH_PARAM) === "1" ? "/" : "") || "/";
    url.searchParams.delete(TRAILING_SLASH_PARAM);
    invalidated_data_nodes = url.searchParams.get(INVALIDATED_PARAM)?.split("").map((node) => node === "1");
    url.searchParams.delete(INVALIDATED_PARAM);
  } else if (remote_id) {
    url.pathname = request.headers.get("x-sveltekit-pathname") ?? base;
    url.search = request.headers.get("x-sveltekit-search") ?? "";
  }
  const headers2 = {};
  const { cookies, new_cookies, get_cookie_header, set_internal, set_trailing_slash } = get_cookies(
    request,
    url
  );
  const event_state = {
    prerendering: state.prerendering,
    transport: options2.hooks.transport,
    handleValidationError: options2.hooks.handleValidationError,
    tracing: {
      record_span
    },
    is_in_remote_function: false
  };
  const event = {
    cookies,
    // @ts-expect-error `fetch` needs to be created after the `event` itself
    fetch: null,
    getClientAddress: state.getClientAddress || (() => {
      throw new Error(
        `${"@sveltejs/adapter-cloudflare"} does not specify getClientAddress. Please raise an issue`
      );
    }),
    locals: {},
    params: {},
    platform: state.platform,
    request,
    route: { id: null },
    setHeaders: (new_headers) => {
      for (const key2 in new_headers) {
        const lower = key2.toLowerCase();
        const value = new_headers[key2];
        if (lower === "set-cookie") {
          throw new Error(
            "Use `event.cookies.set(name, value, options)` instead of `event.setHeaders` to set cookies"
          );
        } else if (lower in headers2) {
          if (lower === "server-timing") {
            headers2[lower] += ", " + value;
          } else {
            throw new Error(`"${key2}" header is already set`);
          }
        } else {
          headers2[lower] = value;
          if (state.prerendering && lower === "cache-control") {
            state.prerendering.cache = /** @type {string} */
            value;
          }
        }
      }
    },
    url,
    isDataRequest: is_data_request,
    isSubRequest: state.depth > 0,
    isRemoteRequest: !!remote_id
  };
  event.fetch = create_fetch({
    event,
    options: options2,
    manifest: manifest2,
    state,
    get_cookie_header,
    set_internal
  });
  if (state.emulator?.platform) {
    event.platform = await state.emulator.platform({
      config: {},
      prerender: !!state.prerendering?.fallback
    });
  }
  let resolved_path = url.pathname;
  if (!remote_id) {
    const prerendering_reroute_state = state.prerendering?.inside_reroute;
    try {
      if (state.prerendering) state.prerendering.inside_reroute = true;
      resolved_path = await options2.hooks.reroute({ url: new URL(url), fetch: event.fetch }) ?? url.pathname;
    } catch {
      return text("Internal Server Error", {
        status: 500
      });
    } finally {
      if (state.prerendering) state.prerendering.inside_reroute = prerendering_reroute_state;
    }
  }
  try {
    resolved_path = decode_pathname(resolved_path);
  } catch {
    return text("Malformed URI", { status: 400 });
  }
  if (
    // the resolved path has been decoded so it should be compared to the decoded url pathname
    resolved_path !== decode_pathname(url.pathname) && !state.prerendering?.fallback && has_prerendered_path(manifest2, resolved_path)
  ) {
    const url2 = new URL(request.url);
    url2.pathname = is_data_request ? add_data_suffix2(resolved_path) : is_route_resolution_request ? add_resolution_suffix2(resolved_path) : resolved_path;
    try {
      const response = await fetch(url2, request);
      const headers22 = new Headers(response.headers);
      if (headers22.has("content-encoding")) {
        headers22.delete("content-encoding");
        headers22.delete("content-length");
      }
      return new Response(response.body, {
        headers: headers22,
        status: response.status,
        statusText: response.statusText
      });
    } catch (error2) {
      return await handle_fatal_error(event, event_state, options2, error2);
    }
  }
  let route = null;
  if (base && !state.prerendering?.fallback) {
    if (!resolved_path.startsWith(base)) {
      return text("Not found", { status: 404 });
    }
    resolved_path = resolved_path.slice(base.length) || "/";
  }
  if (is_route_resolution_request) {
    return resolve_route(resolved_path, new URL(request.url), manifest2);
  }
  if (resolved_path === `/${app_dir}/env.js`) {
    return get_public_env(request);
  }
  if (!remote_id && resolved_path.startsWith(`/${app_dir}`)) {
    const headers22 = new Headers();
    headers22.set("cache-control", "public, max-age=0, must-revalidate");
    return text("Not found", { status: 404, headers: headers22 });
  }
  if (!state.prerendering?.fallback) {
    const matchers = await manifest2._.matchers();
    const result = find_route(resolved_path, manifest2._.routes, matchers);
    if (result) {
      route = result.route;
      event.route = { id: route.id };
      event.params = result.params;
    }
  }
  let resolve_opts = {
    transformPageChunk: default_transform,
    filterSerializedResponseHeaders: default_filter,
    preload: default_preload
  };
  let trailing_slash = "never";
  try {
    const page_nodes = route?.page ? new PageNodes(await load_page_nodes(route.page, manifest2)) : void 0;
    if (route && !remote_id) {
      if (url.pathname === base || url.pathname === base + "/") {
        trailing_slash = "always";
      } else if (page_nodes) {
        if (BROWSER) ;
        trailing_slash = page_nodes.trailing_slash();
      } else if (route.endpoint) {
        const node = await route.endpoint();
        trailing_slash = node.trailingSlash ?? "never";
        if (BROWSER) ;
      }
      if (!is_data_request) {
        const normalized = normalize_path(url.pathname, trailing_slash);
        if (normalized !== url.pathname && !state.prerendering?.fallback) {
          return new Response(void 0, {
            status: 308,
            headers: {
              "x-sveltekit-normalize": "1",
              location: (
                // ensure paths starting with '//' are not treated as protocol-relative
                (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
              )
            }
          });
        }
      }
      if (state.before_handle || state.emulator?.platform) {
        let config = {};
        let prerender = false;
        if (route.endpoint) {
          const node = await route.endpoint();
          config = node.config ?? config;
          prerender = node.prerender ?? prerender;
        } else if (page_nodes) {
          config = page_nodes.get_config() ?? config;
          prerender = page_nodes.prerender();
        }
        if (state.before_handle) {
          state.before_handle(event, config, prerender);
        }
        if (state.emulator?.platform) {
          event.platform = await state.emulator.platform({ config, prerender });
        }
      }
    }
    set_trailing_slash(trailing_slash);
    if (state.prerendering && !state.prerendering.fallback && !state.prerendering.inside_reroute) {
      disable_search(url);
    }
    const response = await record_span({
      name: "sveltekit.handle.root",
      attributes: {
        "http.route": event.route.id || "unknown",
        "http.method": event.request.method,
        "http.url": event.url.href,
        "sveltekit.is_data_request": is_data_request,
        "sveltekit.is_sub_request": event.isSubRequest
      },
      fn: async (root_span) => {
        const traced_event = {
          ...event,
          tracing: {
            enabled: false,
            root: root_span,
            current: root_span
          }
        };
        event_state.allows_commands = MUTATIVE_METHODS.includes(request.method);
        return await with_request_store(
          { event: traced_event, state: event_state },
          () => options2.hooks.handle({
            event: traced_event,
            resolve: (event2, opts) => {
              return record_span({
                name: "sveltekit.resolve",
                attributes: {
                  "http.route": event2.route.id || "unknown"
                },
                fn: (resolve_span) => {
                  return with_request_store(
                    null,
                    () => resolve2(merge_tracing(event2, resolve_span), page_nodes, opts).then(
                      (response2) => {
                        for (const key2 in headers2) {
                          const value = headers2[key2];
                          response2.headers.set(
                            key2,
                            /** @type {string} */
                            value
                          );
                        }
                        add_cookies_to_headers(response2.headers, new_cookies.values());
                        if (state.prerendering && event2.route.id !== null) {
                          response2.headers.set("x-sveltekit-routeid", encodeURI(event2.route.id));
                        }
                        resolve_span.setAttributes({
                          "http.response.status_code": response2.status,
                          "http.response.body.size": response2.headers.get("content-length") || "unknown"
                        });
                        return response2;
                      }
                    )
                  );
                }
              });
            }
          })
        );
      }
    });
    if (response.status === 200 && response.headers.has("etag")) {
      let if_none_match_value = request.headers.get("if-none-match");
      if (if_none_match_value?.startsWith('W/"')) {
        if_none_match_value = if_none_match_value.substring(2);
      }
      const etag2 = (
        /** @type {string} */
        response.headers.get("etag")
      );
      if (if_none_match_value === etag2) {
        const headers22 = new Headers({ etag: etag2 });
        for (const key2 of [
          "cache-control",
          "content-location",
          "date",
          "expires",
          "vary",
          "set-cookie"
        ]) {
          const value = response.headers.get(key2);
          if (value) headers22.set(key2, value);
        }
        return new Response(void 0, {
          status: 304,
          headers: headers22
        });
      }
    }
    if (is_data_request && response.status >= 300 && response.status <= 308) {
      const location = response.headers.get("location");
      if (location) {
        return redirect_json_response(new Redirect(
          /** @type {any} */
          response.status,
          location
        ));
      }
    }
    return response;
  } catch (e3) {
    if (e3 instanceof Redirect) {
      const response = is_data_request || remote_id ? redirect_json_response(e3) : route?.page && is_action_json_request(event) ? action_json_redirect(e3) : redirect_response(e3.status, e3.location);
      add_cookies_to_headers(response.headers, new_cookies.values());
      return response;
    }
    return await handle_fatal_error(event, event_state, options2, e3);
  }
  async function resolve2(event2, page_nodes, opts) {
    try {
      if (opts) {
        resolve_opts = {
          transformPageChunk: opts.transformPageChunk || default_transform,
          filterSerializedResponseHeaders: opts.filterSerializedResponseHeaders || default_filter,
          preload: opts.preload || default_preload
        };
      }
      if (options2.hash_routing || state.prerendering?.fallback) {
        return await render_response({
          event: event2,
          event_state,
          options: options2,
          manifest: manifest2,
          state,
          page_config: { ssr: false, csr: true },
          status: 200,
          error: null,
          branch: [],
          fetched: [],
          resolve_opts,
          data_serializer: server_data_serializer(event2, event_state, options2)
        });
      }
      if (remote_id) {
        return await handle_remote_call(event2, event_state, options2, manifest2, remote_id);
      }
      if (route) {
        const method = (
          /** @type {import('types').HttpMethod} */
          event2.request.method
        );
        let response2;
        if (is_data_request) {
          response2 = await render_data(
            event2,
            event_state,
            route,
            options2,
            manifest2,
            state,
            invalidated_data_nodes,
            trailing_slash
          );
        } else if (route.endpoint && (!route.page || is_endpoint_request(event2))) {
          response2 = await render_endpoint(event2, event_state, await route.endpoint(), state);
        } else if (route.page) {
          if (!page_nodes) {
            throw new Error("page_nodes not found. This should never happen");
          } else if (page_methods.has(method)) {
            response2 = await render_page(
              event2,
              event_state,
              route.page,
              options2,
              manifest2,
              state,
              page_nodes,
              resolve_opts
            );
          } else {
            const allowed_methods2 = new Set(allowed_page_methods);
            const node = await manifest2._.nodes[route.page.leaf]();
            if (node?.server?.actions) {
              allowed_methods2.add("POST");
            }
            if (method === "OPTIONS") {
              response2 = new Response(null, {
                status: 204,
                headers: {
                  allow: Array.from(allowed_methods2.values()).join(", ")
                }
              });
            } else {
              const mod = [...allowed_methods2].reduce(
                (acc, curr) => {
                  acc[curr] = true;
                  return acc;
                },
                /** @type {Record<string, any>} */
                {}
              );
              response2 = method_not_allowed(mod, method);
            }
          }
        } else {
          throw new Error("Route is neither page nor endpoint. This should never happen");
        }
        if (request.method === "GET" && route.page && route.endpoint) {
          const vary = response2.headers.get("vary")?.split(",")?.map((v) => v.trim().toLowerCase());
          if (!(vary?.includes("accept") || vary?.includes("*"))) {
            response2 = new Response(response2.body, {
              status: response2.status,
              statusText: response2.statusText,
              headers: new Headers(response2.headers)
            });
            response2.headers.append("Vary", "Accept");
          }
        }
        return response2;
      }
      if (state.error && event2.isSubRequest) {
        const headers22 = new Headers(request.headers);
        headers22.set("x-sveltekit-error", "true");
        return await fetch(request, { headers: headers22 });
      }
      if (state.error) {
        return text("Internal Server Error", {
          status: 500
        });
      }
      if (state.depth === 0) {
        if (BROWSER && event2.url.pathname === "/.well-known/appspecific/com.chrome.devtools.json") ;
        return await respond_with_error({
          event: event2,
          event_state,
          options: options2,
          manifest: manifest2,
          state,
          status: 404,
          error: new SvelteKitError(404, "Not Found", `Not found: ${event2.url.pathname}`),
          resolve_opts
        });
      }
      if (state.prerendering) {
        return text("not found", { status: 404 });
      }
      const response = await fetch(request);
      return new Response(response.body, response);
    } catch (e3) {
      return await handle_fatal_error(event2, event_state, options2, e3);
    } finally {
      event2.cookies.set = () => {
        throw new Error("Cannot use `cookies.set(...)` after the response has been generated");
      };
      event2.setHeaders = () => {
        throw new Error("Cannot use `setHeaders(...)` after the response has been generated");
      };
    }
  }
}
function load_page_nodes(page2, manifest2) {
  return Promise.all([
    // we use == here rather than === because [undefined] serializes as "[null]"
    ...page2.layouts.map((n2) => n2 == void 0 ? n2 : manifest2._.nodes[n2]()),
    manifest2._.nodes[page2.leaf]()
  ]);
}
function propagate_context(fn) {
  return async (req, ...rest) => {
    {
      return fn(req, ...rest);
    }
  };
}
function filter_env(env, allowed, disallowed) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([k]) => k.startsWith(allowed) && (disallowed === "" || !k.startsWith(disallowed))
    )
  );
}
function set_app(value) {
}
var init_promise;
var current = null;
var Server = class {
  /** @type {import('types').SSROptions} */
  #options;
  /** @type {import('@sveltejs/kit').SSRManifest} */
  #manifest;
  /** @param {import('@sveltejs/kit').SSRManifest} manifest */
  constructor(manifest2) {
    this.#options = options;
    this.#manifest = manifest2;
    if (IN_WEBCONTAINER2) {
      const respond2 = this.respond.bind(this);
      this.respond = async (...args) => {
        const { promise, resolve: resolve2 } = (
          /** @type {PromiseWithResolvers<void>} */
          with_resolvers()
        );
        const previous = current;
        current = promise;
        await previous;
        return respond2(...args).finally(resolve2);
      };
    }
  }
  /**
   * @param {import('@sveltejs/kit').ServerInitOptions} opts
   */
  async init({ env, read }) {
    const { env_public_prefix, env_private_prefix } = this.#options;
    set_private_env(filter_env(env, env_private_prefix, env_public_prefix));
    set_public_env(filter_env(env, env_public_prefix, env_private_prefix));
    if (read) {
      const wrapped_read = (file) => {
        const result = read(file);
        if (result instanceof ReadableStream) {
          return result;
        } else {
          return new ReadableStream({
            async start(controller) {
              try {
                const stream = await Promise.resolve(result);
                if (!stream) {
                  controller.close();
                  return;
                }
                const reader = stream.getReader();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  controller.enqueue(value);
                }
                controller.close();
              } catch (error2) {
                controller.error(error2);
              }
            }
          });
        }
      };
      set_read_implementation(wrapped_read);
    }
    await (init_promise ??= (async () => {
      try {
        const module = await get_hooks();
        this.#options.hooks = {
          handle: module.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
          handleError: module.handleError || (({ status, error: error2, event }) => {
            const error_message = format_server_error(
              status,
              /** @type {Error} */
              error2,
              event
            );
            console.error(error_message);
          }),
          handleFetch: module.handleFetch || (({ request, fetch: fetch2 }) => fetch2(request)),
          handleValidationError: module.handleValidationError || (({ issues }) => {
            console.error("Remote function schema validation failed:", issues);
            return { message: "Bad Request" };
          }),
          reroute: module.reroute || (() => {
          }),
          transport: module.transport || {}
        };
        set_app({
          decoders: module.transport ? Object.fromEntries(Object.entries(module.transport).map(([k, v]) => [k, v.decode])) : {}
        });
        if (module.init) {
          await module.init();
        }
      } catch (e3) {
        {
          throw e3;
        }
      }
    })());
  }
  /**
   * @param {Request} request
   * @param {import('types').RequestOptions} options
   */
  async respond(request, options2) {
    return respond(request, this.#options, this.#manifest, {
      ...options2,
      error: false,
      depth: 0
    });
  }
};

// .svelte-kit/cloudflare-tmp/manifest.js
var manifest = (() => {
  function __memo(fn) {
    let value;
    return () => value ??= value = fn();
  }
  return {
    appDir: "_app",
    appPath: "_app",
    assets: /* @__PURE__ */ new Set(["favicon.svg"]),
    mimeTypes: { ".svg": "image/svg+xml" },
    _: {
      client: { start: "_app/immutable/entry/start._mm83_Cp.js", app: "_app/immutable/entry/app.BIvSsVTe.js", imports: ["_app/immutable/entry/start._mm83_Cp.js", "_app/immutable/chunks/Z-QoULFV.js", "_app/immutable/chunks/UhH-2GMu.js", "_app/immutable/chunks/DotA6MXx.js", "_app/immutable/chunks/B-UrQ5_i.js", "_app/immutable/entry/app.BIvSsVTe.js", "_app/immutable/chunks/UhH-2GMu.js", "_app/immutable/chunks/CELniAmD.js"], stylesheets: [], fonts: [], uses_env_dynamic_public: false },
      nodes: [
        __memo(() => Promise.resolve().then(() => (init__(), __exports))),
        __memo(() => Promise.resolve().then(() => (init__2(), __exports2))),
        __memo(() => Promise.resolve().then(() => (init__3(), __exports3))),
        __memo(() => Promise.resolve().then(() => (init__4(), __exports4))),
        __memo(() => Promise.resolve().then(() => (init__5(), __exports5))),
        __memo(() => Promise.resolve().then(() => (init__6(), __exports6))),
        __memo(() => Promise.resolve().then(() => (init__7(), __exports7))),
        __memo(() => Promise.resolve().then(() => (init__8(), __exports8)))
      ],
      remotes: {},
      routes: [
        {
          id: "/",
          pattern: /^\/$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 2 },
          endpoint: null
        },
        {
          id: "/dashboard",
          pattern: /^\/dashboard\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 3 },
          endpoint: null
        },
        {
          id: "/payment/purchase",
          pattern: /^\/payment\/purchase\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 5 },
          endpoint: null
        },
        {
          id: "/payment/[id]",
          pattern: /^\/payment\/([^/]+?)\/?$/,
          params: [{ "name": "id", "optional": false, "rest": false, "chained": false }],
          page: { layouts: [0], errors: [1], leaf: 4 },
          endpoint: null
        },
        {
          id: "/task/[id]",
          pattern: /^\/task\/([^/]+?)\/?$/,
          params: [{ "name": "id", "optional": false, "rest": false, "chained": false }],
          page: { layouts: [0], errors: [1], leaf: 6 },
          endpoint: null
        },
        {
          id: "/topup",
          pattern: /^\/topup\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 7 },
          endpoint: null
        }
      ],
      prerendered_routes: /* @__PURE__ */ new Set([]),
      matchers: async () => {
        return {};
      },
      server_assets: {}
    }
  };
})();
var prerendered = /* @__PURE__ */ new Set([]);
var base_path = "";

// .svelte-kit/cloudflare-tmp/_worker.js
async function e(e3, t2) {
  let n2 = "string" != typeof t2 && "HEAD" === t2.method;
  n2 && (t2 = new Request(t2, { method: "GET" }));
  let r3 = await e3.match(t2);
  return n2 && r3 && (r3 = new Response(null, r3)), r3;
}
function t(e3, t2, n2, o2) {
  return ("string" == typeof t2 || "GET" === t2.method) && r(n2) && (n2.headers.has("Set-Cookie") && (n2 = new Response(n2.body, n2)).headers.append("Cache-Control", "private=Set-Cookie"), o2.waitUntil(e3.put(t2, n2.clone()))), n2;
}
var n = /* @__PURE__ */ new Set([200, 203, 204, 300, 301, 404, 405, 410, 414, 501]);
function r(e3) {
  if (!n.has(e3.status)) return false;
  if (~(e3.headers.get("Vary") || "").indexOf("*")) return false;
  let t2 = e3.headers.get("Cache-Control") || "";
  return !/(private|no-cache|no-store)/i.test(t2);
}
function o(n2) {
  return async function(r3, o2) {
    let a = await e(n2, r3);
    if (a) return a;
    o2.defer((e3) => {
      t(n2, r3, e3, o2);
    });
  };
}
var s2 = caches.default;
var c = t.bind(0, s2);
var r2 = e.bind(0, s2);
var e2 = o.bind(0, s2);
var server = new Server(manifest);
var app_path = `/${manifest.appPath}`;
var immutable = `${app_path}/immutable/`;
var version_file = `${app_path}/version.json`;
var worker = {
  async fetch(req, env, context) {
    await server.init({ env });
    let pragma = req.headers.get("cache-control") || "";
    let res = !pragma.includes("no-cache") && await r2(req);
    if (res) return res;
    let { pathname, search } = new URL(req.url);
    try {
      pathname = decodeURIComponent(pathname);
    } catch {
    }
    const stripped_pathname = pathname.replace(/\/$/, "");
    let is_static_asset = false;
    const filename = stripped_pathname.slice(base_path.length + 1);
    if (filename) {
      is_static_asset = manifest.assets.has(filename) || manifest.assets.has(filename + "/index.html") || filename in manifest._.server_assets || filename + "/index.html" in manifest._.server_assets;
    }
    let location = pathname.at(-1) === "/" ? stripped_pathname : pathname + "/";
    if (is_static_asset || prerendered.has(pathname) || pathname === version_file || pathname.startsWith(immutable)) {
      res = await env.ASSETS.fetch(req);
    } else if (location && prerendered.has(location)) {
      if (search) location += search;
      res = new Response("", {
        status: 308,
        headers: {
          location
        }
      });
    } else {
      res = await server.respond(req, {
        // @ts-ignore
        platform: { env, context, caches, cf: req.cf },
        getClientAddress() {
          return req.headers.get("cf-connecting-ip");
        }
      });
    }
    pragma = res.headers.get("cache-control") || "";
    return pragma && res.status < 400 ? c(req, res, context) : res;
  }
};
var worker_default = worker;
export {
  worker_default as default
};
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=_worker.js.map
