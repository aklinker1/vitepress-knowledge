import { Elysia, t } from "elysia";
import { models } from "../../plugins/models";
import { decorateContext } from "../../plugins/decorate-context";
import { AVAILABLE_AI_MODELS } from "../../utils/constants";

const description = `
List models available to chat with.

To enable a model, set the corresponding environment variable to true:
| Model Name | Environment Variable |
|------------|----------------------|
${AVAILABLE_AI_MODELS.map((model) => `| ${model.name} | \`${model.env}\` |`).join("\n")}
`.trim();

export const getModelsRoute = new Elysia()
  .use(models)
  .use(decorateContext)
  .get(
    "/models",
    ({ query, aiModels }) => {
      if (query.filter === "all") return aiModels;
      const targetEnabled = query.filter === "enabled";
      return aiModels.filter((model) => model.enabled === targetEnabled);
    },
    {
      detail: { description },
      response: {
        200: "AiModel[]",
      },
      query: t.Object({
        filter: t.UnionEnum(["all", "enabled", "disabled"], {
          description:
            "Filter the list of models returned based on the `enabled` state.",
          default: "all",
        }),
      }),
    },
  );
