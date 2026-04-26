import { createApp } from "@aklinker1/zeta";
import consola from "consola";
import env from "../utils/env";

export const corsPlugin = createApp()
  .onGlobalRequest(({ request, set }) => {
    const origin = request.headers.get("origin") ?? "";
    if (env.CORS_ORIGIN.has(origin)) {
      set.headers["Access-Control-Allow-Origin"] = origin;
      set.headers["Access-Control-Allow-Methods"] =
        "GET, POST, PUT, DELETE, OPTIONS";
      set.headers["Access-Control-Allow-Headers"] =
        "Content-Type, Authorization";
    }

    consola.debug("CORS:", {
      origin,
      allowed: env.CORS_ORIGIN,
      headers: set.headers,
    });

    if (request.method === "OPTIONS")
      return new Response("", { status: 200, headers: set.headers });
  })
  .export();
