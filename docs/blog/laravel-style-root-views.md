---
title: Laravel-Style Root Views in Hono
description: Use hono-inertia root views to customize the initial HTML document for Inertia pages.
head:
  - - meta
    - property: og:title
      content: Laravel-Style Root Views in Hono
  - - meta
    - property: og:description
      content: Use hono-inertia root views to customize the initial HTML document for Inertia pages.
---

# Laravel-Style Root Views in Hono

In Laravel, Inertia apps usually have a root Blade view. That view renders the
HTML document, includes the app assets, and provides the initial `data-page`
payload.

`hono-inertia` uses the same idea for Hono. The adapter has a safe default root
view, but you can provide your own TSX view when you need custom markup.

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
      <script type="module" src="/assets/app.js" />
    </body>
  </html>
);
```

Then pass it into `createInertia()`:

```ts
const inertia = createInertia({
  rootView: RootView,
  title: (page) => `${page.component} - My app`,
});
```

The important part is the root element:

```tsx
<div id={id} data-page={JSON.stringify(page)} />
```

The Inertia client reads that payload during the initial page load.

See the [root views guide](/root-views) for more examples.
