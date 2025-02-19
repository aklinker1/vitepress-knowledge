import { defineConfig } from "vitepress";
import knowledge from "vitepress-knowledge";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VitePress Knowledge",
  description: "Generate knowledge files for LLMs",
  extends: knowledge({
    paths: {
      "/": "docs",
      "/api/": "api-reference",
    },
  }),
  head: [
    [
      "script",
      {
        src: "https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js",
      },
    ],
    ["script", { defer: "true", async: "true", src: "http://localhost:5174" }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
