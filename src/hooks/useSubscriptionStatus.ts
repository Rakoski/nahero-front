"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubscriptionStatus } from "@/services/subscription/get-status";

export const SUBSCRIPTION_STATUS_KEY = ["subscription", "status"] as const;

interface UseSubscriptionStatusOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export function useSubscriptionStatus(options: UseSubscriptionStatusOptions = {}) {
  return useQuery({
    queryKey: SUBSCRIPTION_STATUS_KEY,
    queryFn: getSubscriptionStatus,
    staleTime: 30 * 1000,
    enabled: options.enabled,
    refetchInterval: options.refetchInterval,
  });
}
