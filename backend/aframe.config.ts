import { defineConfig } from "@aklinker1/aframe";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [vue(), tailwindcss()],
    server: {
      proxy: {
        "/ask-ai.js": {
          target: `http://localhost:3001`,
          changeOrigin: true,
        },
      },
    },
  },
});
