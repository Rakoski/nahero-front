import { api } from "@/lib/api-manager";
import { NAHERO_API } from "@/constants/nahero-api";

export const resendVerification = (email: string) =>
  api.post(NAHERO_API.USERS.RESEND_VERIFICATION, { email });
