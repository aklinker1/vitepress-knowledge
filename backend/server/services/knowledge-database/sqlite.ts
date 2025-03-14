import type { KnowledgeDatabase } from ".";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "../../db/sqlite/schema";
import { eq, lt, sql } from "drizzle-orm";
import env from "../../utils/env";
import { logStartupInfo } from "../../utils/log";
import { Cron } from "croner";

const { messages, conversations } = schema;

export async function createSqliteKnowledgeDatabase(): Promise<KnowledgeDatabase> {
  const file = env.DATABASE_SQLITE_PATH;

  logStartupInfo("Database", [
    [
      { key: "type", value: "sqlite", color: "blue" },
      { key: "path", value: file, color: "cyan" },
    ],
  ]);

  await mkdir(dirname(file), { recursive: true });
  const db = drizzle(file, {
    casing: "snake_case",
    schema,
    // Uncomment to log SQL queries
    // logger: {
    //   logQuery: console.debug,
    // },
  });

  migrate(db, { migrationsFolder: "server/drizzle/sqlite" });
  db.run(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
  `);

  // Setup jobs

  // Daily vacuum to minimize the database
  new Cron("@daily", () => db.run("VACUUM"));
  // Delete old conversations (30 days)
  new Cron(
    "@daily",
    async () =>
      await db
        .delete(conversations)
        .where(
          lt(
            sql`date(${conversations.createdAt})`,
            sql`date('now', '-30 days')`,
          ),
        ),
  );

  // Build KnowledgeDatabase abstraction

  const database: KnowledgeDatabase = {
    conversations: {
      get: (id: string) =>
        db.query.conversations.findFirst({
          where: eq(conversations.id, id),
          with: { messages: true },
        }),
      insert: async (conversation) => {
        const [result] = await db
          .insert(conversations)
          .values(conversation)
          .returning();
        return result;
      },
      getOrInsert: async (conversation) => {
        if (conversation.id != null) {
          const existing = await database.conversations.get(conversation.id);
          if (existing) return existing;
        }
        return await database.conversations.insert(conversation);
      },
    },
    messages: {
      get: (id: string) =>
        db.query.messages.findFirst({ where: eq(messages.id, id) }),
      insert: async (conversationId, message) => {
        const [result] = await db
          .insert(messages)
          .values({ conversationId, ...message })
          .returning();
        return result;
      },
      getOrInsert: async (conversationId, message) => {
        if (message.id != null) {
          const existing = await database.messages.get(message.id);
          if (existing) return existing;
        }
        return await database.messages.insert(conversationId, message);
      },
    },
  };
  return database;
}
