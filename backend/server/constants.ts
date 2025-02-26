export const AVAILABLE_AI_MODELS = [
  {
    name: "Google Gemini 2.0 Flash",
    enum: "gemini-2.0-flash",
    env: "GEMINI_2_0_FLASH",
  },
  {
    name: "Claude 3.5 Sonnet",
    enum: "claude-3-5-sonnet-20241022",
    env: "CLAUDE_3_5_SONNET",
  },
  {
    name: "Claude 3.5 Haiku",
    enum: "claude-3-5-haiku-20241022",
    env: "CLAUDE_3_5_HAIKU",
  },
] as const;

export type AiModelEnum = (typeof AVAILABLE_AI_MODELS)[number]["enum"];

export const AI_MODEL_NAME_COLUMN_WIDTH = AVAILABLE_AI_MODELS.reduce(
  (max, model) => Math.max(max, model.name.length),
  0,
);
export const AI_MODEL_ENV_COLUMN_WIDTH = AVAILABLE_AI_MODELS.reduce(
  (max, model) => Math.max(max, model.env.length),
  0,
);

export const SERVICE_AUTH = [
  {
    name: "Google (Gemini) API KEY",
    enum: "google",
    env: "GOOGLE_API_KEY",
    models: [/^gemini-/],
  },
  {
    name: "Anthropic (Claude) API Key",
    enum: "anthropic",
    env: "ANTHROPIC_API_KEY",
    models: [/^claude-/],
  },
] as const;
export type ServiceAuthEnum = (typeof SERVICE_AUTH)[number]["enum"];

export const SERVICE_AUTH_NAME_COLUMN_WIDTH = SERVICE_AUTH.reduce(
  (max, service) => Math.max(max, service.name.length),
  0,
);
export const SERVICE_AUTH_ENV_COLUMN_WIDTH = SERVICE_AUTH.reduce(
  (max, service) => Math.max(max, service.env.length),
  0,
);
