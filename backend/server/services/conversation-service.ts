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
      const { messages, ...values } = conversation;

      const existingConversation =
        conversation.id != null
          ? await database.conversations.get(conversation.id)
          : null;
      const newConversation =
        existingConversation ?? (await database.conversations.insert(values));
      const newMessages = messages
        ? await Promise.all(
            messages.map(async (message) => {
              const existing =
                message.id != null
                  ? await database.messages.get(message.id)
                  : null;
              return (
                existing ??
                (await database.messages.insert(newConversation.id, message))
              );
            }),
          )
        : [];
      return {
        ...newConversation,
        messages: newMessages,
      };
    },
  };
}
