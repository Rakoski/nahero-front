import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE";
export type PaymentProviderName = "STRIPE";

export interface GetSubscriptionStatusResponse {
  isPremium: boolean;
  freeTriesLeft: number | null;
  status: SubscriptionStatus | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  provider: PaymentProviderName | null;
  externalSubscriptionId: string | null;
}

export async function getSubscriptionStatus(): Promise<GetSubscriptionStatusResponse> {
  try {
    const response = await api.get<GetSubscriptionStatusResponse>(
      NAHERO_API.SUBSCRIPTION.GET,
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
