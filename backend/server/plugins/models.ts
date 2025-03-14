import { Elysia } from "elysia";
import { AiModel, ChatMessage, PostChatRequestBody } from "../../shared/types";

export const models = new Elysia({ name: "models" })
  .model({
    AiModel,
    ChatMessage,
    PostChatRequestBody,
  })
  .as("plugin");
