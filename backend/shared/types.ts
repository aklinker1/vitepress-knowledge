import { t } from "elysia";

export const AiModel = t.Object(
  {
    name: t.String({
      description: "Display name of LLM Model",
    }),
    enum: t.String({
      description: "Enum value to be used with the API.",
    }),
  },
  {
    examples: [
      { name: "Google Gemini 2.0 Flash", value: "gemini-2.0-flash" },
      { name: "Claude 3.5 Sonnet", value: "claude-3.5-sonnet" },
    ],
  },
);
export type AiModel = typeof AiModel.static;

export const ChatMessage = t.Object(
  {
    id: t.Optional(t.String()),
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
  model: t.String({ examples: ["gemini-2.0-flash"] }),
  conversationId: t.Optional(t.String()),
  messages: t.Array(ChatMessage),
});
export type PostChatRequestBody = typeof PostChatRequestBody.static;
