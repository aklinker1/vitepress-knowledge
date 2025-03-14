import { Elysia, t } from "elysia";
import { getKnowledgeFiles } from "../../utils/knowledge-files";
import env from "../../utils/env";
import { models } from "../../plugins/models";
import { decorateContext } from "../../plugins/decorate-context";
import { applySystemPromptTemplateVars } from "../../utils/template-vars";

export const postChatRoute = new Elysia()
  .use(models)
  .use(decorateContext)
  .post(
    "/chat",
    async ({ body, error, aiService, conversationService }) => {
      const model = aiService.models.find((m) => m.enum === body.model);
      if (!model) {
        return error(400, "Model not found or not enabled");
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
    {
      detail: {
        description:
          "Send messages to an AI model and return with the response.",
      },
      body: "PostChatRequestBody",
      response: {
        200: "Conversation",
        400: t.String({ description: "Error message." }),
      },
    },
  );
