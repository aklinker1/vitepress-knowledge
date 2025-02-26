import swagger from "@elysiajs/swagger";
import { version } from "../../shared/constants";
import apiDocs from "../assets/api-docs.md" with { type: "text" };

export const swaggerRoute = swagger({
  documentation: {
    info: {
      title: "VitePress Knowledge Server",
      version,
      description: apiDocs,
    },
  },
});
