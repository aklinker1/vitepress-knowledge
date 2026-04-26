import type { KnowledgeDatabase } from "./knowledge-database";

export interface ConversationService {
  updateConversation: (
    conversation: KnowledgeDatabase.ConversationWithMessagesInsert,
  ) => Promise<KnowledgeDatabase.ConversationWithMessages>;
}

export function createConversationService({
  db,
}: {
  db: KnowledgeDatabase;
}): ConversationService {
  return {
    updateConversation: async (conversation) => {
      const { messages, ...conversationInsert } = conversation;

      const newConversation =
        await db.conversations.getOrInsert(conversationInsert);
      const newMessages = messages
        ? await Promise.all(
            messages.map((message) =>
              db.messages.getOrInsert(newConversation.id, message),
            ),
          )
        : [];
      return {
        ...newConversation,
        messages: newMessages,
      };
    },
  };
}
