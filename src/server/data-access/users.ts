import "server-only";

import {
  generateFingerprint,
  getAuthenticatedId,
  signAndSetAccessToken,
  verifyRefreshToken,
} from "@/server/use-cases/auth/tokenManagement";
import type { Row } from "@libsql/client";
import { redirect } from "next/navigation";
import { ZodError, type z } from "zod";
import { type CreateUserTypes, createUserSchema, getUserSchema } from "../database/schema/users";
import { turso } from "../database/turso";

export async function getUserName({ userName }: Pick<CreateUserTypes, "userName">) {
  const user = await turso.execute({
    sql: `SELECT user_name
          FROM users
          WHERE user_name = :userName
      `,
    args: { userName },
  });
  const parsedUser = createUserSchema
    .pick({ userName: true })
    .safeParse({ userName: user.rows[0]?.user_name });
  if (parsedUser.success === false) {
    return;
  }
  return parsedUser.data.userName;
}

export async function getEmail({ email }: Pick<CreateUserTypes, "email">) {
  const user = await turso.execute({
    sql: `SELECT email
          FROM users
          WHERE email = :email
      `,
    args: { email },
  });
  const parsedUser = createUserSchema.pick({ email: true }).safeParse(user.rows[0]);
  if (parsedUser.success === false) {
    return;
  }
  return parsedUser.data.email;
}

export async function createUser({
  email,
  id,
  userName,
  displayName,
  hashedPassword,
  salt,
}: CreateUserTypes) {
  if (id === undefined) {
    throw new Error("Id must be defined");
  }
  await turso.execute({
    sql: `INSERT INTO
            users
              (user_name, email, display_name, hashed_password,id, salt)
            VALUES
              (:userName, :email, :displayName, :hashedPassword, :id, :salt)`,
    args: { userName, email, displayName, hashedPassword, id, salt },
  });
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

export async function getUserInfoByUsername(userName: string) {
  const rawDbData = await turso.execute({
    sql: " SELECT hashed_password, salt, id, refresh_token FROM users where user_name = :userName ",
    args: { userName },
  });

  const parsedDbData = DBDataSchema.safeParse({
    hashedPassword: rawDbData.rows[0]?.hashed_password,
    salt: rawDbData.rows[0]?.salt,
    id: rawDbData.rows[0]?.id,
    refreshToken: rawDbData.rows[0]?.refresh_token,
  });

  if (parsedDbData.success === false) {
    return;
  }

  return parsedDbData.data;
}

const updateRefreshTokenAndFingerPrintSchema = getUserSchema.pick({
  id: true,
  refreshToken: true,
  tokenFingerprint: true,
});
type UpdateRefreshAndFingerPrintToken = z.infer<typeof updateRefreshTokenAndFingerPrintSchema>;

export async function updateRefreshAndFingerPrintToken({
  id,
  tokenFingerprint,
  refreshToken,
}: UpdateRefreshAndFingerPrintToken) {
  const parsedTokenData = updateRefreshTokenAndFingerPrintSchema.safeParse({
    refreshToken,
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
    throw new Error("Verification failed, try again");
  }
}

const tokenDataFromDBSchema = getUserSchema.pick({
  refreshToken: true,
  tokenFingerprint: true,
});

export async function getRefreshAndFingerprintToken(userId: string) {
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
    return;
  }
  return parsedTokenData.data;
}

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

export async function updateTokensFromDB(id: string) {
  try {
    await turso.execute({
      sql: `
        UPDATE users
        SET refresh_token=NULL, token_fingerprint=NULL
        WHERE id = :id 
        `,
      args: { id },
    });
  } catch (error) {
    throw new Error("no user found with this ID, unable to remove the tokens");
  }
}
