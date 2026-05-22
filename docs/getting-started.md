# Getting Started

`hono-inertia` is the server-side bridge between Hono and an Inertia client
application. It creates Inertia page objects and handles the request headers
used by Inertia visits.

## Install

```sh
bun add hono-inertia hono
```

or:

```sh
npm install hono-inertia hono
```

## Minimal Hono App

```ts
import { Hono } from "hono";
import { createInertia } from "hono-inertia";

const app = new Hono();
const inertia = createInertia();

app.get("/", (c) => {
  return inertia.render(c, "Home", {
    message: "Hello",
  });
});

export default app;
```

## Asset Versioning

Pass a stable version string so Inertia can force a full page reload after
deploys:

```ts
const inertia = createInertia({
  version: process.env.ASSET_VERSION ?? "dev",
});
```

The version can also be async:

```ts
const inertia = createInertia({
  version: async () => await readManifestHash(),
});
```

## Shared Props

Shared props are merged into every page response. Page props with the same key
override shared props.

```ts
const inertia = createInertia({
  sharedProps: {
    appName: "My app",
  },
});
```

Use a function when shared props need request context:

```ts
const inertia = createInertia({
  sharedProps: (c) => ({
    path: new URL(c.req.url).pathname,
  }),
});
```
