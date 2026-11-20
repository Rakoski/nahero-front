import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import type { PlanInterval } from "@/services/payment/create-checkout-session";

export type PremiumFunnelEventType = "PREMIUM_CARD_VIEW" | "PREMIUM_CARD_CLICK";

export type PremiumCardPlacement = "RESULTS" | "PLANS_PAGE";

export interface TrackFunnelEventRequest {
  eventType: PremiumFunnelEventType;
  placement: PremiumCardPlacement;
  plan?: PlanInterval;
  attemptId?: number;
}

export async function trackFunnelEvent(
  request: TrackFunnelEventRequest,
): Promise<void> {
  await api.post(NAHERO_API.PAYMENT.TRACK_FUNNEL_EVENT, request);
}
