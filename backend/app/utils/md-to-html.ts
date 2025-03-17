import markdownit from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";
import { fromHighlighter } from "@shikijs/markdown-it/core";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";

const renderer = markdownit({
  typographer: true,
})
  .use(linkBaseUrlPlugin)
  .use(linkTargetPlugin);

export const MARKDOWN_SYNTAX_HIGHLIGHTER_READY_EVENT =
  "markdown-syntax-highlighter-ready";

// Load syntax highlighting
(async () => {
  const highlighter = await createHighlighterCore({
    themes: [import("@shikijs/themes/github-dark")],
    langs: [
      import("@shikijs/langs/html"),
      import("@shikijs/langs/css"),
      import("@shikijs/langs/json"),
      import("@shikijs/langs/javascript"),
      import("@shikijs/langs/typescript"),
      import("@shikijs/langs/jsx"),
      import("@shikijs/langs/tsx"),
      import("@shikijs/langs/vue"),
      import("@shikijs/langs/svelte"),
    ],
    engine: createOnigurumaEngine(() => import("shiki/wasm")),
  });
  renderer.use(
    // @ts-expect-error: highlighter type error, but it works
    fromHighlighter(highlighter, {
      theme: "github-dark",
      transformers: [
        {
          // The theme background conflicts with the message backgrounds, so we
          // remove the custom background color and use Tailwind's. Only the
          // text is affected by the theme.
          name: "vitepress-knowledge:pre-background",
          pre(node) {
            delete node.properties.style;
          },
        },
      ],
    }),
  );
  window.dispatchEvent(
    new CustomEvent(MARKDOWN_SYNTAX_HIGHLIGHTER_READY_EVENT),
  );
})();

export function mdToHtml(md: string): string {
  return renderer.render(md);
}

/**
 * Add a base URL to the docs if anchors are absolute paths.
 * "/" -> "https://wxt.dev/"
 */
function linkBaseUrlPlugin(md: markdownit): void {
  const addBaseUrlRule: RenderRule = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex("href");
    if (hrefIndex >= 0 && token.attrs?.[hrefIndex]?.[1]?.startsWith("/")) {
      token.attrs[hrefIndex][1] = DOCS_URL + token.attrs[hrefIndex][1];
    }
    return self.renderToken(tokens, idx, options);
  };
  md.renderer.rules.link_open = addBaseUrlRule;
}

/**
 * Always open markdown links in new tabs. For now, this is done to preserve the
 * conversation in the open tab, which would otherwise be cleared when
 * changing URLs.
 */
function linkTargetPlugin(md: markdownit): void {
  const addTargetRule: RenderRule = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token.attrIndex("target") < 0) {
      token.attrPush(["target", "_blank"]);
    }
    return self.renderToken(tokens, idx, options);
  };
  md.renderer.rules.link_open = addTargetRule;
}
