import type { ChatMessage } from "../../shared/types";

export const WELCOME_MESSAGE: ChatMessage = {
  content: `
{{ WELCOME_MESSAGE }}
  `.trim(),
  role: "assistant",
};
