import { Elysia } from "elysia";
import { createGenericAiService } from "../services/ai-service/generic";

const aiService = createGenericAiService();

export const decorateContext = new Elysia({ name: "decorate-context" })
  .decorate({
    aiService,
  })
  .as("plugin");
