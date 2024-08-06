import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import images from "./images";
import posts from "./posts";
import users from "./users";

const albums = sqliteTable("albums", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 255 }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  imageId: text("image_id")
    .notNull()
    .references(() => images.id),
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

export const insertAlbumsSchema = createInsertSchema(albums);
export type InsertAlbumsTypes = z.infer<typeof insertAlbumsSchema>;

export const getAlbumsSchema = createSelectSchema(albums);
export type GetAlbumsTypes = z.infer<typeof getAlbumsSchema>;

export default albums;
