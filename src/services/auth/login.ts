"use server";
import { api } from "@/lib/api-manager";
import { handleError } from "../../utils/error-utils";

async function loginUser(email: string, password: string) {
  const response = await api.post("/auth/login", { email, password });

  if (response.status === 200) {
    return response.data;
  }
  return null;
}

export async function authorizeUser(email: string, password: string) {
  const authResponse = await loginUser(email, password);

  if (authResponse && authResponse.user) {
    const { accessToken, refreshToken, user } = authResponse;

    const flattenedRoles = user.roles.map((r: any) => r.name);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.avatarUrl,
      roles: flattenedRoles,
      accessToken,
      refreshToken,
    };
  }

  return null;
}
