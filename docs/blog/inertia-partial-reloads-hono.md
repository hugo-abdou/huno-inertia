---
title: Partial Reloads with Inertia and Hono
description: Use lazy, optional, and always props to control partial reload payloads in hono-inertia.
head:
  - - meta
    - property: og:title
      content: Partial Reloads with Inertia and Hono
  - - meta
    - property: og:description
      content: Use lazy, optional, and always props to control partial reload payloads in hono-inertia.
---

# Partial Reloads with Inertia and Hono

Inertia partial reloads let the client ask the server for only part of a page's
props. This is useful for pages with expensive data, filters, or optional
sections.

`hono-inertia` supports three prop helpers:

```ts
import { always, lazy, optional } from "hono-inertia";

app.get("/reports", (c) => {
  return inertia.render(c, "Reports/Index", {
    filters: always(() => getFilters(c)),
    reports: lazy(() => loadReports(c)),
    auditLog: optional(() => loadAuditLog(c)),
  });
});
```

## Lazy Props

Functions are lazy by default. They are resolved on full page responses, but on
partial reloads they are only resolved when requested.

```ts
reports: lazy(() => loadReports(c))
```

## Optional Props

Optional props are excluded until explicitly requested by a partial reload.

```ts
auditLog: optional(() => loadAuditLog(c))
```

## Always Props

Always props are included in partial reloads unless the request explicitly
excludes them.

```ts
filters: always(() => getFilters(c))
```

This gives you a small API for controlling page payload size without changing
your route structure.

See the [props guide](/props) for the full behavior.
