/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "@/helpers/jwtHelpers";

const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = cookies().get("token")?.value;

  // Allow access to login/register pages
  if (authRoutes.includes(pathname)) {
    // If user is already logged in, redirect based on role
    if (accessToken) {
      try {
        const decodedToken = decode(accessToken) as any;
        const role = decodedToken?.role;
        if (role === "admin") {
          return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        } else if (role === "user") {
          return NextResponse.redirect(new URL("/dashboard/my-library", request.url));
        }
      } catch (error) {
        // Invalid token, allow access to auth pages
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protect all other routes - require authentication
  if (!accessToken) {
    return NextResponse.redirect(
      new URL(
        pathname ? `/login?redirect=${pathname}` : "/login",
        request.url
      )
    );
  }

  // Role-based authorization
  try {
    const decodedToken = decode(accessToken) as any;
    const role = decodedToken?.role;

    // Admin routes
    if (pathname.match(/^\/admin-dashboard/)) {
      if (role === "admin") {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/dashboard/my-library", request.url));
      }
    }

    // User dashboard routes
    if (pathname.match(/^\/dashboard/)) {
      if (role === "user" || role === "admin") {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // Default route - redirect based on role
    if (pathname === "/") {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard/my-library", request.url));
      }
    }

    // Allow access to other protected routes
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};

//public - cars
//private - admin, driver, user
//hybrid - login, register

//middleware.ts (dashboard, admin-dashboard) -> layout.tsx -> page.tax / dashboard/page.tsx
