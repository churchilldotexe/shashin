import crypto, { createHash } from "node:crypto";
import { env } from "@/env";
import { SignJWT, decodeJwt, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(env.ACCESS_TOKEN_SECRET);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET);

export async function signAccessToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15 mins")
    .sign(ACCESS_TOKEN_SECRET);
}

export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15 days")
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(token: string) {
  try {
    const verified = await jwtVerify(token, ACCESS_TOKEN_SECRET);
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
export async function generateFingerprint(req: NextRequest) {
  const { ip, headers } = req;
  return createHash("sha256")
    .update(`${ip}${headers.get("user-agent")}`)
    .digest("hex");
}

// for better password protection
export const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

// for User security
export const generateHashPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
};
