// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import images from "./images";
import users from "./users";

export const posts = sqliteTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  description: text("description", { length: 255 }),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`STRFTIME('%s','NOW')`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`STRFTIME('%s','NOW')`),
});

export const insertPostSchema = createInsertSchema(posts);
export type InsertPostSchemaTypes = z.infer<typeof insertPostSchema>;

export const selectPostSchema = createSelectSchema(posts);
export type SelectPostSchema = z.infer<typeof selectPostSchema>;

export default posts;
