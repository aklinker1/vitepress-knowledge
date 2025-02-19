# VitePress Knowledge

Free, self-hosted LLM chatbot trained on your VitePress website.

Try it out: https://wxt.dev

## Get Started

It takes two steps to add an AI assistant to your VitePress website:

1. Generate knowledge files based on your docs
2. Self-host a light-weight server that sends chat messages to Google/Anthropic.

### Generate Knowledge Files

Knowledge files are just your regular markdown documentation merged into one or more text files. LLMs use these files as their "knowledge" of your software.

Add the `vitepress-knowledge` NPM package to your project:

```sh
$ npm i -D vitepress-knowledge
```

```ts
// docs/.vitepress/config.ts
import { defineConfig } from "vitepress";
import knowledge from "vitepress-knowledge";

export default defineConfig({
  extends: knowledge({
    // This is the URL to where you'll host the server
    serverUrl: "https://chat.your-docs.com",
  }),
});
```

Test to see if your knowledge files are being built correctly:

```sh
$ vitepress build docs

vitepress v1.5.0

✓ building client + server bundles...
✓ rendering pages...
✓ [knowledge] generated docs/.vitepress/dist/knowledge/docs.txt
✓ [knowledge] generated docs/.vitepress/dist/knowledge/index.json
build complete in 2.57s.
```

### Setup the Backend

The backend provides two things:

1. JS code for the "Ask AI" button and chat window
2. Proxy requests to Google/Anthropic so you don't have to expose your API keys on your website.

Here's an example Docker Compose file for spinning up the backend.

```yml
# compose.yml
services:
  backend:
    image: aklinker1/vitepress-knowledge-server:latest
    ports:
      - "3000:3000"
    environment:
      APP_NAME: WXT
      DOMAIN: chat.wxt.dev
      DOCS_URL: https://wxt.dev
      GOOGLE_API_KEY: your_google_api_key # Get an API key @ https://aistudio.google.com
      GEMINI_2_0_FLASH: true
      # Be sure to escape any template variables so they aren't expanded as environment variables by docker
      SYSTEM_PROMPT: |
        You are a documentation assistant for "\{\{ APP_NAME \}\}" (\{\{ DOMAIN \}\}). Answer any questions based off your training knowledge below:

        \{\{ KNOWLEDGE \}\}
```

---

And... that's it! Once deployed, you should have a working chat window on your docs!

Checkout the plugin and server docs for more details and advanced configuration for each:

- Plugin docs: [`plugin/README.md`](https://github.com/aklinker1/vitepress-knowledge/blob/main/plugin/README.md)
- Server docs: [`server/README.md`](https://github.com/aklinker1/vitepress-knowledge/blob/main/server/README.md)
