import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { signOut } from "next-auth/react";
import { NAHERO_API } from "@/constants/nahero-api";
import { EMAIL_NOT_VERIFIED } from "@/constants/auth-errors";
import { CAPTCHA_HEADER, CAPTCHA_REQUIRED } from "@/constants/captcha";
import { requestCaptchaToken } from "@/lib/captcha-store";
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

type CaptchaRetryConfig = InternalAxiosRequestConfig & { captchaRetried?: boolean };

let captchaGate: Promise<void> | null = null;

async function retryAfterCaptcha(error: AxiosError, config: CaptchaRetryConfig) {
  config.captchaRetried = true;

  if (captchaGate) {
    await captchaGate;
    return api(config);
  }

  let release = () => {};
  captchaGate = new Promise<void>((resolve) => {
    release = resolve;
  });

  try {
    let token: string;
    try {
      token = await requestCaptchaToken();
    } catch {
      throw error;
    }
    config.headers.set(CAPTCHA_HEADER, token);
    return await api(config);
  } finally {
    captchaGate = null;
    release();
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const status = error.response?.status;
    const data = error.response?.data as BackendErrorResponse | undefined;
    const config = error.config as CaptchaRetryConfig | undefined;

    if (status === 429 && data?.errorCode === CAPTCHA_REQUIRED && config && !config.captchaRetried) {
      return retryAfterCaptcha(error, config);
    }

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
