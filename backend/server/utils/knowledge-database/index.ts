export interface KnowledgeDatabase {
  conversations: {
    /** Get a conversation by its ID. */
    get(
      id: KnowledgeDatabase.Conversation["id"],
    ): Promise<KnowledgeDatabase.ConversationWithMessages | undefined>;
    /** Insert or update a conversation. */
    upsert(
      conversation: KnowledgeDatabase.ConversationInsert,
    ): Promise<KnowledgeDatabase.Conversation>;
    /** Insert or update a full conversation, including its messages. */
    saveWithMessages(
      conversation: KnowledgeDatabase.ConversationWithMessagesInsert,
    ): Promise<KnowledgeDatabase.ConversationWithMessages>;
  };

  messages: {
    /** Get a message by its ID. */
    get(
      id: KnowledgeDatabase.Message["id"],
    ): Promise<KnowledgeDatabase.Message | undefined>;
    /** Insert or update a message. */
    upsert(
      conversationId: KnowledgeDatabase.Conversation["id"],
      message: KnowledgeDatabase.MessageInsert,
    ): Promise<KnowledgeDatabase.Message>;
  };
}

export namespace KnowledgeDatabase {
  export type ConversationInsert = {
    id?: string;
  };
  export type Conversation = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  };
  export type ConversationWithMessagesInsert = ConversationInsert & {
    messages: KnowledgeDatabase.MessageInsert[];
  };
  export type ConversationWithMessages = Conversation & {
    messages: KnowledgeDatabase.Message[];
  };

  export type MessageInsert = {
    id?: string;
    content: string;
    role: "user" | "assistant";
  };
  export type Message = {
    id: string;
    content: string;
    role: "user" | "assistant";
    createdAt: Date;
    updatedAt: Date;
  };
}
