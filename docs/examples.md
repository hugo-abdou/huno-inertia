# Examples

The repository includes a basic Hono example in `examples/basic`.

## Run the Example

```sh
bun install
bun run dev
```

Open:

```txt
http://localhost:3000
```

## Example Layout

```txt
examples/basic/src/index.ts
examples/basic/src/inertia-view.tsx
```

The example imports from the package source:

```ts
import { createInertia } from "../../../src";
```

When consuming the published package, use:

```ts
import { createInertia } from "hono-inertia";
```

## Client Setup

This package does not install or configure an Inertia client. Add the official
Inertia client package for your frontend framework and mount it to the same root
element id used by your root view.

Common client packages:

- `@inertiajs/react`
- `@inertiajs/vue3`
- `@inertiajs/svelte`
