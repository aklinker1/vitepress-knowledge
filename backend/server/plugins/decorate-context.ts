import { Elysia } from "elysia";
import { createGenericAiService } from "../services/ai-service/generic";
import { openKnowledgeDatabase } from "../utils/open-knowledge-database";

const db = await openKnowledgeDatabase();
const aiService = createGenericAiService();

export const decorateContext = new Elysia({ name: "decorate-context" })
  .decorate({
    aiService,
    db,
  })
  .as("plugin");
