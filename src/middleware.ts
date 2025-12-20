import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const locales = ["en", "pt"];
const defaultLocale = "en";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const userRoles = token?.roles || []; // Get roles from NextAuth session

    // --- 1. SECURITY CHECKS (Based on YOUR Backend Roles) ---

    // Protect Student Routes
    if (pathname.includes("/student") && !userRoles.includes("IS_STUDENT")) {
      // Redirect unauthorized users to a 403 page or home
      return NextResponse.redirect(new URL(`/${defaultLocale}/unauthorized`, req.url));
    }

    if (pathname.includes("/teacher") && !userRoles.includes("IS_TEACHER")) {
      return NextResponse.redirect(new URL(`/${defaultLocale}/unauthorized`, req.url));
    }

    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return NextResponse.next();

    const locale = defaultLocale; 
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, req.url)
    );
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|images).*)",
  ],
};