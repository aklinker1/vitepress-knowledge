import swagger from "@elysiajs/swagger";
import { version } from "../../shared/constants";

export const swaggerRoute = swagger({
  documentation: {
    info: {
      title: "VitePress Knowledge Server",
      version,
      description: 'APIs used to power the _"Ask AI"_ button and chat.',
    },
  },
});
