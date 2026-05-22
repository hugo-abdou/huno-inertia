import type { Context } from "hono";
import type { Child } from "hono/jsx";

export type MaybePromise<T> = T | Promise<T>;
export type InertiaPropResolver<T = unknown> = (c: Context) => MaybePromise<T>;
export type InertiaProps = Record<string, InertiaPropInput>;

type InertiaPropInput<T = unknown> =
  | T
  | InertiaPropResolver<T>
  | InertiaProp<T>;

type ResolvedProps<TProps extends InertiaProps> = {
  [K in keyof TProps]: Awaited<ResolvedProp<TProps[K]>>;
};

type ResolvedProp<T> =
  T extends InertiaProp<infer TValue>
    ? TValue extends InertiaPropResolver<infer TResult>
      ? TResult
      : TValue
    : T extends InertiaPropResolver<infer TResult>
      ? TResult
      : T;

export type InertiaPage<TProps extends Record<string, unknown> = Record<string, unknown>> = {
  component: string;
  props: TProps;
  url: string;
  version: string | null;
  clearHistory: boolean;
  encryptHistory: boolean;
  deferredProps?: Record<string, string[]>;
  mergeProps?: string[];
  prependProps?: string[];
  deepMergeProps?: string[];
  matchPropsOn?: string[];
};

export type InertiaRootViewProps<
  TProps extends Record<string, unknown> = Record<string, unknown>,
> = {
  id: string;
  page: InertiaPage<TProps>;
  title: string;
};

export type InertiaRootView<
  TProps extends Record<string, unknown> = Record<string, unknown>,
> = (props: InertiaRootViewProps<TProps>) => MaybePromise<string | Child>;

export type InertiaOptions<TSharedProps extends InertiaProps = InertiaProps> = {
  id?: string;
  title?: string | ((page: InertiaPage) => string);
  version?: string | (() => MaybePromise<string | null>);
  rootView?: InertiaRootView;
  sharedProps?: TSharedProps | ((c: Context) => MaybePromise<TSharedProps>);
};

export type InertiaAdapter<TSharedProps extends InertiaProps = InertiaProps> = {
  render: <TPageProps extends InertiaProps = InertiaProps>(
    c: Context,
    component: string,
    props?: TPageProps,
  ) => Promise<Response>;
  redirect: (c: Context, location: string, status?: 302 | 303) => Response;
  location: (c: Context, url: string) => Response;
};

export type InertiaPropKind = "always" | "eager" | "lazy" | "optional";

export type InertiaProp<T = unknown> = {
  __inertia: true;
  kind: InertiaPropKind;
  value: T | InertiaPropResolver<T>;
};

const inertiaHeader = "X-Inertia";
const versionHeader = "X-Inertia-Version";
const locationHeader = "X-Inertia-Location";
const partialComponentHeader = "X-Inertia-Partial-Component";
const partialDataHeader = "X-Inertia-Partial-Data";
const partialExceptHeader = "X-Inertia-Partial-Except";

export const always = <T>(value: T | InertiaPropResolver<T>): InertiaProp<T> => ({
  __inertia: true,
  kind: "always",
  value,
});

export const lazy = <T>(value: T | InertiaPropResolver<T>): InertiaProp<T> => ({
  __inertia: true,
  kind: "lazy",
  value,
});

export const optional = <T>(value: T | InertiaPropResolver<T>): InertiaProp<T> => ({
  __inertia: true,
  kind: "optional",
  value,
});

export const createInertia = <TSharedProps extends InertiaProps = InertiaProps>(
  options: InertiaOptions<TSharedProps> = {},
): InertiaAdapter<TSharedProps> => {
  const id = options.id ?? "app";

  const render = async <TPageProps extends InertiaProps = InertiaProps>(
    c: Context,
    component: string,
    props: TPageProps = {} as TPageProps,
  ): Promise<Response> => {
    const version = await resolveVersion(options.version);
    const url = pageUrl(c);

    c.header("Vary", inertiaHeader);

    if (isInertiaRequest(c) && isVersionChanged(c, version)) {
      return c.body(null, 409, {
        [locationHeader]: url,
        Vary: inertiaHeader,
      });
    }

    const sharedProps =
      typeof options.sharedProps === "function"
        ? await options.sharedProps(c)
        : (options.sharedProps ?? ({} as TSharedProps));

    const page = {
      component,
      props: await resolveProps(c, component, { ...sharedProps, ...props }),
      url,
      version,
      clearHistory: false,
      encryptHistory: false,
    } satisfies InertiaPage;

    if (isInertiaRequest(c)) {
      return c.json(page, 200, {
        [inertiaHeader]: "true",
        Vary: inertiaHeader,
      });
    }

    return c.html(
      renderRootView(options.rootView ?? defaultRootView, {
        id,
        page,
        title: resolveTitle(page, options.title),
      }),
      200,
      { Vary: inertiaHeader },
    );
  };

  const redirect = (c: Context, location: string, status: 302 | 303 = 303): Response => {
    if (isInertiaRequest(c)) {
      return c.body(null, status, {
        Location: location,
        Vary: inertiaHeader,
      });
    }

    return c.redirect(location, status);
  };

  const location = (c: Context, url: string): Response =>
    c.body(null, 409, {
      [locationHeader]: url,
      Vary: inertiaHeader,
    });

  return { render, redirect, location };
};

const isInertiaRequest = (c: Context): boolean =>
  c.req.header(inertiaHeader)?.toLowerCase() === "true";

const isVersionChanged = (c: Context, currentVersion: string | null): boolean => {
  const requestVersion = c.req.header(versionHeader);

  return Boolean(currentVersion && requestVersion && requestVersion !== currentVersion);
};

const resolveVersion = async (
  version: InertiaOptions["version"],
): Promise<string | null> => {
  if (typeof version === "function") {
    return version();
  }

  return version ?? null;
};

const pageUrl = (c: Context): string => {
  const url = new URL(c.req.url);

  return `${url.pathname}${url.search}`;
};

const resolveProps = async (
  c: Context,
  component: string,
  props: InertiaProps,
): Promise<Record<string, unknown>> => {
  const only = parseHeaderList(c.req.header(partialDataHeader));
  const except = parseHeaderList(c.req.header(partialExceptHeader));
  const partialComponent = c.req.header(partialComponentHeader);
  const isPartial = partialComponent === component;
  const resolved: Record<string, unknown> = {};

  for (const [key, prop] of Object.entries(props)) {
    const normalized = normalizeProp(prop);

    if (!shouldIncludeProp(key, normalized.kind, isPartial, only, except)) {
      continue;
    }

    resolved[key] = await resolvePropValue(c, normalized.value);
  }

  return resolved;
};

const normalizeProp = (prop: InertiaPropInput): InertiaProp => {
  if (isInertiaProp(prop)) {
    return prop;
  }

  return {
    __inertia: true,
    kind: typeof prop === "function" ? "lazy" : "eager",
    value: prop,
  };
};

const shouldIncludeProp = (
  key: string,
  kind: InertiaPropKind,
  isPartial: boolean,
  only: Set<string>,
  except: Set<string>,
): boolean => {
  if (kind === "always") {
    return !except.has(key);
  }

  if (!isPartial) {
    return kind !== "optional";
  }

  if (except.size > 0) {
    return !except.has(key) && kind !== "optional";
  }

  if (only.size > 0) {
    return only.has(key);
  }

  return kind !== "optional";
};

const resolvePropValue = async (
  c: Context,
  value: InertiaProp["value"],
): Promise<unknown> => {
  if (typeof value === "function") {
    return (value as InertiaPropResolver)(c);
  }

  return value;
};

const isInertiaProp = (value: unknown): value is InertiaProp =>
  Boolean(
    value &&
      typeof value === "object" &&
      "__inertia" in value &&
      (value as InertiaProp).__inertia === true &&
      ["always", "eager", "lazy", "optional"].includes((value as InertiaProp).kind),
  );

const parseHeaderList = (value: string | undefined): Set<string> =>
  new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

const renderRootView = async (
  rootView: InertiaRootView,
  props: InertiaRootViewProps,
): Promise<string> => stringifyView(await rootView(props));

const stringifyView = async (view: string | Child): Promise<string> => {
  const resolved = await view;

  if (resolved === null || resolved === undefined || typeof resolved === "boolean") {
    return "";
  }

  if (Array.isArray(resolved)) {
    const parts = await Promise.all(resolved.map((child) => stringifyView(child)));

    return parts.join("");
  }

  if (typeof resolved === "number") {
    return String(resolved);
  }

  const stringified = resolved.toString();

  return stringified instanceof Promise ? stringified : String(stringified);
};

const defaultRootView = ({ id, page, title }: InertiaRootViewProps): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <div id="${escapeAttribute(id)}" data-page='${escapeAttribute(JSON.stringify(page))}'></div>
  </body>
</html>`;

const resolveTitle = (
  page: InertiaPage,
  titleOption: InertiaOptions["title"],
): string => {
  if (typeof titleOption === "function") {
    return titleOption(page);
  }

  return titleOption ?? page.component;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeAttribute = (value: string): string =>
  escapeHtml(value).replace(/'/g, "&#39;");
