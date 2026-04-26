import { createApp } from "@aklinker1/zeta";
import { AiModel } from "../../shared/types";
import dedent from "dedent";
import { decorateContextPlugin } from "../plugins/decorate-context-plugin";

export const modelApis = createApp({ prefix: "/models" })
  .use(decorateContextPlugin)
  .get(
    "/",
    {
      operationId: "listModels",
      description: dedent`
        List models available to chat with.
      `,
      responses: AiModel.array(),
    },
    ({ aiService }) => aiService.models,
  );
