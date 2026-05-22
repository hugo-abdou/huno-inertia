# Protocol Behavior

`hono-inertia` implements the server-side pieces needed for Inertia page
responses. It is designed around the current Inertia protocol documented at
https://inertiajs.com/the-protocol.

## Initial Visits

Requests without `X-Inertia: true` receive an HTML document. The document
contains the root element and the serialized page object in `data-page`.

## Inertia Visits

Requests with `X-Inertia: true` receive JSON:

```json
{
  "component": "Home",
  "props": {},
  "url": "/",
  "version": "asset-v1",
  "clearHistory": false,
  "encryptHistory": false
}
```

The response includes:

- `X-Inertia: true`
- `Vary: X-Inertia`

## Asset Versions

If the request sends `X-Inertia-Version` and it does not match the configured
server version, the adapter returns:

- status `409`
- `X-Inertia-Location` set to the current URL

## Partial Reloads

Partial reloads are applied only when `X-Inertia-Partial-Component` matches the
rendered component.

The adapter supports:

- `X-Inertia-Partial-Data`
- `X-Inertia-Partial-Except`

If both are present, `X-Inertia-Partial-Except` takes precedence.

## Redirects

Internal redirects use the `Location` header. External redirects use `409` with
`X-Inertia-Location`.

See https://inertiajs.com/redirects for the upstream behavior.
