import "server-only";

import type { Row } from "@libsql/client";
import { sql } from "drizzle-orm";
import { Update } from "next/dist/build/swc";
import { ZodError, z } from "zod";
import { type CreateUserTypes, createUserSchema, getUserSchema } from "../database/schema/users";
import { turso } from "../database/turso";

export async function createUser({
  email,
  id,
  userName,
  hashedPassword,
  salt,
}: Omit<CreateUserTypes, "displayName">) {
  if (id === undefined) {
    throw new Error("Id must be defined");
  }
  const temporaryDisplayName = userName;
  await turso.execute({
    sql: `INSERT INTO
            users
              (user_name, email, display_name ,hashed_password,id, salt)
            VALUES
              (:userName, :email,:temporaryDisplayName, :hashedPassword, :id, :salt)`,
    args: { userName, email, temporaryDisplayName, hashedPassword, id, salt },
  });
}

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

const getUserQuerySchema = getUserSchema.pick({
  id: true,
  email: true,
  displayName: true,
  userName: true,
  avatar: true,
});

export async function getUserInfoById(userId: string) {
  const rawUserInfo = await turso.execute({
    sql: `
        SELECT 
          id,email,display_name,user_name,avatar  
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
    avatar,
  } = rawUserInfo.rows[0] as Row;

  const parsedUserInfo = getUserQuerySchema.safeParse({
    displayName,
    id,
    email,
    userName,
    avatar,
  });

  if (parsedUserInfo.success === false) {
    throw new ZodError(parsedUserInfo.error.errors);
  }

  return parsedUserInfo.data;
}

const updateUserSchema = createUserSchema.pick({
  displayName: true,
  avatar: true,
  urlKey: true,
});
type UpdateUserTypes = z.infer<typeof updateUserSchema>;

export async function updateUserInfoById({
  urlKey,
  avatar,
  userId,
  displayName,
}: { userId: string } & UpdateUserTypes) {
  const parsedUserInfo = updateUserSchema.safeParse({
    urlKey,
    avatar,
    displayName,
  });

  if (parsedUserInfo.success === false) {
    console.error(parsedUserInfo.error.cause);
    throw new ZodError(parsedUserInfo.error.errors);
  }

  await turso.execute({
    sql: `
         UPDATE users 
         SET 
            display_name = :displayName,
            avatar = :avatar,
            url_key = :urlKey
         WHERE id = :userId
         `,
    args: {
      userId,
      avatar: parsedUserInfo.data.avatar as string,
      urlKey: parsedUserInfo.data.urlKey as string,
      displayName: parsedUserInfo.data.displayName,
    },
  });
}

const updateDisplayNameByIdTypeSchema = createUserSchema.pick({
  displayName: true,
});

type UpdateDisplayNameByIdType = z.infer<typeof updateDisplayNameByIdTypeSchema> & {
  userId: string;
};

export async function updateDisplayNameById({ userId, displayName }: UpdateDisplayNameByIdType) {
  const parsedUserInfo = updateDisplayNameByIdTypeSchema.safeParse({
    displayName,
  });

  if (parsedUserInfo.success === false) {
    console.error(parsedUserInfo.error.cause);
    throw new ZodError(parsedUserInfo.error.errors);
  }

  await turso.execute({
    sql: `
         UPDATE users 
         SET 
            display_name = :displayName
         WHERE id = :userId
         `,
    args: {
      userId,
      displayName: parsedUserInfo.data.displayName,
    },
  });
}

const updateAvatarFromDBSchema = createUserSchema.pick({
  urlKey: true,
  avatar: true,
});

type UpdateAvatarFromDBTypes = z.infer<typeof updateAvatarFromDBSchema> & {
  userId: string;
};

export async function updateAvatarFromDB({ urlKey, avatar, userId }: UpdateAvatarFromDBTypes) {
  const parsedUserInfo = updateAvatarFromDBSchema.safeParse({
    urlKey,
    avatar,
  });

  if (parsedUserInfo.success === false) {
    console.error(parsedUserInfo.error.cause);
    throw new ZodError(parsedUserInfo.error.errors);
  }

  await turso.execute({
    sql: `
         UPDATE users 
         SET 
            avatar = :avatar,
            url_key = :urlKey
         WHERE id = :userId
         `,
    args: {
      userId,
      avatar: parsedUserInfo.data.avatar as string,
      urlKey: parsedUserInfo.data.urlKey as string,
    },
  });
}

export async function getAvatarImgKeyFromDB(userId: string) {
  const rawImageKey = await turso.execute({
    sql: `
         SELECT
            u.url_key as urlKey
         FROM
            users u
         WHERE u.id = :userId
         `,
    args: { userId },
  });

  const parsedImageKey = getUserSchema.pick({ urlKey: true }).safeParse(rawImageKey.rows[0]);
  if (parsedImageKey.success === false) {
    throw new ZodError(parsedImageKey.error.errors);
  }
  return parsedImageKey.data;
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

const userStatsSchema = z.object({
  images: z.number(),
  posts: z.number(),
  favorites: z.number(),
  bookmarks: z.number(),
  albums: z.number(),
});

export async function getUserStatsFromDb(userId: string) {
  const rawusersStats = await turso.execute({
    sql: `
         SELECT
         COUNT(DISTINCT images.id) AS images,
         COUNT(DISTINCT p.id) AS posts,
         COUNT(DISTINCT CASE WHEN images.is_favorited = TRUE THEN images.id END) AS favorites,
         COUNT(DISTINCT b.id) AS bookmarks,
         COUNT(DISTINCT a.id) AS albums
         FROM
         users u
         LEFT JOIN images ON images.user_id = u.id
         LEFT JOIN posts p ON p.user_id = u.id
         LEFT JOIN albums a ON a.user_id = u.id
         LEFT JOIN bookmarks b ON b.user_id = u.id
         WHERE
         u.id = :userId
         `,
    args: { userId },
  });

  const parsedUserStats = userStatsSchema.safeParse(rawusersStats.rows[0]);

  if (parsedUserStats.success === false) {
    throw new ZodError(parsedUserStats.error.errors);
  }

  return parsedUserStats.data;
}
