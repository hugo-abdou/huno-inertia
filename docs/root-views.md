# Root Views

The root view is the HTML shell returned for first-page visits. It should
include a single element with the configured `id` and a `data-page` attribute
containing the serialized Inertia page object.

## Default Root View

If no root view is provided, `hono-inertia` renders a safe built-in HTML
document:

```html
<div id="app" data-page="..."></div>
```

The fallback escapes the title, root id, and serialized page data.

## TSX Root View

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

```ts
const inertia = createInertia({
  rootView: RootView,
});
```

## String Root View

Root views can return a string if your app uses a template function:

```ts
const inertia = createInertia({
  rootView: ({ id, page, title }) => `<!doctype html>
<html>
  <head><title>${title}</title></head>
  <body><div id="${id}" data-page='${JSON.stringify(page)}'></div></body>
</html>`,
});
```

When returning a string, escape user-controlled values yourself.
