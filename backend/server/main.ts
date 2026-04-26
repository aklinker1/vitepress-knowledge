import { fetchStatic } from "@aklinker1/aframe/server";
import { createApp } from "@aklinker1/zeta";
import { zodSchemaAdapter } from "@aklinker1/zeta/adapters/zod-schema-adapter";
import { applyAppTemplateVars } from "./utils/template-vars";
import { version } from "../shared/constants";
import dedent from "dedent";
import { assetApis } from "./apis/asset-apis";
import { modelApis } from "./apis/model-apis";
import { chatApis } from "./apis/chat-apis";
import { corsPlugin } from "./plugins/cors-plugin";
import { requestLoggerPlugin } from "./plugins/request-logger-plugin";

const apiApp = createApp({ prefix: "/api" }).use(modelApis).use(chatApis);

const app = createApp({
  openApi: {
    info: {
      title: "VitePress Knowledge Server",
      version,
      description: dedent`
        APIs used to power the _"Ask AI"_ button and chat.
      `,
    },
  },
  schemaAdapter: zodSchemaAdapter,
})
  .use(corsPlugin)
  .use(requestLoggerPlugin)
  .use(assetApis)
  .use(apiApp)
  .mount(
    fetchStatic({
      // Apply template vars to HTML files
      onFetch: async (path, file) => {
        if (path.includes(".html")) {
          const html = applyAppTemplateVars(await file.text());
          return new Response(html, {
            headers: {
              "content-type": file.type,
            },
          });
        }
      },
    }),
  );

export default app;

export type App = typeof app;
