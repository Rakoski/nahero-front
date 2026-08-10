"use client";

import { Query, useQuery } from "@tanstack/react-query";
import {
  getSubscriptionStatus,
  GetSubscriptionStatusResponse,
} from "@/services/subscription/get-status";

export const SUBSCRIPTION_STATUS_KEY = ["subscription", "status"] as const;

type RefetchInterval =
  | number
  | false
  | ((
      query: Query<
        GetSubscriptionStatusResponse,
        Error,
        GetSubscriptionStatusResponse,
        typeof SUBSCRIPTION_STATUS_KEY
      >,
    ) => number | false | undefined);

interface UseSubscriptionStatusOptions {
  enabled?: boolean;
  refetchInterval?: RefetchInterval;
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
