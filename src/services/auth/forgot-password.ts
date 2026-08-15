import { api } from "@/lib/api-manager";
import { NAHERO_API } from "@/constants/nahero-api";

export interface ForgotPasswordRequest {
  email: string;
}

export async function forgotPassword(data: ForgotPasswordRequest) {
  const response = await api.post(NAHERO_API.AUTH.FORGOT_PASSWORD, {
    email: data.email,
  });

  return response.data;
}
