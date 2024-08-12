import { decodeToken, refreshAccessToken } from "@/server/use-cases/auth/tokenManagement";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Refreshes the access token for a user.
 *
 * This endpoint supports both GET and POST methods and performs the following actions:
 * 1. Retrieves and validates the access token from cookies
 * 2. Decodes the token to get the userId
 * 3. Calls refreshAccessToken with userId, IP, and user agent
 * 4. Generates a new access token and sets it as an HTTP-only cookie
 * 5. Redirects to the callback URL or home page
 *
 * Note: This endpoint has side effects (sets cookies) regardless of the HTTP method used.
 * The GET method is maintained for compatibility with redirects and simple navigation.
 * The POST method is available for contexts where POST is preferred or automatically used.
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} - Redirects to login on failure, or to the callback URL on success
 */

async function handleRefresh(req: NextRequest) {
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

  try {
    await refreshAccessToken({
      userId: decodedToken.userId,
      ip,
      userAgent,
    });
  } catch (error) {
    redirect("/login");
  }

  return NextResponse.redirect(new URL(reRouteURL, req.url));
}

export async function GET(req: NextRequest) {
  return handleRefresh(req);
}

export async function POST(req: NextRequest) {
  return handleRefresh(req);
}
