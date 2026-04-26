import { createApp } from "@aklinker1/zeta";
// @ts-expect-error: Ignore lack of declaration file
import askAiJsTemplate from "../assets/ask-ai.js" with { type: "text" };
import privacyPolicy from "../assets/privacy-policy.md" with { type: "text" };
import { applyAppTemplateVars } from "../utils/template-vars.js";
import dedent from "dedent";
import z from "zod";

const js = applyAppTemplateVars(askAiJsTemplate as string);

export const assetApis = createApp()
  .get(
    "/ask-ai.js",
    {
      operationId: "getVitepressJs",
      summary: "Get VitePress JS",
      description: dedent`
      Get the JavaScript responsible for adding the "Ask AI" button and chat window to your VitePress site.

      \`\`\`html
      <script defer async src="https://chat.mydocs.com/ask-ai.js"></script>
      \`\`\`
    `,
      responses: z.string().meta({ contentType: "application/javascript" }),
    },
    () => js,
  )
  .get(
    "/privacy-policy",
    {
      operationId: "getPrivacyPolicy",
      responses: z.string().meta({ contentType: "text/markdown" }),
      description: dedent`
        The server hosts a copy of \`vitepress-knowledge\`'s privacy policy at this endpoint.
      `,
    },
    () => privacyPolicy,
  );
