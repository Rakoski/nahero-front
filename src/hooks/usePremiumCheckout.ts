"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useCreateCheckoutSession } from "@/hooks/useCreateCheckoutSession";
import type { PlanInterval } from "@/services/payment/create-checkout-session";
import type { PremiumCardPlacement } from "@/services/payment/track-funnel-event";

interface UsePremiumCheckoutOptions {
  placement: PremiumCardPlacement;
  attemptId?: number;
}

export type PremiumCheckout = ReturnType<typeof usePremiumCheckout>;

export function usePremiumCheckout({ placement, attemptId }: UsePremiumCheckoutOptions) {
  const { lang } = useLocale();
  const router = useRouter();
  const { status } = useSession();
  const { mutate, isPending, variables, error } = useCreateCheckoutSession();

  const subscribe = useCallback(
    (plan: PlanInterval) => {
      if (status === "authenticated") {
        mutate({ plan, placement, attemptId });
        return;
      }

      const callbackUrl = `/${lang}${Routes.Premium}?checkout=${plan}`;
      router.push(`/${lang}${Routes.Login}?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    },
    [status, mutate, placement, attemptId, lang, router],
  );

  return {
    subscribe,
    placement,
    attemptId,
    isStarting: isPending,
    pendingPlan: isPending ? (variables?.plan ?? null) : null,
    error,
  };
}
