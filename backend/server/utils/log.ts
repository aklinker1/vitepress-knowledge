import pc from "picocolors";
import env from "./env";
import type { AiModelDefinition } from "../services/ai-service";

export type StartupInfoField = {
  key: string;
  value: any;
  color: "green" | "cyan" | "red" | "blue" | "dim";
};
export type StartupInfoRow = StartupInfoField[];

export function logStartupInfo(name: string, rows: StartupInfoRow[]): void {
  console.info(pc.bold(name + ":"));
  rows.forEach((fields) => {
    const strings = fields.map(({ key, value, color }) => {
      const colorFn = pc[color];
      const str = toString(value);
      return `${pc.dim(key + "=")}${colorFn(str)}`;
    });
    console.info("  " + strings.join(" "));
  });
}

export function envRow(key: keyof typeof env): StartupInfoRow {
  const redacted =
    key.includes("API_KEY") ||
    key.includes("SECRET") ||
    key.includes("PASSWORD") ||
    key.includes("TOKEN");
  let value =
    redacted && env[key]
      ? "<REDACTED>"
      : toString(env[key]).replaceAll("\n", "\\n");
  if (value.length > 60) {
    value = value.slice(0, 57) + "...";
  }
  return [
    {
      key,
      value,
      color: "cyan",
    },
  ];
}
export function aiModelRow(def: AiModelDefinition): StartupInfoRow {
  return [
    {
      key: "model",
      value: def.name,
      color: "blue",
    },
    {
      key: "env",
      value: def.env,
      color: "cyan",
    },
    {
      key: "enabled",
      value: def.enabled,
      color: def.enabled ? "green" : "red",
    },
  ];
}

export function aiModelRows(defs: AiModelDefinition[]): StartupInfoRow[] {
  return defs.map(aiModelRow);
}

export function aiServiceRow(apiKeyEnvVar: keyof typeof env): StartupInfoRow {
  return [
    {
      key: "enabled",
      value: !!env[apiKeyEnvVar],
      color: env[apiKeyEnvVar] ? "green" : "red",
    },
    {
      key: "env",
      value: apiKeyEnvVar,
      color: "cyan",
    },
    {
      key: "apiKey",
      value: "<REDACTED>",
      color: "dim",
    },
  ];
}

function toString(value: any): string {
  if (value instanceof Set) {
    return `Set(${Array.from(value).join()})`;
  }
  return String(value);
}
