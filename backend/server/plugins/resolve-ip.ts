import { Elysia } from "elysia";

export const resolveIp = new Elysia({ name: "resolve-ip" })
  .resolve(() => {
    // TODO
  })
  .as("plugin");
