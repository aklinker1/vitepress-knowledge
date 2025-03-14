import type { AiModelDefinition, AiService } from ".";
import env from "../../utils/env";
import { aiModelRows, aiServiceRow, logStartupInfo } from "../../utils/log";

export const MODELS: AiModelDefinition[] = [
  {
    name: "Claude 3.5 Sonnet",
    enum: "claude-3-5-sonnet-20241022",
    env: "CLAUDE_3_5_SONNET",
    enabled: env.CLAUDE_3_5_SONNET,
  },
  {
    name: "Claude 3.5 Haiku",
    enum: "claude-3-5-haiku-20241022",
    env: "CLAUDE_3_5_HAIKU",
    enabled: env.CLAUDE_3_5_HAIKU,
  },
];

export function createAnthropicAiService(): AiService {
  logStartupInfo("Anthropic AI Service", [
    aiServiceRow("ANTHROPIC_API_KEY"),
    ...aiModelRows(MODELS),
  ]);

  return {
    enabled: !!env.ANTHROPIC_API_KEY,
    models: MODELS.filter((model) => model.enabled),

    replyToConversation: async (model, getSystemPrompt, conversation) => {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: model.enum,
          max_tokens: 1024,
          system: [
            {
              type: "text",
              text: await getSystemPrompt(),
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: conversation.messages,
        }),
      });
      if (res.status !== 200) {
        throw new Error(`Anthropic API error: ${res.status}`);
      }

      const json = await res.json();
      return {
        role: "assistant",
        content: json.content[0].text,
      };
    },
  };
}
