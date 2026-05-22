# Testing

The package test suite uses Bun's test runner and Hono's `app.request()` helper.

## Commands

```sh
bun run typecheck
bun run test
bun run build
```

## What Is Covered

The test suite covers:

- Initial HTML responses.
- Inertia JSON responses.
- Asset version mismatch responses.
- Internal redirects.
- External redirects.
- Shared props.
- Lazy props.
- Optional props.
- Always props.
- Partial reload include/exclude behavior.
- Safe default root view escaping.
- Custom TSX root view rendering.

## Writing App Tests

Use request headers to simulate Inertia visits:

```ts
const res = await app.request("/users", {
  headers: {
    "X-Inertia": "true",
    "X-Inertia-Partial-Component": "Users/Index",
    "X-Inertia-Partial-Data": "users",
  },
});
```

Then assert on the returned page object:

```ts
const page = await res.json();
expect(page.component).toBe("Users/Index");
expect(page.props.users).toBeDefined();
```
