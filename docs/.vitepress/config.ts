import { defineConfig } from "vitepress";

export default defineConfig({
  title: "hono-inertia",
  description: "Inertia.js server-side adapter for Hono",
  base: process.env.DOCS_BASE ?? "/",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: "https://hugo-abdou.github.io/hono-inertia/",
  },
  head: [
    ["meta", { name: "author", content: "hono-inertia contributors" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "hono-inertia" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ],
  themeConfig: {
    search: {
      provider: "local",
    },
    nav: [
      { text: "Guide", link: "/getting-started" },
      { text: "API", link: "/api" },
      { text: "Blog", link: "/blog/" },
      { text: "Examples", link: "/examples" },
    ],
    sidebar: [
      {
        text: "Blog",
        items: [
          { text: "All Posts", link: "/blog/" },
          { text: "Inertia with Hono", link: "/blog/inertia-with-hono" },
          { text: "Laravel-Style Root Views", link: "/blog/laravel-style-root-views" },
          { text: "Partial Reloads", link: "/blog/inertia-partial-reloads-hono" },
        ],
      },
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Root Views", link: "/root-views" },
          { text: "Props", link: "/props" },
          { text: "Redirects", link: "/redirects" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "API", link: "/api" },
          { text: "Protocol", link: "/protocol" },
          { text: "Testing", link: "/testing" },
          { text: "Examples", link: "/examples" },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/hugo-abdou/hono-inertia" }],
  },
});
