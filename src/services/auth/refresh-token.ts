import { NAHERO_API } from "@/constants/nahero-api";

/**
 * Exchanges a refresh token for a fresh access token.
 *
 * Runs inside the NextAuth `jwt` callback (server side), so it talks to the
 * backend directly via `fetch` instead of the browser-bound `api` axios
 * instance (whose interceptors are guarded by `typeof window`).
 *
 * Returns the new access token, or `null` if the refresh failed.
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL_JAVA;

  const response = await fetch(`${baseUrl}${NAHERO_API.AUTH.REFRESH_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data?.accessToken ?? null;
}
