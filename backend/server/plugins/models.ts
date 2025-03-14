import { Elysia } from "elysia";
import {
  AiModel,
  ChatMessage,
  Conversation,
  PostChatRequestBody,
} from "../../shared/types";

export const models = new Elysia({ name: "models" })
  .model({
    AiModel,
    ChatMessage,
    Conversation,
    PostChatRequestBody,
  })
  .as("plugin");
