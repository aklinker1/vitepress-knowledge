# VitePress Knowledge Server

> This page only documents the Server options. [See this page to get started](https://github.com/aklinker1/vitepress-knowledge).

## Environment Variables

The server is configured via environment variables.

| Name                  | Example                                      | Description                                                                                                           |
| --------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Auth**              |                                              |                                                                                                                       |
| `GOOGLE_API_KEY`      | `abc...def`                                  | Required to use Gemini models. Visit <https://aistudio.google.com> to generate an API key.                            |
| `ANTHROPIC_API_KEY`   | `abc...def`                                  | Required to use Claude models. Visit <https://docs.anthropic.com/en/docs/initial-setup> to get an API key.            |
| **Enable Models**     |                                              |                                                                                                                       |
| `GEMINI_2_0_FLASH`    | `true`                                       | Set to `true` to enable [Google's Gemini 2.0 Flash](https://ai.google.dev/gemini-api/docs/models/gemini) model        |
| `CLAUDE_3_5_SONNET`   | `true`                                       | Set to `true` to enable [Anthopic's Claude 3.5 Sonnet](https://docs.anthropic.com/en/docs/about-claude/models) model  |
| `CLAUDE_3_5_HAIKU`    | `true`                                       | Set to `true` to enable [Anthopic's Claude 3.5 Haiku](https://docs.anthropic.com/en/docs/about-claude/models) model   |
| **Configuration**     |                                              |                                                                                                                       |
| `PORT`                | `5174`                                       | The port for the server to listen on.                                                                                 |
| `APP_NAME`            | `WXT`                                        | App name used throughout the UI                                                                                       |
| `BRAND_COLOR`         | `rgb(103, 212, 94)`                          | Brand color used on the UI. Can be any valid CSS color.                                                               |
| `BRAND_CONTENT_COLOR` | `black`                                      | Color of text/icons when displayed on top of the brand color. Can be any valid CSS color.                             |
| `SERVER_URL`          | `chat.wxt.dev`                               | Specify the domain the server will be hosted at.                                                                      |
| `DOCS_URL`            | `https://wxt.dev`                            | URL to VitePress website. Must use the `vitepress-knowledge` plugin and host `/knowledge/*` files.                    |
| `CORS_ORIGIN`         | `https://wxt.dev`                            | Optional: Override the allowed origin for CORS. If omitted, will use `DOCS_URL` for CORS.                             |
| `ASSISTANT_ICON_URL`  | `https://wxt.dev/logo.svg`                   | Optional: Full URL to icon to use for the assistant's avatar in the chat. If missing, will default to `/favicon.ico`. |
| `WELCOME_MESSAGE`     | `Hi!\n\nI'm an AI assistant...`              | Optional: Markdown template for customizing the initial message shown before a user sends their first message.        |
| `SYSTEM_PROMPT`       | `You are an expert developer trained on ...` | Optional: Customize the system prompt                                                                                 |

> [!WARNING]
> Note that right now, the chat window is hardcoded to use Gemini 2.0 Flash. The other services and models cannot be used yet.

## Hosting

To host the backend, you can use docker like the [Setup guide does](https://github.com/aklinker1/vitepress-knowledge#setup), or clone down the repo and run the `server/src/main.ts` file yourself.

The `server/Dockerfile` contains the minimal set of build instructions to run the backend.
