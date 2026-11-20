import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import type { PremiumCardPlacement } from "@/services/payment/track-funnel-event";

export type PlanInterval = "MONTHLY" | "YEARLY";

export interface CreateCheckoutSessionRequest {
  plan: PlanInterval;
  successUrl?: string;
  cancelUrl?: string;
  placement?: PremiumCardPlacement;
  attemptId?: number;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  checkoutUrl: string;
}

export async function createCheckoutSession(
  request: CreateCheckoutSessionRequest,
): Promise<CreateCheckoutSessionResponse> {
  try {
    const response = await api.post<CreateCheckoutSessionResponse>(
      NAHERO_API.PAYMENT.CREATE_CHECKOUT_SUBSCRIPTION,
      request,
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
