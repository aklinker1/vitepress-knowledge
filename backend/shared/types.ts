import { t } from "elysia";

export const AiModel = t.Object({
  name: t.String({
    description: "Display name of LLM Model",
    examples: ["Gemini 2.0 Flash"],
  }),
  enum: t.String({
    description: "Enum value to be used with the API.",
    examples: ["gemini-2.0-flash"],
  }),
});
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
    examples: [{ id: "123", role: "user", content: "Your question here..." }],
  },
);
export type ChatMessage = typeof ChatMessage.static;

export const Conversation = t.Object({
  id: t.String({ examples: ["123"] }),
  messages: t.Array(ChatMessage),
});
export type Conversation = typeof Conversation.static;

export const PostChatRequestBody = t.Object({
  model: t.String({ examples: ["gemini-2.0-flash"] }),
  conversationId: t.Optional(t.String()),
  messages: t.Array(ChatMessage),
});
export type PostChatRequestBody = typeof PostChatRequestBody.static;
