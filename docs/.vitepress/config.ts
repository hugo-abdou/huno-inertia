import { defineConfig } from "vitepress";

export default defineConfig({
  title: "hono-inertia",
  description: "Inertia.js server-side adapter for Hono",
  base: process.env.DOCS_BASE ?? "/",
  cleanUrls: true,
  themeConfig: {
    search: {
      provider: "local",
    },
    nav: [
      { text: "Guide", link: "/getting-started" },
      { text: "API", link: "/api" },
      { text: "Examples", link: "/examples" },
    ],
    sidebar: [
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
    socialLinks: [
      { icon: "github", link: "https://github.com/your-name/hono-inertia" },
    ],
  },
});
