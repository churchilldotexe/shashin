import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import posts from "./posts";
import users from "./users";

const favorites = sqliteTable("favorites", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`STRFTIME('%s','NOW')`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`STRFTIME('%s','NOW')`),
});

export const insertFavoritesSchema = createInsertSchema(favorites);
export type InserFavoriteTypes = z.infer<typeof insertFavoritesSchema>;

export const selectFavoriteSchema = createSelectSchema(favorites);
export type SelectFavoriteTypes = z.infer<typeof selectFavoriteSchema>;

export default favorites;
