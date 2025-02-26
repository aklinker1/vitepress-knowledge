import { cors } from "@elysiajs/cors";
import consola from "consola";
import { CORS_ORIGIN } from "../utils/env";

export const applyCors = cors({
  origin: (ctx) => {
    const origin = ctx.headers.get("Origin") ?? "";
    consola.debug("CORS:", {
      origin,
      allowed: CORS_ORIGIN,
      headers: ctx.headers.toJSON(),
    });
    return CORS_ORIGIN.has(origin);
  },
});
