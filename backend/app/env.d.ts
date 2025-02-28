declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// These are template variables defined in the index.html file, in an inline script. This makes it easy for the server to fill them out.
declare var APP_NAME: string;
declare var ASSISTANT_ICON_URL: string;
declare var BRAND_COLOR: string;
declare var BRAND_CONTENT_COLOR: string;
declare var DOCS_URL: string;
declare var SERVER_URL: string;
declare var WELCOME_MESSAGE: string;
