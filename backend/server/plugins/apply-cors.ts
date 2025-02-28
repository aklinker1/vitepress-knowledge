import { cors } from "@elysiajs/cors";
import consola from "consola";
import env from "../utils/env";

export const applyCors = cors({
  origin: (ctx) => {
    const origin = ctx.headers.get("Origin") ?? "";
    consola.debug("CORS:", {
      origin,
      allowed: env.CORS_ORIGIN,
      headers: ctx.headers.toJSON(),
    });
    return env.CORS_ORIGIN.has(origin);
  },
});
