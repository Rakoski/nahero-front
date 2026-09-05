import { api } from "@/lib/api-manager";
import { NAHERO_API } from "@/constants/nahero-api";

export const verifyEmail = (verificationToken: string) =>
  api.post(NAHERO_API.USERS.VERIFY_EMAIL, { verificationToken });
