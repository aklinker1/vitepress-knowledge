import consola from "consola";
import type { AiService } from ".";
import { createAnthropicAiService } from "./anthropic";
import { createGoogleAiService } from "./google";

export function createGenericAiService(): AiService {
  const allServices = [
    createGoogleAiService(),
    createAnthropicAiService(),
    // ...
  ];

  const enabledServices = allServices.filter((service) => service.enabled);
  if (enabledServices.length === 0) {
    consola.error("You must provide auth for at least one AI service.");
    process.exit(1);
  }

  const enabledModels = enabledServices.flatMap((service) => service.models);
  if (enabledModels.length === 0) {
    consola.error("You must enable at least one AI model.");
    process.exit(1);
  }

  const service: AiService = {
    enabled: true,
    models: enabledModels,

    replyToConversation: async (model, systemPrompt, conversation) => {
      const service = enabledServices.find((service) =>
        service.models.includes(model),
      );
      if (!service) {
        throw new Error(`Model "${model.enum}" not found or is not enabled`, {
          cause: model,
        });
      }

      return await service.replyToConversation(
        model,
        systemPrompt,
        conversation,
      );
    },
  };
  return service;
}
