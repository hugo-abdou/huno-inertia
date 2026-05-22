# hono-inertia

![hono-inertia banner](https://hugo-abdou.github.io/hono-inertia/hono-inertia-banner.png)

A small server-side Inertia.js adapter for [Hono](https://hono.dev/).

It returns an HTML root view for first-page visits and Inertia page JSON for
requests with `X-Inertia: true`. It is framework-client agnostic: use it with
the Inertia React, Vue, or Svelte client in your frontend bundle.

## Install

```sh
bun add hono-inertia hono
```

```sh
npm install hono-inertia hono
```

## Quick Start

```ts
import { Hono } from "hono";
import { createInertia } from "hono-inertia";

const app = new Hono();
const inertia = createInertia({
  version: "asset-v1",
  sharedProps: {
    appName: "My app",
  },
});

app.get("/", (c) => {
  return inertia.render(c, "Home", {
    message: "Hello from Hono",
  });
});

export default app;
```

## Custom Root View

Use a TSX root view when you want a Laravel-style root template.

```tsx
import type { InertiaRootViewProps } from "hono-inertia";

export const RootView = ({ id, page, title }: InertiaRootViewProps) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
    </head>
    <body>
      <div id={id} data-page={JSON.stringify(page)} />
    </body>
  </html>
);
```

```ts
const inertia = createInertia({
  rootView: RootView,
  title: (page) => `${page.component} - My app`,
});
```

## Props

```ts
import { always, lazy, optional } from "hono-inertia";

app.get("/users", (c) =>
  inertia.render(c, "Users/Index", {
    users: lazy(() => loadUsers()),
    flash: always(() => getFlash(c)),
    filters: optional(() => getFilters(c)),
  }),
);
```

- Plain values are included on full visits.
- Functions are lazy and only resolved when included.
- `always()` is included on full and partial visits unless explicitly excluded.
- `optional()` is only included when requested by a partial reload.

## Redirects

```ts
app.post("/logout", (c) => inertia.redirect(c, "/"));
app.post("/profile", (c) => inertia.back(c));
app.get("/billing", (c) => inertia.location(c, "https://billing.example.com"));
```

`redirect()` and `back()` default to `303` for Inertia requests. `back()` uses
the `Referer` header and falls back to `/`. `location()` returns the Inertia
external redirect response: `409` with `X-Inertia-Location`.

## Documentation

- [Getting started](https://hugo-abdou.github.io/hono-inertia/getting-started)
- [Root views](https://hugo-abdou.github.io/hono-inertia/root-views)
- [API reference](https://hugo-abdou.github.io/hono-inertia/api)
- [Props](https://hugo-abdou.github.io/hono-inertia/props)
- [Redirects](https://hugo-abdou.github.io/hono-inertia/redirects)
- [Protocol behavior](https://hugo-abdou.github.io/hono-inertia/protocol)
- [Testing](https://hugo-abdou.github.io/hono-inertia/testing)
- [Examples](https://hugo-abdou.github.io/hono-inertia/examples)

## Development

```sh
bun install
bun run typecheck
bun run test
bun run build
bun run dev
```

The example server runs from `examples/basic`.

## Docs Site

View the docs in a browser with VitePress:

```sh
bun run docs:dev
```

Then open the local URL printed by VitePress, usually:

```txt
http://127.0.0.1:5173
```

Deploy the docs to GitHub Pages by enabling Pages in the repository settings
with **Build and deployment > Source > GitHub Actions**. The included workflow
builds the VitePress site and publishes `docs/.vitepress/dist`.
