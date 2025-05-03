// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;

  // Allow access to public pages
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/explore") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated) {
    const loginUrl = new URL("/not-authenticated", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access if authenticated
  return NextResponse.next();
}

// Apply only to these routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/foryou/:path*",
  ],
};
