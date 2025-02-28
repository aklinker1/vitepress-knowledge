import { Elysia, t } from "elysia";
import env from "../utils/env";
import askAiJsTemplate from "../assets/ask-ai.js" with { type: "text" };
import { applyAppTemplateVars } from "../utils/template-vars.js";

const description = `
Get the JavaScript responsible for adding the "Ask AI" button and chat window to your VitePress site.

\`\`\`html
<script defer async src="https://chat.mydocs.com"></script>
\`\`\`,
`.trim();

const js = applyAppTemplateVars(askAiJsTemplate as string);

export const askAiRoute = new Elysia().all(
  "/ask-ai.js",
  async ({ set }) => {
    set.headers["content-type"] = "application/javascript";
    return js;
  },
  {
    detail: { description },
    response: {
      200: t.String({
        description: 'JS for display "Ask AI" button and chat window.',
      }),
    },
  },
);
