import { z } from "zod";

export const AiModel = z
  .object({
    name: z.string().describe("Display name of LLM Model"),
    enum: z.string().describe("Enum value to be used with the API."),
  })
  .meta({ ref: "AiModel" });
export type AiModel = z.infer<typeof AiModel>;

export const ChatMessage = z
  .object({
    id: z.string().optional(),
    role: z.enum(["user", "assistant"]).describe("Who sent the message."),
    content: z.string().describe("The message contents being sent."),
  })
  .meta({ ref: "ChatMessage" });
export type ChatMessage = z.infer<typeof ChatMessage>;

export const Conversation = z
  .object({
    id: z.string(),
    messages: z.array(ChatMessage),
  })
  .meta({ ref: "Conversation" });
export type Conversation = z.infer<typeof Conversation>;

export const PostChatRequestBody = z.object({
  model: z.string(),
  conversationId: z.string().optional(),
  messages: z.array(ChatMessage),
});
export type PostChatRequestBody = z.infer<typeof PostChatRequestBody>;
