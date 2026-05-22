---
title: Using Inertia.js with Hono
description: Learn how hono-inertia connects Hono routes to Inertia page responses.
head:
  - - meta
    - property: og:title
      content: Using Inertia.js with Hono
  - - meta
    - property: og:description
      content: Learn how hono-inertia connects Hono routes to Inertia page responses.
---

# Using Inertia.js with Hono

Hono is a small, fast web framework that works across modern JavaScript
runtimes. Inertia.js lets server routes render client-side pages without
building a traditional JSON API for every screen.

`hono-inertia` connects those two pieces. A Hono route calls `inertia.render()`
with a component name and props. The adapter decides whether to return the
initial HTML shell or an Inertia JSON page response.

```ts
app.get("/dashboard", (c) => {
  return inertia.render(c, "Dashboard", {
    user: { name: "Ada" },
  });
});
```

For a normal browser visit, the response is HTML. For an Inertia visit with
`X-Inertia: true`, the response is a page object:

```json
{
  "component": "Dashboard",
  "props": {
    "user": {
      "name": "Ada"
    }
  },
  "url": "/dashboard",
  "version": "asset-v1",
  "clearHistory": false,
  "encryptHistory": false
}
```

This keeps routing and page data close to your server code while still letting
your frontend use React, Vue, or Svelte through the official Inertia clients.

## Why Use This Pattern?

The pattern is useful when your app is page-oriented and server-driven:

- Routes own data loading.
- The client owns the interactive UI.
- Redirects and validation can follow normal server behavior.
- You avoid maintaining a separate API for every page.

For more details, start with the [getting started guide](/getting-started).
