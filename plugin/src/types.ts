import type { UserConfig } from "vitepress";

export interface KnowledgeOptions<ThemeConfig> {
  /** When passed, show the "Ask AI" button and chat window. */
  serverUrl?: string;
  /** Defaults to "knowledge", and your files will be available at `https://your-domain/knowledge/*` */
  dir?: string;
  /** Standard Vitepress `extends` to extend another config */
  extends?: UserConfig<ThemeConfig>["extends"];
  /**
   * Break up your paths into multiple knowledge files. This object is a map of base paths to output filenames.
   * @default { "/": "docs" }
   */
  paths?: Record<string, string>;
  /**
   * Markdown files to ignore. Note that the 404.md page is always ignored.
   * @default: []
   */
  ignore?: string[];
  /** Default selector to only process content from inside. */
  selector?: string;
  /** Customize the selector used for each page layout. */
  layoutSelectors?: Record<string, string>;
  /** Customize the selector for individual pages. */
  pageSelectors?: Record<string, string>;
}

export type KnowledgeContext = {
  sourceMdFile: string;
  pageTitle: string;
  pageDescription: string;
  siteTitle: string;
  siteDescription: string;
  md: string;
  pathname: string;
};
