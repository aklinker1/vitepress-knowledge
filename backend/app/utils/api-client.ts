import { createAppClient } from "@aklinker1/zeta/client";
import type { App } from "../../server/main";

export const apiClient = createAppClient<App>();
