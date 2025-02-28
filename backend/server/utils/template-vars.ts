import env from "./env";

export const WELCOME_MESSAGE_TEMPLATE_VARS = {
  APP_NAME: env.APP_NAME,
  ASSISTANT_ICON_URL: env.ASSISTANT_ICON_URL,
  DOCS_URL: env.DOCS_URL,
  SERVER_URL: env.SERVER_URL,
};

export const APP_TEMPLATE_VARS = {
  ...WELCOME_MESSAGE_TEMPLATE_VARS,
  WELCOME_MESSAGE: env.WELCOME_MESSAGE,
};

export const SYSTEM_PROMPT_TEMPLATE_VARS = {
  APP_NAME: env.APP_NAME,
  ASSISTANT_ICON_URL: env.ASSISTANT_ICON_URL,
  DOCS_URL: env.DOCS_URL,
  SERVER_URL: env.SERVER_URL,
  WELCOME_MESSAGE: env.WELCOME_MESSAGE,
};

export function applyAppTemplateVars(template: string): string {
  return applyTemplateVars(template, {
    ...APP_TEMPLATE_VARS,
    WELCOME_MESSAGE: applyTemplateVars(
      APP_TEMPLATE_VARS.WELCOME_MESSAGE,
      WELCOME_MESSAGE_TEMPLATE_VARS,
    ),
  });
}

export function applySystemPromptTemplateVars(
  template: string,
  knowledge: string,
): string {
  return applyTemplateVars(template, {
    ...SYSTEM_PROMPT_TEMPLATE_VARS,
    KNOWLEDGE: knowledge,
  });
}

export function applyTemplateVars(
  template: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (template, [name, value]) => template.replaceAll(`{{ ${name} }}`, value),
    template,
  );
}
