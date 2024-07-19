import "server-only";

import { randomUUID } from "node:crypto";
import { generateHashPassword, generateSalt } from "@/lib/auth";
import type { Row } from "@libsql/client";
import { ZodError } from "zod";
import {
  type CreateUserTypes,
  type GetUserTypes,
  createUserSchema,
  getUserSchema,
} from "../db/schema/users";
import { turso } from "../turso";

export async function createUser(userInfo: Omit<CreateUserTypes, "salt">) {
  const parsedUserInfo = createUserSchema.omit({ salt: true }).safeParse(userInfo);
  if (parsedUserInfo.success === false) {
    throw new ZodError(parsedUserInfo.error.errors);
  }

  const { hashedPassword: password, userName, email, displayName } = parsedUserInfo.data;
  // NOTE: do a query for username and email makesure it is unique
  const salt = generateSalt();
  const hashedPassword = generateHashPassword(password, salt);
  const id = randomUUID();
  try {
    await turso.execute({
      sql: `INSERT INTO
            users
              (user_name, email, display_name, hashed_password,id, salt)
            VALUES
              (:userName, :email, :displayName, :hashedPassword, :id, :salt)`,
      args: { userName, email, displayName, hashedPassword, id, salt },
    });
  } catch (error) {
    //TODO: handle this error properly // handle conflict
    throw new Error("unable to to create the user");
  }
}

const getUserQuerySchema = getUserSchema.pick({
  id: true,
  email: true,
  displayName: true,
  userName: true,
});

export async function getUser({ userName }: Pick<GetUserTypes, "userName">) {
  try {
    const rawUserInfo = await turso.execute({
      sql: `
        SELECT 
          id,email,display_name,user_name, hashed_password 
        FROM users
        WHERE user_name= :userName
        `,
      args: { userName },
    });

    const { display_name: displayName, id, email } = rawUserInfo.rows[0] as Row;

    const parsedUserInfo = getUserQuerySchema.safeParse({
      displayName,
      id,
      email,
      userName,
    });

    if (parsedUserInfo.success === false) {
      console.log(parsedUserInfo.error.errors);
    }

    console.log(parsedUserInfo.data);
    return parsedUserInfo.data;
  } catch (error) {
    //TODO: handle a proper error
    console.log("error here", error as Error);
    throw new Error("an error Occured while getting the users Info ");
  }
}

const verifyUserSchema = getUserSchema.pick({
  hashedPassword: true,
  salt: true,
});

export async function verifyUser(password: string, userName: string) {
  const rawDbData = await turso.execute({
    sql: " SELECT hashed_password, salt FROM users where user_name = :userName ",
    args: { userName },
  });

  const parsedDbHashedPassword = verifyUserSchema.safeParse({
    hashedPassword: rawDbData.rows[0]?.hashed_password,
    salt: rawDbData.rows[0]?.salt,
  });

  if (parsedDbHashedPassword.success === false) {
    throw new ZodError(parsedDbHashedPassword.error.errors);
  }

  const { hashedPassword: dbHashedPassword, salt } = parsedDbHashedPassword.data;
  const generatedHashedPassword = generateHashPassword(password, salt);

  if (generatedHashedPassword === dbHashedPassword) {
    console.log("User authenticated");
    //TODO: setup JWT check docs for SERVER ACTION cookie writing
    // setup middleware JWT checking on protected ROUTE
    // Try to find out how to read the userId with JWT and make that as a query authentication...
    // meaning--> every server action youll read a JWT and decrypt the userdID and use it as a query key
  }
}
