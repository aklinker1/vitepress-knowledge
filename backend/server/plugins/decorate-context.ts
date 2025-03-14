import { Elysia } from "elysia";
import { AVAILABLE_AI_MODELS, SERVICE_AUTH } from "../utils/constants";
import env from "../utils/env";
import { openKnowledgeDatabase } from "../utils/open-knowledge-database";

const db = await openKnowledgeDatabase();

export const decorateContext = new Elysia({ name: "decorate-context" })
  .decorate({
    aiModels: AVAILABLE_AI_MODELS.map((model) => ({
      name: model.name,
      enum: model.enum,
      enabled: env[model.env],
    })),
    serviceAuths: SERVICE_AUTH.map((auth) => ({
      ...auth,
      secret: process.env[auth.env],
    })),
    db,
  })
  .as("plugin");
