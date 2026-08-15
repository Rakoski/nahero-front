import axios from "axios";
import { NAHERO_API } from "@/constants/nahero-api";
import { SignOut } from "@/services/auth/sign-out";

const isBrowser = typeof window !== "undefined";

export const api = axios.create({
  baseURL: isBrowser ? "/api/proxy" : process.env.NEXT_PUBLIC_API_URL_JAVA,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 1000000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const pathLang = window.location.pathname.split("/")[1];
      const validLang = ["en", "pt"].includes(pathLang) ? pathLang : "en";
      config.headers["Accept-Language"] = validLang === "pt" ? "pt-BR" : "en-US";
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
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !CREDENTIAL_ENDPOINTS.has(error.config?.url)
    ) {
      SignOut();
    }

    return Promise.reject(error);
  },
);
