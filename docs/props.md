# Props

Props are the data sent to the client as part of the Inertia page object.

```ts
return inertia.render(c, "Users/Index", {
  users: await getUsers(),
  filters: getFilters(c),
});
```

## Shared Props

Shared props are merged into every page:

```ts
const inertia = createInertia({
  sharedProps: {
    appName: "My app",
  },
});
```

Page props override shared props with the same key.

## Lazy Props

Functions are treated as lazy props:

```ts
return inertia.render(c, "Reports", {
  report: () => loadReport(),
});
```

They are resolved for full page responses and only resolved for partial reloads
when included.

## `lazy()`

Use `lazy()` to make intent explicit:

```ts
return inertia.render(c, "Reports", {
  report: lazy(() => loadReport()),
});
```

## `optional()`

Optional props are excluded by default and included only when requested by a
partial reload.

```ts
return inertia.render(c, "Users/Index", {
  auditLog: optional(() => loadAuditLog()),
});
```

## `always()`

Always props are included on full visits and partial reloads unless the request
explicitly excludes them with `X-Inertia-Partial-Except`.

```ts
return inertia.render(c, "Dashboard", {
  flash: always(() => getFlash(c)),
});
```

## Partial Reloads

The adapter reads:

- `X-Inertia-Partial-Component`
- `X-Inertia-Partial-Data`
- `X-Inertia-Partial-Except`

When both include and exclude headers are present, `X-Inertia-Partial-Except`
takes precedence.
