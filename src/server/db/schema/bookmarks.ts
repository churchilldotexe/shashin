import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import allPosts from "./allPosts";

const bookmarks = sqliteTable("bookmarks", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  allPostId: text("all_post_id")
    .notNull()
    .references(() => allPosts.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export default bookmarks;
