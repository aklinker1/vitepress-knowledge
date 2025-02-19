# VitePress Knowledge

> This page only documents the NPM package options. [See this page to get started](https://github.com/aklinker1/vitepress-knowledge).

```sh
pnpm i vitepress-knowledge
```

Generate knowledge files for AI models to use. This plugin works by converting the final HTML files rendered by Vitepress back into markdown, then merging them into one (or more) files that is hosted on the production version of your website.

## TODO

- [x] Generate knowledge files
- [x] Add tests for HTML &rarr; markdown conversion
- [ ] Plugin system that allows for
  - Generating more knowledge files based on other sources (discord, github, etc)
  - Uploading knowledge files to to keep models up-to-date with your docs (OpenAI Assistants for example)

## Setup

1. Extend the `knowledge` plugin:

   ```ts
   // docs/.vitepress/config.ts
   import { defineConfig } from "vitepress";
   import knowledge from "vitepress-knowledge";

   export default defineConfig({
     extends: knowledge({
       // Plugin config goes here...
     }),
   });
   ```

2. Build your site:

   ```sh
   $ vitepress build docs

     vitepress v1.5.0

   ✓ building client + server bundles...
   ✓ rendering pages...
   ✓ [knowledge] generated docs/.vitepress/dist/knowledge/docs.txt
   ✓ [knowledge] generated docs/.vitepress/dist/knowledge/index.json
   build complete in 2.57s.
   ```

And that's it! Your knowledge files will be listed at `https://example.com/knowledge/index.json` on your production site. Knowledge files are not generated during development.

## Configuration

### Output multiple files

You can group knowledge based on the markdown file's base paths. For example, if you want to separate the API reference and blog out into their own files:

```ts
export default defineConfig({
  extends: knowledge({
    paths: {
      "/": "docs",
      "/api/": "api-reference",
      "/blog/": "blog",
    },
  }),
});
```

This will output the following files:

- `knowledge/docs.txt`
- `knowledge/api-reference.txt`
- `knowledge/blog.txt`

### Ignoring Files

To prevent a markdown file from being added to the knowledge files, use the `ignore` option:

```ts
export default defineConfig({
  extends: knowledge({
    ignore: ["privacy-policy.md"],
  }),
});
```

### Page Ordering

Pages are ordered inside knowledge files in the same order as they are listed in your `theme.sidebar` definition. This makes sure the AI is given context in the same order as a new user would read your docs.

So to change the order that your knowledge files are built, change the order of your sidebar.

Any pages not listed in the sidebar are put at the end of the knowledge files, sorted alphabetically.

### Selectors

By default, this plugin only adds the documentation part of each page to the knowledge file, ignoring navigation (top nav, sidebar, and aside). To customize which content should be added to the knowledge file, you can use the `selector`, `layoutSelectors`, and `pageSelectors` options.

- `pageSelectors`: Specify which content should be added for a specific page
- `layoutSelectors`: Specify which content should be added for a specific layout (if not specified in the `pageSelectors`)
- `selector`: Specify which content should be added (if not specified in the `pageSelectors` or `layoutSelectors`)

By default, standard layouts provided by the default theme have default selectors applied for you automatically.

### Extending Other Themes

You can use the `extends` option to extend another theme.

```ts
export default defineConfig({
  extends: knowledge({
    extends: someOtherTheme(),
  }),
});
```

Right now, this package probably won't work with any theme other than the default. It assumes you're using the default theme to detect the order of pages and provide default layout selectors.
