import "server-only";

import crypto, { randomUUID } from "node:crypto";
import {
  createUser,
  getEmail,
  getUserInfoByUsername,
  getUserName,
  updateRefreshAndFingerPrintToken,
} from "@/server/data-access/users";
import type { Row } from "@libsql/client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { createUserSchema, getUserSchema } from "../../database/schema/users";
import { turso } from "../../database/turso";
import { registerUserSchema, type registerUserSchemaTypes } from "./authenticationTypesAndSchema";
import {
  generateFingerprint,
  getAuthenticatedId,
  signAndSetAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./tokenManagement";

export async function verifyUserInfo({
  userName,
  email,
}: {
  email: string;
  userName: string;
}): Promise<{ userName?: string; email?: string } | undefined> {
  const userNameInfo = await getUserName({ userName });
  const emailInfo = await getEmail({ email });
  if (userNameInfo === undefined && emailInfo === undefined) {
    return;
  }
  return {
    userName: userNameInfo ? "Username already exist" : undefined,
    email: emailInfo ? "email already exist" : undefined,
  };
}

// for better password protection
const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

// for User security
const generateHashPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
};

export async function registerUser(userInfo: registerUserSchemaTypes) {
  const parsedUserInfo = registerUserSchema.safeParse(userInfo);
  if (parsedUserInfo.success === false) {
    throw new ZodError(parsedUserInfo.error.errors);
  }

  const { password, userName, email, displayName } = parsedUserInfo.data;
  const salt = generateSalt();
  const hashedPassword = generateHashPassword(password, salt);
  const id = randomUUID();
  try {
    await createUser({
      salt,
      hashedPassword,
      displayName,
      userName,
      id,
      email,
    });
  } catch (error) {
    throw new Error("Unable to create user please Try again");
  }
}

export async function authenticateUser({
  userName,
  password,
  rememberMe,
  ip,
  userAgent,
}: {
  password: string;
  userName: string;
  rememberMe: boolean;
  ip: string;
  userAgent: string;
}): Promise<{ userName?: string; password?: string } | "success"> {
  const dbData = await getUserInfoByUsername(userName);
  if (dbData === undefined) {
    return { userName: "Invalid User, Please try again" };
  }

  const { hashedPassword: dbHashedPassword, salt, id, refreshToken } = dbData;
  const generatedHashedPassword = generateHashPassword(password, salt);

  if (generatedHashedPassword === dbHashedPassword) {
    await signAndSetAccessToken(id, rememberMe);

    // to lessen/avoid DB query if refreshToken is still valid
    if (refreshToken === null ?? verifyRefreshToken(refreshToken as string) === undefined) {
      const signedRefreshToken = await signRefreshToken(id);
      const tokenFingerprint = await generateFingerprint({ userAgent, ip });

      try {
        await updateRefreshAndFingerPrintToken({
          refreshToken: signedRefreshToken,
          tokenFingerprint,
          id,
        });
      } catch (error) {
        return { password: "verification failed.Please try again" };
      }
    }
    return "success";
  }
  return { password: "Invalid Password.Please try again" };
}
