# API Reference

## `createInertia(options?)`

Creates an adapter instance.

```ts
const inertia = createInertia({
  id: "app",
  title: (page) => page.component,
  version: "asset-v1",
  rootView: RootView,
  sharedProps: { appName: "My app" },
});
```

### Options

- `id`: root element id. Defaults to `app`.
- `title`: static title or title resolver.
- `version`: static or async asset version.
- `rootView`: custom string or Hono JSX root view.
- `sharedProps`: static or request-aware shared props.

## `inertia.render(c, component, props?)`

Returns the correct response for the request:

- HTML root view for normal visits.
- Inertia JSON page for requests with `X-Inertia: true`.
- `409` with `X-Inertia-Location` when the asset version changed.

```ts
return inertia.render(c, "Users/Index", {
  users: await getUsers(),
});
```

## `inertia.redirect(c, location, status?)`

Returns a normal Hono redirect for non-Inertia requests and an Inertia redirect
for Inertia requests. The default status is `303`.

```ts
return inertia.redirect(c, "/dashboard");
```

## `inertia.location(c, url)`

Returns an Inertia external redirect response:

```ts
return inertia.location(c, "https://example.com");
```

The response status is `409` and the target is sent in `X-Inertia-Location`.

## Prop Helpers

- `always(value)`: include on full and partial visits unless excluded.
- `lazy(value)`: resolve only when included in the response.
- `optional(value)`: include only when explicitly requested by a partial reload.

## Exported Types

- `InertiaAdapter`
- `InertiaOptions`
- `InertiaPage`
- `InertiaProp`
- `InertiaPropKind`
- `InertiaProps`
- `InertiaPropResolver`
- `InertiaRootView`
- `InertiaRootViewProps`
