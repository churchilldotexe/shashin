// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import posts from "./posts";
import users from "./users";

const images = sqliteTable("images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  url: text("url").notNull(),
  name: text("name", { length: 255 }).notNull(),
  type: text("type", {
    enum: ["image/jpeg", "image/jpg", "image/bmp", "image/png", "image/gif", "image/webp"],
  }).notNull(),
  fileKey: text("file_key").notNull(),
  isFavorited: integer("is_favorited", { mode: "boolean" }).default(false),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
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

export const insertImageSchema = createInsertSchema(images);
export type InsertImageType = z.infer<typeof insertImageSchema>;

export const selectImageSchema = createSelectSchema(images);
export type SelectImageType = z.infer<typeof selectImageSchema>;

export default images;
