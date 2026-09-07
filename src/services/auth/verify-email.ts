"use server";
import { api } from "@/lib/api-manager";
import { NAHERO_API } from "@/constants/nahero-api";

export async function authorizeByVerificationToken(verificationToken: string) {
  const response = await api.post(NAHERO_API.USERS.VERIFY_EMAIL, {
    verificationToken,
  });

  if (response.status !== 200 || !response.data?.user) return null;

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
