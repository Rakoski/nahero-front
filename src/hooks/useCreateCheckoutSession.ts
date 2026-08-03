"use client";

import { useMutation } from "@tanstack/react-query";
import {
  createCheckoutSession,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from "@/services/payment/create-checkout-session";
import { handleError } from "@/utils/error-utils";

export function useCreateCheckoutSession() {
  return useMutation<
    CreateCheckoutSessionResponse,
    Error,
    CreateCheckoutSessionRequest
  >({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: (error) => {
      handleError(error);
    },
  });
}
