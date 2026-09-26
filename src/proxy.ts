import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@backend/auth/jwt";

const ADMIN_PREFIX = "/admin";
const INTERN_PREFIX = "/intern";
const PUBLIC_PATHS = ["/login", "/api/auth/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith(ADMIN_PREFIX) && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/intern", request.url));
  }

  if (pathname.startsWith(INTERN_PREFIX) && payload.role !== "intern") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/intern/:path*"],
};