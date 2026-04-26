import { createApp } from "@aklinker1/zeta";
import { container } from "../dependencies";

export const decorateContextPlugin = createApp()
  .decorate(container.resolveAll())
  .export();
