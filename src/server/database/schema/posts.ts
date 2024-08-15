// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import users from "./users";

export const posts = sqliteTable(
  "posts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    description: text("description", { length: 255 }),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`STRFTIME('%s','NOW')`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`STRFTIME('%s','NOW')`),
  },
  (table) => {
    return {
      userIdIdx: index("user_id_idx").on(table.userId),
      postsIdUserIdIdx: index("posts_id_user_id_idx").on(table.id, table.userId),
      createdIdx: index("created_at_idx").on(table.createdAt),
    };
  }
);

export const insertPostSchema = createInsertSchema(posts);
export type InsertPostSchemaTypes = z.infer<typeof insertPostSchema>;

export const selectPostSchema = createSelectSchema(posts);
export type SelectPostSchema = z.infer<typeof selectPostSchema>;

export default posts;
