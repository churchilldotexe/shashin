import "server-only";

import { randomUUID } from "node:crypto";
import {
  generateFingerprint,
  generateHashPassword,
  generateSalt,
  getAuthenticatedId,
  signAndSetAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@/lib/auth";
import type { Row } from "@libsql/client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { type CreateUserTypes, createUserSchema, getUserSchema } from "../db/schema/users";
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
    throw new Error("unable to to create the user");
  }
}

const getUserQuerySchema = getUserSchema.pick({
  id: true,
  email: true,
  displayName: true,
  userName: true,
});

export async function getUserInfo() {
  const { userId } = await getAuthenticatedId();
  try {
    const rawUserInfo = await turso.execute({
      sql: `
        SELECT 
          id,email,display_name,user_name, hashed_password 
        FROM users
        WHERE  id= :userId
        `,
      args: { userId },
    });

    const {
      display_name: displayName,
      id,
      email,
      user_name: userName,
    } = rawUserInfo.rows[0] as Row;

    const parsedUserInfo = getUserQuerySchema.safeParse({
      displayName,
      id,
      email,
      userName,
    });

    if (parsedUserInfo.success === false) {
      throw new ZodError(parsedUserInfo.error.errors);
    }

    return parsedUserInfo.data;
  } catch (error) {
    throw new Error("an error Occured while getting the users Info ");
  }
}

const DBDataSchema = getUserSchema.pick({
  hashedPassword: true,
  salt: true,
  id: true,
  refreshToken: true,
});

const UpdateRefreshTokenAndFingerPrintSchema = getUserSchema.pick({
  id: true,
  refreshToken: true,
  tokenFingerprint: true,
});

export async function authenticateUser(
  password: string,
  userName: string,
  rememberMe: boolean
): Promise<{ userName?: string; password?: string } | undefined> {
  const rawDbData = await turso.execute({
    sql: " SELECT hashed_password, salt, id, refresh_token FROM users where user_name = :userName ",
    args: { userName },
  });

  const parsedDbHashedPassword = DBDataSchema.safeParse({
    hashedPassword: rawDbData.rows[0]?.hashed_password,
    salt: rawDbData.rows[0]?.salt,
    id: rawDbData.rows[0]?.id,
    refreshToken: rawDbData.rows[0]?.refresh_token,
  });

  if (parsedDbHashedPassword.success === false) {
    return { userName: "Invalid username. try Registering" };
  }

  const { hashedPassword: dbHashedPassword, salt, id, refreshToken } = parsedDbHashedPassword.data;
  const generatedHashedPassword = generateHashPassword(password, salt);

  if (generatedHashedPassword === dbHashedPassword) {
    await signAndSetAccessToken(id, rememberMe);

    // to lesses/avoid DB query if refreshToken is still valid
    if (refreshToken === null ?? verifyRefreshToken(refreshToken as string) === undefined) {
      const signedRefreshToken = await signRefreshToken(id);

      const headersList = headers();
      const ip = headersList.get("x-forwarded-for") as string;
      const userAgent = headersList.get("user-agent") as string;
      const tokenFingerprint = await generateFingerprint({ userAgent, ip });

      const parsedTokenData = UpdateRefreshTokenAndFingerPrintSchema.safeParse({
        refreshToken: signedRefreshToken,
        tokenFingerprint,
        id,
      });

      if (parsedTokenData.success === false) {
        throw new ZodError(parsedTokenData.error.errors);
      }

      const {
        tokenFingerprint: fingerPrint,
        id: userId,
        refreshToken: JWTRefreshToken,
      } = parsedTokenData.data;

      try {
        await turso.execute({
          sql: `
            UPDATE users
            SET refresh_token = :JWTRefreshToken, token_fingerprint= :fingerPrint
            WHERE id= :userId
            `,
          args: { JWTRefreshToken, fingerPrint, userId },
        });
      } catch (error) {
        return { password: "verification failed. Try again" };
      }
    }
    return;
  }
  return { password: "Invalid Password. You may try again" };
}

const tokenDataFromDBSchema = getUserSchema.pick({
  refreshToken: true,
  tokenFingerprint: true,
});

export async function refreshAccessToken({
  userAgent,
  ip,
  userId,
}: {
  userId: string;
  ip: string;
  userAgent: string;
}) {
  try {
    const tokenDataFromDB = await turso.execute({
      sql: `
        SELECT 
          refresh_token,token_fingerprint  
        FROM users 
        WHERE id= :userId
      `,
      args: { userId },
    });

    const parsedTokenData = tokenDataFromDBSchema.safeParse({
      refreshToken: tokenDataFromDB.rows[0]?.refresh_token,
      tokenFingerprint: tokenDataFromDB.rows[0]?.token_fingerprint,
    });

    if (parsedTokenData.success === false) {
      throw new ZodError(parsedTokenData.error.errors);
    }

    const { tokenFingerprint, refreshToken } = parsedTokenData.data;

    //to prevent AccessToken from cookie for being compromised
    const generatedFingerPrint = await generateFingerprint({ ip, userAgent });

    if (tokenFingerprint === null ?? tokenFingerprint !== generatedFingerPrint) {
      await removeTokenInfoFromDB();
      redirect("/login");
    }

    const verifiedRefreshToken = await verifyRefreshToken(refreshToken as string);

    // to ensure that refresh token is valid
    if (!verifiedRefreshToken) {
      redirect("/login");
    }
    await signAndSetAccessToken(userId);
  } catch (error) {
    redirect("/login");
  }
}

export async function removeTokenInfoFromDB() {
  const accessToken = cookies().get("accessToken")?.value;
  const verifiedId = await verifyAccessToken(accessToken);
  if (!verifiedId) {
    redirect("/login");
  }

  await turso.execute({
    sql: `
        UPDATE users
        SET refresh_token=NULL, token_fingerprint=NULL
        WHERE id = :id 
        `,
    args: { id: verifiedId.userId },
  });

  cookies().delete("accessToken");
}
