import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import {
  always,
  createInertia,
  lazy,
  optional,
  type InertiaRootViewProps,
} from "../src";

const createApp = () => {
  const app = new Hono();
  const calls = {
    lazy: 0,
  };
  const inertia = createInertia({
    version: "asset-v1",
    title: (page) => `Title: ${page.component}`,
    sharedProps: {
      shared: "shared value",
      sharedLazy: lazy(() => {
        calls.lazy += 1;
        return "shared lazy value";
      }),
    },
  });

  app.get("/", (c) =>
    inertia.render(c, "Home", {
      message: "hello",
      eager: "eager value",
      alwaysValue: always("always value"),
      lazyValue: lazy(() => {
        calls.lazy += 1;
        return "lazy value";
      }),
      optionalValue: optional("optional value"),
    }),
  );

  app.post("/internal", (c) => inertia.redirect(c, "/"));
  app.get("/external", (c) => inertia.location(c, "https://example.com/out"));

  return { app, calls };
};

describe("createInertia", () => {
  test("renders the initial HTML response", async () => {
    const { app } = createApp();
    const res = await app.request("/");
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(res.headers.get("vary")).toBe("X-Inertia");
    expect(html).toContain("<!doctype html>");
    expect(html).toContain('id="app"');
    expect(html).toContain("data-page=");
    expect(html).toContain("Title: Home");
  });

  test("renders an Inertia JSON page response", async () => {
    const { app } = createApp();
    const res = await app.request("/", {
      headers: { "X-Inertia": "true" },
    });
    const page = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get("x-inertia")).toBe("true");
    expect(res.headers.get("vary")).toBe("X-Inertia");
    expect(page.component).toBe("Home");
    expect(page.props).toMatchObject({
      shared: "shared value",
      message: "hello",
      eager: "eager value",
      alwaysValue: "always value",
      lazyValue: "lazy value",
    });
    expect(page.props.optionalValue).toBeUndefined();
    expect(page.version).toBe("asset-v1");
  });

  test("returns 409 when the Inertia asset version changed", async () => {
    const { app } = createApp();
    const res = await app.request("/", {
      headers: {
        "X-Inertia": "true",
        "X-Inertia-Version": "asset-v0",
      },
    });

    expect(res.status).toBe(409);
    expect(res.headers.get("x-inertia-location")).toBe("/");
  });

  test("redirect helper uses 303 for Inertia requests", async () => {
    const { app } = createApp();
    const res = await app.request("/internal", {
      method: "POST",
      headers: { "X-Inertia": "true" },
    });

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/");
    expect(res.headers.get("vary")).toBe("X-Inertia");
  });

  test("location helper returns an external redirect response", async () => {
    const { app } = createApp();
    const res = await app.request("/external", {
      headers: { "X-Inertia": "true" },
    });

    expect(res.status).toBe(409);
    expect(res.headers.get("x-inertia-location")).toBe("https://example.com/out");
    expect(res.headers.get("vary")).toBe("X-Inertia");
  });

  test("partial reloads include requested props and always props", async () => {
    const { app } = createApp();
    const res = await app.request("/", {
      headers: {
        "X-Inertia": "true",
        "X-Inertia-Partial-Component": "Home",
        "X-Inertia-Partial-Data": "lazyValue,optionalValue",
      },
    });
    const page = await res.json();

    expect(page.props).toEqual({
      alwaysValue: "always value",
      lazyValue: "lazy value",
      optionalValue: "optional value",
    });
  });

  test("partial except takes precedence over partial data", async () => {
    const { app } = createApp();
    const res = await app.request("/", {
      headers: {
        "X-Inertia": "true",
        "X-Inertia-Partial-Component": "Home",
        "X-Inertia-Partial-Data": "lazyValue",
        "X-Inertia-Partial-Except": "lazyValue",
      },
    });
    const page = await res.json();

    expect(page.props.lazyValue).toBeUndefined();
    expect(page.props.optionalValue).toBeUndefined();
    expect(page.props.alwaysValue).toBe("always value");
    expect(page.props.message).toBe("hello");
  });

  test("does not resolve lazy props that are excluded from partial reloads", async () => {
    const { app, calls } = createApp();
    await app.request("/", {
      headers: {
        "X-Inertia": "true",
        "X-Inertia-Partial-Component": "Home",
        "X-Inertia-Partial-Data": "message",
      },
    });

    expect(calls.lazy).toBe(0);
  });

  test("escapes default root view output", async () => {
    const app = new Hono();
    const inertia = createInertia({
      id: `app"'<>`,
      title: `A "bad" <title>`,
    });

    app.get("/", (c) =>
      inertia.render(c, "Home", {
        payload: `"</div><script>alert("x")</script>`,
      }),
    );

    const res = await app.request("/");
    const html = await res.text();

    expect(html).toContain("A &quot;bad&quot; &lt;title&gt;");
    expect(html).toContain(`id="app&quot;&#39;&lt;&gt;"`);
    expect(html).not.toContain("</div><script>");
    expect(html).toContain("&lt;/div&gt;&lt;script&gt;");
  });

  test("renders a custom TSX root view", async () => {
    const RootView = ({ id, page, title }: InertiaRootViewProps) => (
      <html lang="en">
        <head>
          <title>{title}</title>
        </head>
        <body>
          <main id={id} data-page={JSON.stringify(page)}>
            Custom root
          </main>
        </body>
      </html>
    );
    const app = new Hono();
    const inertia = createInertia({
      rootView: RootView,
      title: "Custom title",
    });

    app.get("/", (c) => inertia.render(c, "Home", { message: "hello" }));

    const res = await app.request("/");
    const html = await res.text();

    expect(html).toContain("<main");
    expect(html).toContain("Custom root");
    expect(html).toContain("Custom title");
  });
});
