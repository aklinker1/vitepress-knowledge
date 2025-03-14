import { Elysia } from "elysia";
import { models } from "../../plugins/models";
import { decorateContext } from "../../plugins/decorate-context";

const description = `
List models available to chat with.
`.trim();

export const getModelsRoute = new Elysia()
  .use(models)
  .use(decorateContext)
  .get("/models", ({ aiService }) => aiService.models, {
    detail: { description },
    response: {
      200: "AiModel[]",
    },
  });
