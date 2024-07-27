// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
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
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  postId: text("post_id")
    .notNull()
    .references(() => posts.id),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const insertImageSchema = createInsertSchema(images);
export type InsertImageType = z.infer<typeof insertImageSchema>;

export const selectImageSchema = createSelectSchema(images);
export type SelectImageType = z.infer<typeof selectImageSchema>;

export const imagesRelations = relations(images, ({ one }) => ({
  post: one(posts, {
    fields: [images.postId],
    references: [posts.id],
  }),
}));

export default images;
