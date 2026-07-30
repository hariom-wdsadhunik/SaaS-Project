import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/leads",
  "/deals",
  "/calendar",
  "/tasks",
  "/communication",
  "/copilot",
  "/properties",
  "/contacts",
  "/appointments",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    const token = req.cookies.get("leadpilot_token")?.value || req.cookies.get("sb-access-token")?.value;

    // Check header or auth cookie state in server middleware
    if (!token && process.env.NODE_ENV === "production") {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/leads/:path*",
    "/deals/:path*",
    "/calendar/:path*",
    "/tasks/:path*",
    "/communication/:path*",
    "/copilot/:path*",
    "/properties/:path*",
    "/contacts/:path*",
    "/appointments/:path*",
  ],
};
