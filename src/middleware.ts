import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";

const locales = ["en", "pt"] as const;
type Locale = (typeof locales)[number];

const defaultLocale: Locale = "en";
const LOCALE_COOKIE = "NEXT_LOCALE";

const UTM_COOKIE = "nh_utm";
const UTM_MAX_LENGTH = 64;
const UTM_MAX_AGE = 60 * 60 * 24 * 30;

const isLocale = (value?: string | null): value is Locale =>
  !!value && locales.includes(value as Locale);

const localeFromPathname = (pathname: string): Locale | null => {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
};

const resolveLocale = (req: NextRequest): Locale => {
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const refererLocale = localeFromPathname(new URL(referer).pathname);
      if (refererLocale) return refererLocale;
    } catch {
      // malformed referer, fall through to the default
    }
  }

  return defaultLocale;
};

const readUtmParam = (req: NextRequest, key: string): string | null => {
  const value = req.nextUrl.searchParams.get(key)?.trim();
  return value ? value.slice(0, UTM_MAX_LENGTH) : null;
};

const withUtmCookie = (req: NextRequest, response: NextResponse) => {
  if (req.cookies.get(UTM_COOKIE)) return response;

  const source = readUtmParam(req, "utm_source");
  if (!source) return response;

  const utm = {
    source,
    medium: readUtmParam(req, "utm_medium"),
    campaign: readUtmParam(req, "utm_campaign"),
  };

  response.cookies.set(UTM_COOKIE, JSON.stringify(utm), {
    path: "/",
    sameSite: "lax",
    maxAge: UTM_MAX_AGE,
  });

  return response;
};

const PROTECTED_SEGMENTS = [
  { segment: "/student", role: "IS_STUDENT" },
  { segment: "/teacher", role: "IS_TEACHER" },
  { segment: "/admin", role: "IS_ADMIN" },
] as const;

export default withAuth(
  function middleware(req) {
    const { pathname, search } = req.nextUrl;
    const token = req.nextauth.token;

    const pathLocale = localeFromPathname(pathname);

    if (!pathLocale) {
      const locale = resolveLocale(req);
      const rest = pathname === "/" ? "" : pathname;
      return withUtmCookie(
        req,
        NextResponse.redirect(new URL(`/${locale}${rest}${search}`, req.url)),
      );
    }

    const protectedMatch = PROTECTED_SEGMENTS.find(({ segment }) =>
      pathname.includes(segment),
    );

    if (protectedMatch) {
      if (!token) {
        const loginUrl = new URL(`/${pathLocale}/login`, req.url);
        loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
        return withUtmCookie(req, NextResponse.redirect(loginUrl));
      }

      const userRoles = (token.roles as string[] | undefined) ?? [];
      if (!userRoles.includes(protectedMatch.role)) {
        return withUtmCookie(
          req,
          NextResponse.redirect(
            new URL(`/${pathLocale}/unauthorized`, req.url),
          ),
        );
      }
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    if (req.cookies.get(LOCALE_COOKIE)?.value !== pathLocale) {
      response.cookies.set(LOCALE_COOKIE, pathLocale, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return withUtmCookie(req, response);
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
