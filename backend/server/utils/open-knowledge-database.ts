import env from "./env";
import type { KnowledgeDatabase } from "../services/knowledge-database";
import { createSqliteKnowledgeDatabase } from "../services/knowledge-database/sqlite";

export async function openKnowledgeDatabase(): Promise<KnowledgeDatabase> {
  switch (env.DATABASE_TYPE) {
    case "sqlite":
      return createSqliteKnowledgeDatabase();
    default:
      throw new Error(`Unsupported database type: ${env.DATABASE_TYPE}`);
  }
}
