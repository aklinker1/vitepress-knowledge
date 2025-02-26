import Elysia from "elysia";
import { getModelsRoute } from "./get-models";
import { postChatRoute } from "./post-chat";

export const apiRoute = new Elysia({ prefix: "/api" })
  .use(getModelsRoute)
  .use(postChatRoute);
