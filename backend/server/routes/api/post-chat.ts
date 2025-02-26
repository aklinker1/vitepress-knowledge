import { Elysia, t } from "elysia";
import { getKnowledgeFiles } from "../../utils/knowledge-files";
import * as env from "../../utils/env";
import { models } from "../../plugins/models";
import { decorateContext } from "../../plugins/decorate-context";

export const postChatRoute = new Elysia()
  .use(models)
  .use(decorateContext)
  .post(
    "/chat",
    async ({ body, error, aiModels, serviceAuths }) => {
      const model = aiModels.find((model) => model.enum === body.model);
      if (!model) return error(400, `No model found with enum "${body.model}"`);
      if (!model.enabled)
        return error(400, `Model "${body.model}" not enabled`);

      const auth = serviceAuths.find((auth) =>
        auth.models.find((modelRegex) => modelRegex.test(model.enum)),
      );
      if (!auth) return error(400, `No auth found for model "${model.enum}"`);
      if (!auth.secret)
        return error(
          400,
          `Auth not provided for service "${auth.enum}". Did you forget to set the "${auth.env}" environment variable?`,
        );

      const knowledge = await getKnowledgeFiles(env.DOCS_URL);

      const systemPrompt = env.SYSTEM_PROMPT
        // Prompt vars:
        .replaceAll("{{ APP_NAME }}", env.APP_NAME)
        .replaceAll("{{ SERVER_URL }}", env.SERVER_URL)
        .replaceAll("{{ DOMAIN }}", new URL(env.SERVER_URL).host)
        .replaceAll("{{ KNOWLEDGE }}", knowledge.files.join("\n\n"));

      switch (auth.enum) {
        case "anthropic": {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-api-key": auth.secret,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: model.enum,
              max_tokens: 1024,
              system: [
                {
                  type: "text",
                  text: systemPrompt,
                  cache_control: { type: "ephemeral" },
                },
              ],
              messages: body.messages,
            }),
          });
          const json = await res.json();
          return [
            ...body.messages,
            {
              role: "assistant",
              content: json.content[0].text,
            },
          ];
        }
        case "google": {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model.enum}:generateContent?key=${auth.secret}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                generationConfig: {
                  temperature: 1,
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 8192,
                  responseMimeType: "text/plain",
                },
                systemInstruction: {
                  role: "user",
                  parts: [{ text: systemPrompt }],
                },
                contents: body.messages.map((message) => ({
                  role: message.role === "user" ? "user" : "model",
                  parts: [{ text: message.content }],
                })),
              }),
            },
          );
          const json = await res.json();
          return [
            ...body.messages,
            {
              role: "assistant",
              content: json.candidates[0].content.parts[0].text,
            },
          ];
        }
      }

      // @ts-ignore
      throw Error("TODO: Implement POST /api/chat for " + auth.enum);
    },
    {
      detail: {
        description:
          "Send messages to an AI model and return with the response.",
      },
      body: "PostChatRequestBody",
      response: {
        200: "ChatMessage[]",
        400: t.String({ description: "Error message." }),
      },
    },
  );
