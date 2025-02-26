import { Elysia, t } from "elysia";
import privacyPolicy from "../ assets/privacy-policy.md" with { type: "text" };

const description = `
The server hosts a copy of \`vitepress-knowledge\`'s privacy policy at this endpoint.
`.trim();

export const privacyPolicyRoute = new Elysia().get(
  "/privacy-policy",
  privacyPolicy,
  {
    detail: { description },
    response: {
      200: t.String({
        description: "The privacy policy as a markdown document",
      }),
    },
  },
);
