import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { AiModel, AiModelEnum, ChatMessage } from "./models";
import { version } from "../package.json";
import {
  AVAILABLE_AI_MODELS,
  AI_MODEL_ENV_COLUMN_WIDTH,
  AI_MODEL_NAME_COLUMN_WIDTH,
  SERVICE_AUTH,
  SERVICE_AUTH_NAME_COLUMN_WIDTH,
  SERVICE_AUTH_ENV_COLUMN_WIDTH,
} from "./constants";
import pc from "picocolors";
import { consola } from "consola";
import { getKnowledgeFiles } from "./knowledge-files";
import cors from "@elysiajs/cors";
import * as env from "./env";
import { fetchStatic } from "@aklinker1/aframe/server";

consola.info("Starting server...");

function getRequestColor(method: string) {
  switch (method.toUpperCase()) {
    case "GET":
      return pc.blue;
    case "POST":
      return pc.green;
    case "PUT":
      return pc.yellow;
    case "DELETE":
      return pc.red;
    default:
      return pc.dim;
  }
}

const aiModels = AVAILABLE_AI_MODELS.map((model) => ({
  name: model.name,
  enum: model.enum,
  enabled: env[model.env],
}));

const serviceAuths = SERVICE_AUTH.map((auth) => ({
  ...auth,
  secret: process.env[auth.env],
}));

const js = Bun.file("public/index.js")
  .text()
  .then((template) =>
    template
      .replaceAll("{{ WELCOME_MESSAGE }}", env.WELCOME_MESSAGE)
      .replaceAll("{{ APP_NAME }}", env.APP_NAME)
      .replaceAll("{{ ASSISTANT_ICON_URL }}", env.ASSISTANT_ICON_URL)
      .replaceAll("{{ SERVER_URL }}", env.SERVER_URL),
  );
const privacyPolicy = Bun.file("public/privacy-policy.md").text();

let app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "VitePress Knowledge Server",
          version,
          description: 'APIs used to power the _"Ask AI"_ button and chat.',
        },
      },
    }),
  )
  .use(
    cors({
      origin: (ctx) => {
        const origin = ctx.headers.get("Origin") ?? "";
        consola.debug("CORS:", {
          origin,
          allowed: env.CORS_ORIGIN,
          headers: ctx.headers.toJSON(),
        });
        return env.CORS_ORIGIN.has(origin);
      },
    }),
  )
  .onBeforeHandle(({ path, request }) => {
    consola.info(
      `${pc.cyan("[http]")} ${getRequestColor(request.method)(request.method)} ${path}`,
    );
  })
  .get(
    "/",
    async () => {
      return new Response(await js, {
        headers: { "Content-Type": "application/javascript" },
      });
    },
    {
      detail: {
        description: [
          'Get the JavaScript responsible for adding the "Ask AI" button and chat window to your VitePress site.',
          "",
          "```html",
          '<script defer async src="https://chat.mydocs.com"></script>',
          "```",
        ].join("\n"),
      },
    },
  )
  .get("/privacy-policy", async () => await privacyPolicy, {
    detail: {
      description: [
        "The server hosts a copy of `vitepress-knowledge`'s privacy policy at this endpoint.",
      ].join("\n"),
    },
    response: {
      200: t.String({
        description: "The privacy policy as a markdown document",
      }),
    },
  })
  .get(
    "/api/models",
    ({ query }) => {
      if (query.filter === "all") return aiModels;
      const targetEnabled = query.filter === "enabled";
      return aiModels.filter((model) => model.enabled === targetEnabled);
    },
    {
      detail: {
        description: [
          "List models available to chat with.",
          "",
          "To enable a model, set the corresponding environment variable to true:",
          "| Model Name | Environment Variable |",
          "|------------|----------------------|",
          ...AVAILABLE_AI_MODELS.map(
            (model) => `| ${model.name} | \`${model.env}\` |`,
          ),
        ].join("\n"),
      },
      response: {
        200: t.Array(AiModel),
      },
      query: t.Object({
        filter: t.UnionEnum(["all", "enabled", "disabled"], {
          description:
            "Filter the list of models returned based on the `enabled` state.",
          default: "all",
        }),
      }),
    },
  )
  .post(
    "/api/chat",
    async ({ body, error }) => {
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
      body: t.Object({
        model: AiModelEnum,
        messages: t.Array(ChatMessage),
      }),
      response: {
        200: t.Array(ChatMessage),
        400: t.String({ description: "Error message." }),
      },
    },
  )
  .mount(fetchStatic);

consola.info("Resolved Environment Variables");
consola.info(`  ${pc.dim("PORT=")}${pc.cyan(env.PORT)}`);
consola.info(`  ${pc.dim("APP_NAME=")}${pc.cyan(env.APP_NAME)}`);
consola.info(`  ${pc.dim("SERVER_URL=")}${pc.cyan(env.SERVER_URL)}`);
consola.info(`  ${pc.dim("DOCS_URL=")}${pc.cyan(env.DOCS_URL)}`);
consola.info(
  `  ${pc.dim("CORS_ORIGIN=")}${pc.cyan([...env.CORS_ORIGIN].join(","))}`,
);
consola.info(
  `  ${pc.dim("ASSISTANT_ICON_URL=")}${pc.cyan(env.ASSISTANT_ICON_URL)}`,
);
consola.info(
  `  ${pc.dim("WELCOME_MESSAGE=")}${pc.cyan(env.WELCOME_MESSAGE.replaceAll("\n", "\\n").slice(0, 70) + "...")}`,
);
console.debug(env.WELCOME_MESSAGE);
consola.info(
  `  ${pc.dim("SYSTEM_PROMPT=")}${pc.cyan(env.SYSTEM_PROMPT.replaceAll("\n", "\\n").slice(0, 70) + "...")}`,
);
console.debug(env.SYSTEM_PROMPT);

consola.info("AI Models");
aiModels.forEach((model, i) => {
  consola.info(
    `  ${pc.dim("model=")}${pc.cyan(model.name.padEnd(AI_MODEL_NAME_COLUMN_WIDTH))} ${pc.dim("env=")}${pc.blue(AVAILABLE_AI_MODELS[i].env.padEnd(AI_MODEL_ENV_COLUMN_WIDTH))} ${pc.dim("enabled=")}${model.enabled ? pc.green("true") : pc.red("false")}`,
  );
});

consola.info("Service Authentication");
serviceAuths.forEach((auth) => {
  consola.info(
    `  ${pc.dim("service=")}${pc.cyan(auth.name.padEnd(SERVICE_AUTH_NAME_COLUMN_WIDTH))} ${pc.dim("env=")}${pc.blue(auth.env.padEnd(SERVICE_AUTH_ENV_COLUMN_WIDTH))} ${pc.dim("provided=")}${auth.secret ? pc.green("true") : pc.red("false")}`,
  );
});

const noModels = !aiModels.some((model) => model.enabled);
const noAuth = !serviceAuths.some((auth) => auth.secret);

if (noModels) consola.error("You must enable at least one AI model.");
if (noAuth) consola.error("You must provide auth for at least one service.");
if (noModels || noAuth) process.exit(1);

export default app;
