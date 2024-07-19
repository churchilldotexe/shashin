import "server-only";
import { ZodError } from "zod";
import { type CreateUserTypes, createUserSchema } from "../db/schema/users";
import { turso } from "../turso";
import crypto, { randomUUID } from "node:crypto";

// for better password protection
const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

// for User security
const generateHashPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
};

export async function createUser(userInfo: CreateUserTypes) {
  const parsedUserInfo = createUserSchema.safeParse(userInfo);
  if (parsedUserInfo.success === false) {
    throw new ZodError(parsedUserInfo.error.errors);
  }

  console.log("parsed success");

  const { hashedPassword: password, userName, email, displayName } = parsedUserInfo.data;

  const salt = generateSalt();
  console.log("salt", salt);
  const hashedPassword = generateHashPassword(password, salt);
  console.log("hasedpw", hashedPassword);
  const id = randomUUID();

  await turso.execute({
    sql: `INSERT INTO
            users
              (user_name, email, display_name, hashed_password,id)
          VALUES
              (:userName, :email, :displayName, :hashedPassword, :id)`,
    args: { userName, email, displayName, hashedPassword, id },
  });

  console.log("able to create user in db");
}
