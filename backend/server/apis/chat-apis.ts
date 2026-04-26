import { BadRequestHttpError, createApp } from "@aklinker1/zeta";
import dedent from "dedent";
import { getKnowledgeFiles } from "../utils/knowledge-files";
import { applySystemPromptTemplateVars } from "../utils/template-vars";
import env from "../utils/env";
import { decorateContextPlugin } from "../plugins/decorate-context-plugin";
import { Conversation, PostChatRequestBody } from "../../shared/types";

export const chatApis = createApp({ prefix: "/chat" })
  .use(decorateContextPlugin)
  .post(
    "/",
    {
      operationId: "chat",
      description: dedent`
        Send messages to an AI model and return with the response.
      `,
      body: PostChatRequestBody,
      responses: Conversation,
    },
    async ({ body, aiService, conversationService }) => {
      const model = aiService.models.find((m) => m.enum === body.model);
      if (!model) {
        throw new BadRequestHttpError("Model not found or not enabled");
      }

      const response = await aiService.replyToConversation(
        model,
        async () => {
          const knowledge = await getKnowledgeFiles(env.DOCS_URL);
          return applySystemPromptTemplateVars(
            env.SYSTEM_PROMPT,
            knowledge.files.join("\n\n"),
          );
        },
        { messages: body.messages },
      );

      return await conversationService.updateConversation({
        id: body.conversationId,
        messages: [...body.messages, response],
      });
    },
  );
