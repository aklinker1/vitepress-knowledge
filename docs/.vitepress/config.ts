import { defineConfig } from "vitepress";
import knowledge from "../../plugin/src";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VitePress Knowledge",
  description: "Generate knowledge files for LLMs",
  extends: knowledge({
    serverUrl: "http://localhost:3000",
    paths: {
      "/": "docs",
      "/api/": "api-reference",
    },
  }),

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
