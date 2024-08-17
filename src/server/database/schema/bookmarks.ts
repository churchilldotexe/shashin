import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import posts from "./posts";
import users from "./users";

const bookmarks = sqliteTable(
  "bookmarks",
  {
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
  },
  (table) => {
    return {
      bookmarksUserIdPostIdIdx: index("bookmarks_user_id_post_id_idx").on(
        table.userId,
        table.postId
      ),
      bookmarksUserIdIdx: index("bookmarks_user_id_idx").on(table.userId),
    };
  }
);

export const insertBookmarksSchema = createInsertSchema(bookmarks);
export type InserBookmarkTypes = z.infer<typeof insertBookmarksSchema>;

export const selectBookmarkSchema = createSelectSchema(bookmarks);
export type SelectBookmarksTypes = z.infer<typeof selectBookmarkSchema>;

export default bookmarks;
