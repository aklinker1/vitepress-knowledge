import { fetchStatic } from "@aklinker1/aframe/server";
import { Elysia } from "elysia";
import { applyCors } from "./plugins/apply-cors";
import { requestLogger } from "./plugins/request-logger";
import { apiRoute } from "./routes/api";
import { askAiRoute } from "./routes/ask-ai";
import { privacyPolicyRoute } from "./routes/privacy-policy";
import { swaggerRoute } from "./routes/swagger";
import { applyAppTemplateVars } from "./utils/template-vars";

const app = new Elysia()
  .use(requestLogger)
  .use(swaggerRoute)
  .use(applyCors)
  .use(askAiRoute)
  .use(privacyPolicyRoute)
  .use(apiRoute)
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

export type app = typeof app;
