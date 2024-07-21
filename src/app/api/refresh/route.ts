import { decodeToken } from "@/lib/auth";
import { refreshAccessToken } from "@/server/data-access/authentication";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Refreshes the access token for a user.
 *
 * This GET endpoint performs the following actions:
 * 1. Retrieves and validates the access token from cookies
 * 2. Decodes the token to get the userId
 * 3. Calls refreshAccessToken with userId, IP, and user agent
 * 4. Generates a new access token and sets it as an HTTP-only cookie
 *
 * Note: This endpoint has side effects (sets cookies) despite being a GET request.
 * This is necessary for our authentication flow to work with redirects.
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} - Redirects to login on failure, or to the callback URL on success
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const callbackUrl = searchParams.get("callbackUrl");
  const reRouteURL = callbackUrl ?? "/";

  const accessToken = req.cookies.get("accessToken")?.value;

  const ip = req.headers.get("x-forwarded-for") as string;
  const userAgent = req.headers.get("user-agent") as string;
  const decodedToken = await decodeToken(accessToken as string);

  // to ensure that the token exist in cookie
  if (decodedToken === undefined) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${reRouteURL}`, req.url));
  }

  await refreshAccessToken({
    userId: decodedToken.userId,
    ip,
    userAgent,
  });

  const response = NextResponse.redirect(new URL(reRouteURL, req.url));
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}
