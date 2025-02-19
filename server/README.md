# VitePress Knowledge Server

```yml
version: "3"
services:
  wxt:
    image: aklinker1/vitepress-knowledge:latest
    ports:
      - "3000:3000"
    environment:
      APP_NAME: WXT
      DOMAIN: chat.wxt.dev
      DOCS_URL: https://wxt.dev
      GOOGLE_API_KEY: your_google_api_key
      GEMINI_2_0_FLASH: true
```

## Environment Variables

| Name                 | Example                                      | Description                                                                                                                   |
| -------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Auth**             |                                              |                                                                                                                               |
| `GOOGLE_API_KEY`     | `abc...def`                                  | Required to use Gemini models. Visit <https://aistudio.google.com> to generate an API key.                                    |
| `ANTHROPIC_API_KEY`  | `abc...def`                                  | Required to use Claude models. Visit <https://docs.anthropic.com/en/docs/initial-setup> to get an API key.                    |
| **Enable Models**    |                                              |                                                                                                                               |
| `GEMINI_2_0_FLASH`   | `true`                                       | Set to `true` to enable [Google's Gemini 2.0 Flash](https://ai.google.dev/gemini-api/docs/models/gemini) model                |
| `CLAUDE_3_5_SONNET`  | `true`                                       | Set to `true` to enable [Anthopic's Claude 3.5 Sonnet](https://docs.anthropic.com/en/docs/about-claude/models) model          |
| `CLAUDE_3_5_HAIKU`   | `true`                                       | Set to `true` to enable [Anthopic's Claude 3.5 Haiku](https://docs.anthropic.com/en/docs/about-claude/models) model           |
| **Configuration**    |                                              |                                                                                                                               |
| `PORT`               | `5174`                                       | The port for the server to listen on.                                                                                         |
| `APP_NAME`           | `WXT`                                        | App name used throughout the UI                                                                                               |
| `DOMAIN`             | `chat.wxt.dev`                               | Specify the domain the server will be hosted at.                                                                              |
| `DOCS_URL`           | `https://wxt.dev`                            | URL to VitePress website. Must use the `vitepress-knowledge` plugin and host `/knowledge/*` files.                            |
| `CORS_ORIGIN`        | `wxt.dev`                                    | Optional: Override the allowed origin for CORS. If omitted, will use `DOCS_URL` for CORS.                                     |
| `ASSISTANT_ICON_URL` | `/logo.svg`                                  | Optional: Path or full URL to icon to use for the assistant's avatar in the chat. If missing, will default to `/favicon.ico`. |
| `WELCOME_MESSAGE`    | `<p>Hi!</p><p>I'm an AI assistant...`        | Optional: HTML template for customizing the initial message shown before a user sends their first message.                    |
| `SYSTEM_PROMPT`      | `You are an expert developer trained on ...` | Optional: Customize the system prompt                                                                                         |
