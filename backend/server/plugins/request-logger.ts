import { consola } from "consola";
import { Elysia } from "elysia";
import pc from "picocolors";

export const requestLogger = new Elysia({
  name: "request-logger",
}).onBeforeHandle(({ path, request }) => {
  consola.info(
    `${pc.cyan("[http]")} ${getRequestColor(request.method)(request.method)} ${path}`,
  );
});

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
