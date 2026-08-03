"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelSubscription,
  CancelSubscriptionResponse,
} from "@/services/subscription/cancel";
import { handleError } from "@/utils/error-utils";
import { SUBSCRIPTION_STATUS_KEY } from "./useSubscriptionStatus";

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation<CancelSubscriptionResponse, Error, void>({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_STATUS_KEY });
    },
    onError: (error) => {
      handleError(error);
    },
  });
}
