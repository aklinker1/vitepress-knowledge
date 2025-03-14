import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const conversations = sqliteTable("conversations", {
  id: text().primaryKey().$defaultFn(createId),
  createdAt: int({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: int({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});
export const conversationRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));

export const messages = sqliteTable(
  "messages",
  {
    id: text().primaryKey().$defaultFn(createId),
    conversationId: text()
      .notNull()
      .references(() => conversations.id),
    createdAt: int({ mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: int({ mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    role: text({ enum: ["user", "assistant"] }).notNull(),
    content: text().notNull(),
  },
  (t) => [index("messages_conversation_id_idx").on(t.conversationId)],
);

export const messageRelations = relations(messages, ({ one }) => ({
  conversations: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));
