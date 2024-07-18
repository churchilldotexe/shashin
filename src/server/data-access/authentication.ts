import "server-only";
import { ZodError } from "zod";
import { type CreateUserTypes, createUserSchema } from "../db/schema/users";
import { turso } from "../turso";

export async function createUser(userInfo: CreateUserTypes) {
  const parsedUserInfo = createUserSchema.safeParse(userInfo);
  if (parsedUserInfo.success === false) {
    throw new ZodError(parsedUserInfo.error.errors);
  }

  await turso.execute({
    sql: `INSERT INTO
            users
              (user_name, email, display_name, hashed_password, refresh_token, token_fingerprint, id)
          VALUES
              (:username, :email, :displayName, :hashedPassword, :refreshToken, :tokenFingerprint, :id)`,
    args: parsedUserInfo.data,
  });
}
