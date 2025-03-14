export interface KnowledgeDatabase {
  conversations: {
    /** Get a conversation by its ID. */
    get: (
      id: KnowledgeDatabase.Conversation["id"],
    ) => Promise<KnowledgeDatabase.ConversationWithMessages | undefined>;
    /** Insert a conversation. */
    insert: (
      conversation: KnowledgeDatabase.ConversationInsert,
    ) => Promise<KnowledgeDatabase.Conversation>;
    /** Get or insert a conversation. */
    getOrInsert: (
      conversation: KnowledgeDatabase.ConversationInsert,
    ) => Promise<KnowledgeDatabase.Conversation>;
  };

  messages: {
    /** Get a message by its ID. */
    get: (
      id: KnowledgeDatabase.Message["id"],
    ) => Promise<KnowledgeDatabase.Message | undefined>;
    /** Insert a message. */
    insert: (
      conversationId: KnowledgeDatabase.Conversation["id"],
      message: KnowledgeDatabase.MessageInsert,
    ) => Promise<KnowledgeDatabase.Message>;
    /** Get or insert a message. */
    getOrInsert: (
      conversationId: KnowledgeDatabase.Conversation["id"],
      message: KnowledgeDatabase.MessageInsert,
    ) => Promise<KnowledgeDatabase.Message>;
  };
}

export namespace KnowledgeDatabase {
  export type ConversationInsert = {
    id?: string;
  };
  export type Conversation = {
    id: string;
    createdAt: Date;
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
  };
}
