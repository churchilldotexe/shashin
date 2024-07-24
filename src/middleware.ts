import { verifyAccessToken } from "@/lib/auth";
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
  // matcher: ["/((?!api|.*\\..*|_next).*)", "/"],
  matcher: ["/((?!login|register|api|.*\\..*|_next).*)", "/"],
};

// import { verifyAccessToken } from "@/lib/auth";
// import { type NextRequest, NextResponse } from "next/server";
//
// export async function middleware(req: NextRequest) {
//   const accessToken = req.cookies.get("accessToken")?.value;
//
//   if (accessToken) {
//     // User is logged in, try to verify the token
//     const verifiedId = await verifyAccessToken(accessToken);
//
//     if (verifiedId !== undefined) {
//       // Token is valid, redirect to home page
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//     // If token is invalid, let them proceed to login/register
//   }
//
//   // If no token or invalid token, allow access to login/register
//   return NextResponse.next();
// }
//
// export const config = {
//   matcher: ["/login", "/register"],
// };
