// Auth

import { envRow, logStartupInfo } from "./log";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY?.trim();
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY?.trim();

// Models

const GEMINI_2_0_FLASH = process.env.GEMINI_2_0_FLASH === "true";
const CLAUDE_3_5_SONNET = process.env.CLAUDE_3_5_SONNET === "true";
const CLAUDE_3_5_HAIKU = process.env.CLAUDE_3_5_HAIKU === "true";

// Database

const DATABASE_TYPE = process.env.DATABASE_TYPE?.trim() || "sqlite";
const DATABASE_SQLITE_PATH =
  process.env.DATABASE_SQLITE_PATH?.trim() || "data/knowledge.db";

// Config

const PORT = Number(process.env.PORT) || 5174;
const APP_NAME = process.env.APP_NAME?.trim() || "<APP_NAME>";
const BRAND_COLOR = process.env.BRAND_COLOR?.trim() || "<BRAND_COLOR>";
const BRAND_CONTENT_COLOR =
  process.env.BRAND_CONTENT_COLOR?.trim() || "<BRAND_CONTENT_COLOR>";
const SERVER_URL = process.env.SERVER_URL?.trim() || "<SERVER_URL>";
const DOCS_URL = (process.env.DOCS_URL || "http://localhost:5173")
  // Remove trailing /
  .replace(/\/$/, "");
const CORS_ORIGIN = new Set(
  (process.env.CORS_ORIGIN || DOCS_URL).split(",").map((origin) =>
    // Trim and remove trailing /
    origin.trim().replace(/\/$/, ""),
  ),
);
const ASSISTANT_ICON_URL =
  process.env.ASSISTANT_ICON_URL?.trim() || "/favicon.ico";
const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  `You are a documentation assistant for "{{ APP_NAME }}" ({{ DOMAIN }}). Answer any questions based off your training knowledge below:

{{ KNOWLEDGE }}`;
const WELCOME_MESSAGE =
  process.env.WELCOME_MESSAGE ||
  `<p>Hi!</p>
<p>I'm an AI assistant trained on {{ APP_NAME }}'s documentation.</p>
<p>Ask me anything about <code>{{ APP_NAME }}</code>.</p>`;

const env = {
  GOOGLE_API_KEY,
  ANTHROPIC_API_KEY,
  GEMINI_2_0_FLASH,
  CLAUDE_3_5_SONNET,
  CLAUDE_3_5_HAIKU,
  DATABASE_TYPE,
  DATABASE_SQLITE_PATH,
  PORT,
  APP_NAME,
  BRAND_COLOR,
  BRAND_CONTENT_COLOR,
  SERVER_URL,
  DOCS_URL,
  CORS_ORIGIN,
  ASSISTANT_ICON_URL,
  SYSTEM_PROMPT,
  WELCOME_MESSAGE,
};
export default env;

logStartupInfo(
  "Resolved Environment Variables",
  Object.keys(env).map((key) => envRow(key as any)),
);
