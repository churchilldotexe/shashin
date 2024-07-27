import { verifyAccessToken } from "@/server/use-cases/auth/tokenManagement";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (accessToken === undefined) {
    const prevPath = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${prevPath}`, req.url));
  }

  const verifiedId = await verifyAccessToken(accessToken);
  if (verifiedId === undefined) {
    const prevPath = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/api/refresh?callbackUrl=${prevPath}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|register|api|.*\\..*|_next).*)", "/"],
};
