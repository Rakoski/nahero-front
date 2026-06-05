import axios from "axios";
import { getCookie, setCookie } from "@/storages/cookies";
import { SignOut } from "@/services/auth/sign-out";
import { getSession } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_JAVA,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 1000000,
});

const ACCESS_TOKEN_COOKIE = "@nahero:accessToken";
/** Treat the token as stale this many ms before its real expiry. */
const TOKEN_SKEW_MS = 60_000;

/** Reads the `exp` claim (seconds) from a JWT as an epoch in ms, or 0. */
function getTokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

/** True when the token is present and not within the skew window of expiry. */
function isTokenFresh(token: string | undefined): token is string {
  if (!token) return false;
  return Date.now() < getTokenExpiry(token) - TOKEN_SKEW_MS;
}

/**
 * Returns a valid access token, using the cookie as a fast cache and falling
 * back to the NextAuth session — reading the session triggers the `jwt`
 * callback, which refreshes the access token server-side when needed. The
 * session is the single source of truth; the cookie only mirrors it.
 */
async function getValidAccessToken(): Promise<string | undefined> {
  const cookieToken = getCookie(ACCESS_TOKEN_COOKIE) || undefined;
  if (isTokenFresh(cookieToken)) return cookieToken;

  if (typeof window === "undefined") return cookieToken;

  const session = await getSession();
  if (session?.error === "RefreshAccessTokenError") {
    SignOut();
    return undefined;
  }

  const token = session?.user?.accessToken;
  if (token) setCookie(ACCESS_TOKEN_COOKIE, token, 90);
  return token;
}

api.interceptors.request.use(
  async (config) => {
    const token = await getValidAccessToken();

    if (typeof window !== "undefined") {
      const pathLang = window.location.pathname.split("/")[1];
      const validLang = ["en", "pt"].includes(pathLang) ? pathLang : "en";
      const localeCode = validLang === "pt" ? "pt-BR" : "en-US";
      config.headers["Accept-Language"] = localeCode;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalConfig._retry &&
      error.config.url !== "/auth/login" &&
      error.config.url !== "/auth/reset-password"
    ) {
      originalConfig._retry = true;

      // Force a session read so the NextAuth `jwt` callback refreshes the
      // access token, then retry the original request once.
      const session = await getSession();
      const newAccessToken = session?.user?.accessToken;

      if (session?.error !== "RefreshAccessTokenError" && newAccessToken) {
        setCookie(ACCESS_TOKEN_COOKIE, newAccessToken, 90);
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalConfig);
      }

      SignOut();
    }

    return Promise.reject(error);
  }
);
