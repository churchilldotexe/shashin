// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userName: text("user_name", { length: 255 }).unique().notNull(),
  email: text("email", { length: 255 }).unique().notNull(),
  displayName: text("display_name", { length: 255 }).notNull(),
  hashedPassword: text("hashed_password").notNull(),
  salt: text("salt").notNull(),
  refreshToken: text("refresh_token"),
  tokenFingerprint: text("token_fingerprint"),
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const createUserSchema = createInsertSchema(users);
export type CreateUserTypes = z.infer<typeof createUserSchema>;

export const getUserSchema = createSelectSchema(users);
export type GetUserTypes = z.infer<typeof getUserSchema>;

export default users;
