import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import posts from "./posts";

const allPosts = sqliteTable("all_posts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`STRFTIME('%s','NOW')`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`STRFTIME('%s','NOW')`),
});

export const createAllPostsSchema = createInsertSchema(allPosts);
export type CreateAllPostsSchemaTypes = z.infer<typeof createAllPostsSchema>;

export const getAllPostSchema = createSelectSchema(allPosts);
export type GetAllPostSchemaTypes = z.infer<typeof getAllPostSchema>;

export default allPosts;
