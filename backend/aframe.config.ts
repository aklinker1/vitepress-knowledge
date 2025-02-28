import { defineConfig } from "@aklinker1/aframe";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv, Plugin } from "vite";

/** Apply template variables just like production server */
function applyTemplateVars(): Plugin {
  let mode = "development";
  return {
    apply: "serve",
    name: "dev-env",
    configResolved(config) {
      mode = config.mode;
    },
    async transformIndexHtml(html) {
      const env = loadEnv(mode, process.cwd(), "");
      const { applyAppTemplateVars } = await import(
        "./server/utils/template-vars"
      );
      console.log(applyAppTemplateVars(html));
      return applyAppTemplateVars(html);
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [vue(), tailwindcss(), applyTemplateVars()],
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
