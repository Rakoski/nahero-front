import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const locales = ["en", "pt"];
const defaultLocale = "en";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const userRoles = token?.roles || [];

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);

    if (pathname.includes("/student") && !userRoles.includes("IS_STUDENT")) {
      return NextResponse.redirect(
        new URL(`/${defaultLocale}/unauthorized`, req.url)
      );
    }

    if (pathname.includes("/teacher") && !userRoles.includes("IS_TEACHER")) {
      return NextResponse.redirect(
        new URL(`/${defaultLocale}/unauthorized`, req.url)
      );
    }

    if (pathname.includes("/admin") && !userRoles.includes("IS_ADMIN")) {
      return NextResponse.redirect(
        new URL(`/${defaultLocale}/unauthorized`, req.url)
      );
    }

    const pathnameHasLocale = locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    const locale = defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        if (
          path.includes("/student") ||
          path.includes("/teacher") ||
          path.includes("/admin")
        ) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
