import { AxiosError } from "axios";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Routes } from "@/routes/routes";

export function isPaymentRequiredError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 412;
}

/**
 * Redirects to /premium when the error signals payment required (HTTP 412).
 * Returns true if the error was handled — callers should skip their default
 * error handling in that case to avoid a stray toast on the way out.
 */
export function handlePaywallError(
  error: unknown,
  lang: "en" | "pt",
  router: AppRouterInstance,
  from?: string,
): boolean {
  if (!isPaymentRequiredError(error)) return false;

  const query = from ? `?from=${encodeURIComponent(from)}` : "";
  router.push(`/${lang}${Routes.Premium}${query}`);
  return true;
}
