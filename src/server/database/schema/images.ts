// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import posts from "./posts";
import users from "./users";

const images = sqliteTable(
  "images",
  {
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
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`STRFTIME('%s','NOW')`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`STRFTIME('%s','NOW')`),
  },
  (table) => {
    return {
      imagePostIdIdx: index("image_post_id_idx").on(table.postId),
      imageIdPostIdIdx: index("image_id_post_id_idx").on(table.postId, table.id),
    };
  }
);

export const insertImageSchema = createInsertSchema(images);
export type InsertImageType = z.infer<typeof insertImageSchema>;

export const selectImageSchema = createSelectSchema(images);
export type SelectImageType = z.infer<typeof selectImageSchema>;

export default images;
