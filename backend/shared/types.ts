import { t } from "elysia";
import { AVAILABLE_AI_MODELS } from "../server/utils/constants";

export const AiModel = t.Object(
  {
    name: t.String({
      description: "Display name of LLM Model",
    }),
    enum: t.String({
      description: "Enum value to be used with the API.",
    }),
    enabled: t.Boolean(),
  },
  {
    examples: [
      {
        name: "Google Gemini 2.0 Flash",
        value: "gemini-2.0-flash",
        enabled: false,
      },
      { name: "Claude 3.5 Sonnet", value: "claude-3.5-sonnet", enabled: true },
    ],
  },
);
export type AiModel = typeof AiModel.static;

export const AiModelEnum = t.String({
  examples: [AVAILABLE_AI_MODELS[0].enum],
});
export type AiModelEnum = typeof AiModelEnum.static;

export const ChatMessage = t.Object(
  {
    role: t.UnionEnum(["user", "assistant"], {
      description: "Who sent the message.",
    }),
    content: t.String({
      description: "The message contents being sent.",
    }),
  },
  {
    examples: [{ role: "user", content: "Your question here..." }],
  },
);
export type ChatMessage = typeof ChatMessage.static;

export const PostChatRequestBody = t.Object({
  model: AiModelEnum,
  messages: t.Array(ChatMessage),
});
export type PostChatRequestBody = typeof PostChatRequestBody.static;
