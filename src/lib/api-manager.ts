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

api.interceptors.request.use(
  async (config) => {
    // Try to get token from cookie first
    let token = getCookie("@nahero:accessToken");

    // If no token in cookie, try to get from NextAuth session (client-side)
    if (!token && typeof window !== "undefined") {
      const session = await getSession();
      if (session?.user?.accessToken) {
        token = session.user.accessToken;
        // Update cookie for next requests
        setCookie("@nahero:accessToken", token, 90);
      }
    }

    if (typeof window !== "undefined") {
      const pathLang = window.location.pathname.split("/")[1];
      const validLang = ["en", "pt"].includes(pathLang) ? pathLang : "en";
      const localeCode = validLang === "pt" ? "pt-BR" : "en-US";
      config.headers["Accept-Language"] = localeCode;
      console.log(
        "Setting Accept-Language:",
        localeCode,
        "from path:",
        window.location.pathname
      );
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const refreshToken = async () => {
  const currentRefreshToken = getCookie("@nahero:refreshToken");
  if (!currentRefreshToken) {
    return null;
  }

  const refreshApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL_JAVA,
    headers: { "Content-Type": "application/json" },
  });

  try {
    const response = await refreshApi.post("/auth/refresh-token", {
      refreshToken: currentRefreshToken,
    });

    if (response.data?.accessToken) {
      setCookie("@nahero:accessToken", response.data.accessToken, 90);
      return response.data.accessToken;
    }
  } catch (error) {}
  return null;
};

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

      const newAccessToken = await refreshToken();

      if (newAccessToken) {
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalConfig);
      }

      SignOut();
    }

    return Promise.reject(error);
  }
);
