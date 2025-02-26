import { fetchStatic } from "@aklinker1/aframe/server";
import { consola } from "consola";
import { Elysia } from "elysia";
import pc from "picocolors";
import { applyCors } from "./plugins/apply-cors";
import { requestLogger } from "./plugins/request-logger";
import { apiRoute } from "./routes/api";
import { askAiRoute } from "./routes/ask-ai";
import { privacyPolicyRoute } from "./routes/privacy-policy";
import { swaggerRoute } from "./routes/swagger";
import {
  AI_MODEL_ENV_COLUMN_WIDTH,
  AI_MODEL_NAME_COLUMN_WIDTH,
  AVAILABLE_AI_MODELS,
  SERVICE_AUTH_ENV_COLUMN_WIDTH,
  SERVICE_AUTH_NAME_COLUMN_WIDTH,
} from "./utils/constants";
import * as env from "./utils/env";

consola.info("Starting server...");

const app = new Elysia()
  .use(requestLogger)
  .use(swaggerRoute)
  .use(applyCors)
  .use(askAiRoute)
  .use(privacyPolicyRoute)
  .use(apiRoute)
  .mount(fetchStatic);

consola.info("Resolved Environment Variables");
consola.info(`  ${pc.dim("PORT=")}${pc.cyan(env.PORT)}`);
consola.info(`  ${pc.dim("APP_NAME=")}${pc.cyan(env.APP_NAME)}`);
consola.info(`  ${pc.dim("SERVER_URL=")}${pc.cyan(env.SERVER_URL)}`);
consola.info(`  ${pc.dim("DOCS_URL=")}${pc.cyan(env.DOCS_URL)}`);
consola.info(
  `  ${pc.dim("CORS_ORIGIN=")}${pc.cyan([...env.CORS_ORIGIN].join(","))}`,
);
consola.info(
  `  ${pc.dim("ASSISTANT_ICON_URL=")}${pc.cyan(env.ASSISTANT_ICON_URL)}`,
);
consola.info(
  `  ${pc.dim("WELCOME_MESSAGE=")}${pc.cyan(env.WELCOME_MESSAGE.replaceAll("\n", "\\n").slice(0, 70) + "...")}`,
);
console.debug(env.WELCOME_MESSAGE);
consola.info(
  `  ${pc.dim("SYSTEM_PROMPT=")}${pc.cyan(env.SYSTEM_PROMPT.replaceAll("\n", "\\n").slice(0, 70) + "...")}`,
);
console.debug(env.SYSTEM_PROMPT);

consola.info("AI Models");
app.decorator.aiModels.forEach((model, i) => {
  consola.info(
    `  ${pc.dim("model=")}${pc.cyan(model.name.padEnd(AI_MODEL_NAME_COLUMN_WIDTH))} ${pc.dim("env=")}${pc.blue(AVAILABLE_AI_MODELS[i].env.padEnd(AI_MODEL_ENV_COLUMN_WIDTH))} ${pc.dim("enabled=")}${model.enabled ? pc.green("true") : pc.red("false")}`,
  );
});

consola.info("Service Authentication");
app.decorator.serviceAuths.forEach((auth) => {
  consola.info(
    `  ${pc.dim("service=")}${pc.cyan(auth.name.padEnd(SERVICE_AUTH_NAME_COLUMN_WIDTH))} ${pc.dim("env=")}${pc.blue(auth.env.padEnd(SERVICE_AUTH_ENV_COLUMN_WIDTH))} ${pc.dim("provided=")}${auth.secret ? pc.green("true") : pc.red("false")}`,
  );
});

const noModels = !app.decorator.aiModels.some((model) => model.enabled);
const noAuth = !app.decorator.serviceAuths.some((auth) => auth.secret);

if (noModels) consola.error("You must enable at least one AI model.");
if (noAuth) consola.error("You must provide auth for at least one service.");
if (noModels || noAuth) process.exit(1);

export default app;
