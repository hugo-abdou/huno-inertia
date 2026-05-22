---
layout: home

hero:
  name: hono-inertia
  text: Ship Inertia apps on Hono with confidence
  tagline: A small, typed server-side adapter for rendering Inertia pages, resolving lazy props, handling partial reloads, and returning protocol-correct redirects from any Hono runtime.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View Examples
      link: /examples
    - theme: alt
      text: API Reference
      link: /api
  image:
    src: /hono-inertia-banner.png
    alt: hono-inertia banner

features:
  - icon: ⚡
    title: Runtime Friendly
    details: Built around Hono Context responses, so the same adapter shape works across Hono-supported runtimes.
  - icon: 🧩
    title: Typed Page Props
    details: Resolve plain, lazy, always, and optional props with predictable behavior for full visits and partial reloads.
  - icon: 🛡️
    title: Protocol Covered
    details: Handles Inertia headers, asset-version mismatches, external locations, back redirects, and 303 form redirects.
---
