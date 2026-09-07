"use server";
import { api } from "@/lib/api-manager";
import { NAHERO_API } from "@/constants/nahero-api";
import { EMAIL_ALREADY_VERIFIED } from "@/constants/auth-errors";

export async function authorizeByVerificationToken(verificationToken: string) {
  const response = await api.post(NAHERO_API.USERS.VERIFY_EMAIL, {
    verificationToken,
  });

  // The link confirms the email every time it is opened, but only mints a
  // session on the click that actually flips the account to confirmed.
  if (!response.data?.accessToken) throw new Error(EMAIL_ALREADY_VERIFIED);

  const { accessToken, refreshToken, user } = response.data;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.avatarUrl,
    roles: user.roles.map((r: { name: string }) => r.name),
    accessToken,
    refreshToken,
  };
}
