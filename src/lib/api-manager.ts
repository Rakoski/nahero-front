import axios from "axios";
import { signOut } from "next-auth/react";
import { NAHERO_API } from "@/constants/nahero-api";
import { EMAIL_NOT_VERIFIED } from "@/constants/auth-errors";
import { SignOut } from "@/services/auth/sign-out";
import { Routes } from "@/routes/routes";
import { BackendErrorResponse } from "@/types/api-error";

const isBrowser = typeof window !== "undefined";

function currentLang() {
  const pathLang = window.location.pathname.split("/")[1];
  return ["en", "pt"].includes(pathLang) ? pathLang : "en";
}

export const api = axios.create({
  baseURL: isBrowser ? "/api/proxy" : process.env.NEXT_PUBLIC_API_URL_JAVA,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 1000000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      config.headers["Accept-Language"] =
        currentLang() === "pt" ? "pt-BR" : "en-US";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// These answer 401 to mean "these credentials are wrong", not "your session died",
// so signing the caller out on them would be wrong.
const CREDENTIAL_ENDPOINTS = new Set<string>([
  NAHERO_API.AUTH.LOGIN,
  NAHERO_API.AUTH.RESET_PASSWORD,
]);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const status = error.response?.status;
    const data = error.response?.data as BackendErrorResponse | undefined;

    if (status === 403 && data?.errorCode === EMAIL_NOT_VERIFIED) {
      const lang = currentLang();
      if (!window.location.pathname.startsWith(`/${lang}${Routes.VerifyEmail}`)) {
        signOut({ callbackUrl: `/${lang}${Routes.VerifyEmail}` });
      }
      return Promise.reject(error);
    }

    if (status === 401 && !CREDENTIAL_ENDPOINTS.has(error.config?.url)) {
      SignOut();
    }

    return Promise.reject(error);
  },
);
