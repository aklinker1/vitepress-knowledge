import markdownit from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";

const renderer = markdownit({
  typographer: true,
})
  .use(linkBaseUrlPlugin)
  .use(linkTargetPlugin);

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
