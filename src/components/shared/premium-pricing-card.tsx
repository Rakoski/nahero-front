"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useTrackFunnelEvent } from "@/hooks/useTrackFunnelEvent";
import type { PremiumCheckout } from "@/hooks/usePremiumCheckout";
import type { PlanInterval } from "@/services/payment/create-checkout-session";
import { InlineError } from "./inline-error";

interface PremiumPricingCardProps {
  checkout: PremiumCheckout;
  lossAversion?: string | null;
  features?: readonly string[];
  className?: string;
}

export function PremiumPricingCard({
  checkout,
  lossAversion,
  features,
  className,
}: PremiumPricingCardProps) {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.premium.card;
  const { placement, attemptId, subscribe, isStarting, pendingPlan, error } = checkout;

  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { data: subscription } = useSubscriptionStatus({ enabled: isAuthenticated });
  const isPremium = subscription?.isPremium ?? false;
  const canTrack = isAuthenticated && subscription !== undefined && !isPremium;

  const { mutate: track } = useTrackFunnelEvent();
  const viewTracked = useRef(false);

  useEffect(() => {
    if (!canTrack || viewTracked.current) return;
    viewTracked.current = true;
    track({ eventType: "PREMIUM_CARD_VIEW", placement, attemptId });
  }, [canTrack, track, placement, attemptId]);

  const choose = (plan: PlanInterval) => {
    if (canTrack) track({ eventType: "PREMIUM_CARD_CLICK", placement, plan, attemptId });
    subscribe(plan);
  };

  return (
    <Card
      className={cn(
        "flex flex-col border-yellow-500 shadow-lg shadow-yellow-500/10",
        className,
      )}
    >
      <CardContent className="flex flex-1 flex-col gap-5 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">{dict.title}</h2>
            <p className="text-sm text-muted-foreground">{dict.annualLabel}</p>
          </div>
          <Badge className="bg-yellow-500 px-3 py-1 text-sm font-semibold text-stone-950">
            {dict.savingsBadge}
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{dict.annualPrice}</span>
            <span className="text-lg text-muted-foreground">{dict.annualCadence}</span>
          </p>
          <p className="text-sm font-medium text-yellow-500">
            {dict.annualEquivalent.replace(
              "{{price}}",
              dictionary.premium.plans.yearly.equivalentPrice,
            )}
          </p>
          {lossAversion && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium">
              {lossAversion}
            </p>
          )}
          <p className="text-sm text-muted-foreground">{dict.examAnchor}</p>
        </div>

        {features && features.length > 0 && (
          <ul className="flex-1 space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {isPremium ? (
          <Button className="w-full" size="lg" variant="outline" asChild>
            <Link href={`/${lang}${Routes.Subscription}`}>
              {dictionary.premium.manageSubscription}
            </Link>
          </Button>
        ) : (
          <div className="space-y-3">
            <Button
              className="w-full bg-yellow-600 font-bold text-white hover:bg-yellow-700"
              size="lg"
              onClick={() => choose("YEARLY")}
              disabled={isStarting}
            >
              {pendingPlan === "YEARLY" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {pendingPlan === "YEARLY" ? dictionary.premium.starting : dict.annualCta}
            </Button>
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" aria-hidden="true" />
              {dict.guarantee}
            </p>
            <div className="text-center">
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-muted-foreground"
                onClick={() => choose("MONTHLY")}
                disabled={isStarting}
              >
                {pendingPlan === "MONTHLY" && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                {pendingPlan === "MONTHLY" ? dictionary.premium.starting : dict.monthlyCta}
              </Button>
            </div>
          </div>
        )}

        <InlineError error={error} />
      </CardContent>
    </Card>
  );
}
