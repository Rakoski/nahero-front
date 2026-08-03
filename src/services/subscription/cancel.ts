import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface CancelSubscriptionResponse {
  externalSubscriptionId: string;
  accessExpiresAt: string | null;
}

export async function cancelSubscription(): Promise<CancelSubscriptionResponse> {
  try {
    const response = await api.post<CancelSubscriptionResponse>(
      NAHERO_API.SUBSCRIPTION.CANCEL,
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
