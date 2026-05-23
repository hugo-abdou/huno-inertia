import { defineConfig } from "vitepress";

const repo = "https://github.com/hugo-abdou/hono-inertia";
const site = "https://hugo-abdou.github.io/hono-inertia";

export default defineConfig({
  lang: "en-US",
  title: "hono-inertia",
  titleTemplate: ":title - hono-inertia",
  description: "A small Inertia.js server-side adapter for Hono with typed props, root views, partial reloads, and protocol-correct redirects.",
  base: process.env.DOCS_BASE ?? "/",
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark",
    },
  },
  sitemap: {
    hostname: site,
  },
  head: [
    ["meta", { name: "author", content: "hono-inertia contributors" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "hono-inertia" }],
    ["meta", { property: "og:image", content: `${site}/hono-inertia-banner.webp` }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:image", content: `${site}/hono-inertia-banner.webp` }],
  ],
  themeConfig: {
    siteTitle: "hono-inertia",
    search: {
      provider: "local",
    },
    nav: [
      { text: "Docs", link: "/getting-started" },
      { text: "Examples", link: "/examples" },
      { text: "API", link: "/api" },
      { text: "Blog", link: "/blog/" },
    ],
    sidebar: {
      "/blog/": [
        {
          text: "Blog",
          items: [
            { text: "All Posts", link: "/blog/" },
            { text: "Inertia with Hono", link: "/blog/inertia-with-hono" },
            { text: "Laravel-Style Root Views", link: "/blog/laravel-style-root-views" },
            { text: "Partial Reloads", link: "/blog/inertia-partial-reloads-hono" },
          ],
        },
      ],
      "/": [
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
    },
    socialLinks: [
      { icon: "github", link: repo },
      { icon: "linkedin", link: "https://www.linkedin.com/in/moumen-abdelghafour-550679393" },
    ],
    editLink: {
      pattern: `${repo}/edit/main/docs/:path`,
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026-present Hugo Abdou.",
    },
  },
  transformHead({ pageData }) {
    const head: Array<[string, Record<string, string>]> = [];

    if (pageData.relativePath !== "index.md") {
      head.push([
        "link",
        {
          rel: "alternate",
          type: "text/markdown",
          title: "Markdown source",
          href: `${repo}/raw/main/docs/${pageData.relativePath}`,
        },
      ]);
    }

    return head;
  },
});
