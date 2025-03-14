import { Elysia } from "elysia";
import { createGenericAiService } from "../services/ai-service/generic";
import { openKnowledgeDatabase } from "../utils/open-knowledge-database";
import { createConversationService } from "../services/conversation-service";

const db = await openKnowledgeDatabase();
const conversationService = createConversationService(db);
const aiService = createGenericAiService();

export const decorateContext = new Elysia({ name: "decorate-context" })
  .decorate({
    aiService,
    db,
    conversationService,
  })
  .as("plugin");
