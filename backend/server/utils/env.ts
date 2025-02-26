// Auth

export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY?.trim();
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY?.trim();

// Models

export const GEMINI_2_0_FLASH = process.env.GEMINI_2_0_FLASH === "true";
export const CLAUDE_3_5_SONNET = process.env.CLAUDE_3_5_SONNET === "true";
export const CLAUDE_3_5_HAIKU = process.env.CLAUDE_3_5_HAIKU === "true";

// Config

export const PORT = Number(process.env.PORT) || 5174;
export const APP_NAME = process.env.APP_NAME?.trim() || "<APP_NAME>";
export const SERVER_URL = process.env.SERVER_URL?.trim() || "<SERVER_URL>";
export const DOCS_URL = (process.env.DOCS_URL || "http://localhost:5173")
  // Remove trailing /
  .replace(/\/$/, "");
export const CORS_ORIGIN = new Set(
  (process.env.CORS_ORIGIN || DOCS_URL).split(",").map((origin) =>
    // Trim and remove trailing /
    origin.trim().replace(/\/$/, ""),
  ),
);
export const ASSISTANT_ICON_URL =
  process.env.ASSISTANT_ICON_URL?.trim() || "/favicon.ico";
export const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  `You are a documentation assistant for "{{ APP_NAME }}" ({{ DOMAIN }}). Answer any questions based off your training knowledge below:

{{ KNOWLEDGE }}`;
export const WELCOME_MESSAGE =
  process.env.WELCOME_MESSAGE ||
  `<p>Hi!</p>
<p>I'm an AI assistant trained on {{ APP_NAME }}'s documentation.</p>
<p>Ask me anything about <code>{{ APP_NAME }}</code>.</p>`;
