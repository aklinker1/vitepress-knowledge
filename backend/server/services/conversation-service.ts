import type { KnowledgeDatabase } from "./knowledge-database";

export interface ConversationService {
  updateConversation: (
    conversation: KnowledgeDatabase.ConversationWithMessagesInsert,
  ) => Promise<KnowledgeDatabase.ConversationWithMessages>;
}

export function createConversationService(
  database: KnowledgeDatabase,
): ConversationService {
  return {
    updateConversation: async (conversation) => {
      const { messages, ...conversationInsert } = conversation;

      const newConversation =
        await database.conversations.getOrInsert(conversationInsert);
      const newMessages = messages
        ? await Promise.all(
            messages.map((message) =>
              database.messages.getOrInsert(newConversation.id, message),
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
