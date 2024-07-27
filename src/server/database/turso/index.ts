import { env } from "@/env";
import { createClient } from "@libsql/client";
import "server-only";

export const turso = createClient({
  url: env.DATABASE_URL as string,
  authToken: env.DATABASE_AUTH_TOKEN,
});
