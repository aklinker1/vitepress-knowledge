import { treaty } from "@elysiajs/eden";
import type { app } from "../../server/main";

export const apiClient = treaty<app>(location.host);
