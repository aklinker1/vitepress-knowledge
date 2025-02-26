import Elysia from "elysia";

export const indexRoute = new Elysia().get("/", ({ redirect }) => {
  return redirect("/ask-ai.js", 302);
});
