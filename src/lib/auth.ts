import "server-only";
// biome-ignore lint/style/useNodejsImportProtocol: <being used as data: and file: >
import crypto, { createHash } from "crypto";
import { env } from "@/env";
import { SignJWT, decodeJwt, jwtVerify } from "jose";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(env.ACCESS_TOKEN_SECRET);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET);

export async function signAndSetAccessToken(userId: string, rememberMe: boolean) {
  const signedJWT = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15 mins")
    .sign(ACCESS_TOKEN_SECRET);

  const expirationTime = rememberMe === true ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

  cookies().set({
    name: "accessToken",
    value: signedJWT,
    httpOnly: true,
    sameSite: "strict",
    maxAge: expirationTime,
  });
}

export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15 days")
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(token: string | undefined) {
  try {
    const verified = await jwtVerify(token as string, ACCESS_TOKEN_SECRET);
    return verified.payload as { userId: string };
  } catch (error) {
    return;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const verified = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    return verified.payload as { userId: string };
  } catch (error) {
    return;
  }
}

export async function decodeToken(token: string) {
  try {
    return decodeJwt(token) as { userId: string };
  } catch (error) {
    return;
  }
}

// to ensure the cookie is in the same device
// caveat:changing network same device(mobile)
export async function generateFingerprint({
  ip,
  userAgent,
}: {
  ip: string;
  userAgent: string;
}) {
  return createHash("sha256").update(`${ip}${userAgent}`).digest("hex");
}

// for better password protection
export const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

// for User security
export const generateHashPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
};

export const getAuthenticatedId = async () => {
  const cookieStore = cookies();
  const userId = await verifyAccessToken(cookieStore.get("accessToken")?.value as string);
  if (!userId) {
    throw new Error("Unauthorized please log in");
  }
  return userId;
};
