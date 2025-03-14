import type { ChatMessage } from "../../../shared/types";
import type env from "../../utils/env";

export interface AiService {
  enabled: boolean;
  /** List of enabled models. */
  models: AiModelDefinition[];

  /** Have the AI send a reply to a conversation. */
  replyToConversation(
    model: AiModelDefinition,
    getSystemPrompt: () => Promise<string>,
    conversation: { messages: ChatMessage[] },
  ): Promise<ChatMessage>;
}

export interface AiModelDefinition {
  name: string;
  env: keyof typeof env;
  enum: string;
  enabled: boolean;
}
