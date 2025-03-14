import type { AiModelDefinition, AiService } from ".";
import env from "../../utils/env";
import { aiModelRows, aiServiceRow, logStartupInfo } from "../../utils/log";

const MODELS: AiModelDefinition[] = [
  {
    name: "Gemini 2.0 Flash",
    env: "GEMINI_2_0_FLASH" as const,
    enum: "gemini-2.0-flash",
    enabled: env.GEMINI_2_0_FLASH,
  },
];

export function createGoogleAiService(): AiService {
  logStartupInfo("Google AI Service", [
    aiServiceRow("GOOGLE_API_KEY"),
    ...aiModelRows(MODELS),
  ]);

  return {
    enabled: !!env.GOOGLE_API_KEY,
    models: MODELS.filter((model) => model.enabled),

    replyToConversation: async (model, getSystemPrompt, conversation) => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model.enum}:generateContent?key=${env.GOOGLE_API_KEY!}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            generationConfig: {
              temperature: 1,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
              responseMimeType: "text/plain",
            },
            systemInstruction: {
              role: "user",
              parts: [{ text: await getSystemPrompt() }],
            },
            contents: conversation.messages.map((message) => ({
              role: message.role === "user" ? "user" : "model",
              parts: [{ text: message.content }],
            })),
          }),
        },
      );
      if (res.status !== 200) {
        throw new Error(`Google API error: ${res.status}`);
      }
      const json = await res.json();

      return {
        role: "assistant",
        content: json.candidates[0].content.parts[0].text,
      };
    },
  };
}
