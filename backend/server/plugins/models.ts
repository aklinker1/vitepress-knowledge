import { Elysia } from "elysia";
import {
  AiModel,
  AiModelEnum,
  ChatMessage,
  PostChatRequestBody,
} from "../../shared/types";

export const models = new Elysia({ name: "models" })
  .model({
    AiModel,
    AiModelEnum,
    ChatMessage,
    PostChatRequestBody,
  })
  .as("plugin");
