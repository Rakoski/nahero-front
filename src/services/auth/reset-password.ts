import { api } from "@/lib/api-manager";
import { NAHERO_API } from "@/constants/nahero-api";

export interface ResetPasswordRequest {
  resetToken: string;
  password: string;
  confirmPassword: string;
}

export async function resetPassword(data: ResetPasswordRequest) {
  const response = await api.post(NAHERO_API.AUTH.RESET_PASSWORD, {
    resetToken: data.resetToken,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });

  return response.data;
}
