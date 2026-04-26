import { createIocContainer } from "@aklinker1/zero-ioc";
import { openKnowledgeDatabase } from "./utils/open-knowledge-database";
import { createConversationService } from "./services/conversation-service";
import { createGenericAiService } from "./services/ai-service/generic";

const db = await openKnowledgeDatabase();

export const container = createIocContainer()
  .register("db", () => db)
  .register("conversationService", createConversationService)
  .register("aiService", createGenericAiService);
