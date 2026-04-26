import { consola } from "consola";
import { createApp } from "@aklinker1/zeta";
import pc from "picocolors";

export const requestLoggerPlugin = createApp()
  .onGlobalRequest(({ request }) => {
    consola.info(
      `${pc.cyan("[http]")} ${getRequestColor(request.method)(request.method)} ${request.url}`,
    );
  })
  .export();

function getRequestColor(method: string) {
  switch (method.toUpperCase()) {
    case "GET":
      return pc.blue;
    case "POST":
      return pc.green;
    case "PUT":
      return pc.yellow;
    case "DELETE":
      return pc.red;
    default:
      return pc.dim;
  }
}
