"use server";
import { AxiosError } from "axios";
import { api } from "@/lib/api-manager";
import { NAHERO_API } from "@/constants/nahero-api";
import { EMAIL_NOT_VERIFIED } from "@/constants/auth-errors";
import { BackendErrorResponse } from "@/types/api-error";

async function loginUser(email: string, password: string) {
  try {
    const response = await api.post(NAHERO_API.AUTH.LOGIN, { email, password });

    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    if (isEmailNotVerified(error)) throw new Error(EMAIL_NOT_VERIFIED);
    throw error;
  }
}

function isEmailNotVerified(error: unknown) {
  if (!(error instanceof AxiosError)) return false;
  const data = error.response?.data as BackendErrorResponse | undefined;
  return data?.errorCode === EMAIL_NOT_VERIFIED;
}

export async function authorizeUser(email: string, password: string) {
  const authResponse = await loginUser(email, password);

  if (authResponse && authResponse.user) {
    const { accessToken, refreshToken, user } = authResponse;

    const flattenedRoles = user.roles.map((r: { name: string }) => r.name);

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
