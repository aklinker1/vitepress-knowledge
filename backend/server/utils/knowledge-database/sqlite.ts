import type { KnowledgeDatabase } from ".";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "../../db/sqlite/schema";
import { eq } from "drizzle-orm";
import env from "../env";
import { logStartupInfo } from "../log";

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
    //   logQuery: consola.withTag("sqlite").debug,
    // },
  });
  migrate(db, { migrationsFolder: "server/drizzle/sqlite" });

  const database: KnowledgeDatabase = {
    conversations: {
      get: (id: string) =>
        db.query.conversations.findFirst({
          where: eq(conversations.id, id),
          with: { messages: true },
        }),
      upsert: async (conversation) => {
        const [result] = await db
          .insert(conversations)
          .values(conversation)
          .onConflictDoUpdate({
            target: conversations.id,
            set: {
              updatedAt: new Date(),
            },
          })
          .returning();
        return result;
      },
      saveWithMessages: async (conversation) => {
        const { messages, ...values } = conversation;
        const newConversation = await database.conversations.upsert(values);
        const newMessages = messages
          ? await Promise.all(
              messages.map((message) =>
                database.messages.upsert(newConversation.id, message),
              ),
            )
          : [];
        return {
          ...newConversation,
          messages: newMessages,
        };
      },
    },
    messages: {
      get: (id: string) =>
        db.query.messages.findFirst({ where: eq(messages.id, id) }),
      upsert: async (conversationId, message) => {
        const insertValue = {
          conversationId,
          ...message,
        };
        const { id: _, ...updateValues } = message;

        const [result] = await db
          .insert(messages)
          .values(insertValue)
          .onConflictDoUpdate({
            target: messages.id,
            setWhere: eq(messages.conversationId, conversationId),
            set: {
              role: updateValues.role,
              content: updateValues.content,
              updatedAt: new Date(),
            },
          })
          .returning();
        return result;
      },
    },
  };
  return database;
}
