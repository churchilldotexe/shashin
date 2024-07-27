// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
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
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const insertPostSchema = createInsertSchema(posts);
export type InsertPostSchemaTypes = z.infer<typeof insertPostSchema>;

export const selectPostSchema = createSelectSchema(posts);
export type SelectPostSchema = z.infer<typeof selectPostSchema>;

// NOTE: relations: 1 post can have many images (one to many)

export const postsRelations = relations(posts, ({ many }) => ({
  images: many(images),
}));

export default posts;
