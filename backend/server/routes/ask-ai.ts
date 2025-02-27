import { Elysia, t } from "elysia";
import * as env from "../utils/env";
import askAiJsTemplate from "../assets/ask-ai.js" with { type: "text" };

const description = `
Get the JavaScript responsible for adding the "Ask AI" button and chat window to your VitePress site.

\`\`\`html
<script defer async src="https://chat.mydocs.com"></script>
\`\`\`,
`.trim();

const js = (askAiJsTemplate as string)
  .replaceAll("{{ WELCOME_MESSAGE }}", env.WELCOME_MESSAGE)
  .replaceAll("{{ APP_NAME }}", env.APP_NAME)
  .replaceAll("{{ ASSISTANT_ICON_URL }}", env.ASSISTANT_ICON_URL)
  .replaceAll("{{ SERVER_URL }}", env.SERVER_URL);

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
