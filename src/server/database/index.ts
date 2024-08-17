import { env } from "@/env";
import * as schema from "@/server/database/schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const connection = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(connection, { logger: true, schema });

export type db = typeof db;

export default db;
