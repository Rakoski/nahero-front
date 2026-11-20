"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Routes } from "@/routes/routes";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { usePremiumCheckout } from "@/hooks/usePremiumCheckout";
import { useLocale } from "@/providers/locale-provider";
import { PremiumPricingCard } from "@/components/shared";

export default function PremiumPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.premium;
  const { free, premiumFeatures } = dict.plans;
  const searchParams = useSearchParams();
  const { status: sessionStatus } = useSession();
  const isAuthenticated = sessionStatus === "authenticated";

  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscriptionStatus({ enabled: isAuthenticated });

  const attemptParam = Number(searchParams.get("attempt"));
  const checkout = usePremiumCheckout({
    placement: "PLANS_PAGE",
    attemptId: Number.isInteger(attemptParam) && attemptParam > 0 ? attemptParam : undefined,
  });
  const { subscribe } = checkout;

  const checkoutAfterLogin = searchParams.get("checkout");
  const autoCheckoutStarted = useRef(false);

  useEffect(() => {
    if (autoCheckoutStarted.current || !subscription || subscription.isPremium) return;
    if (checkoutAfterLogin !== "MONTHLY" && checkoutAfterLogin !== "YEARLY") return;

    autoCheckoutStarted.current = true;

    const remaining = new URLSearchParams(searchParams.toString());
    remaining.delete("checkout");
    const query = remaining.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);

    subscribe(checkoutAfterLogin);
  }, [subscription, checkoutAfterLogin, searchParams, subscribe]);

  const paywallSource = searchParams.get("from");
  const paywallMessages: Record<string, string> = {
    "practice-attempt": dict.fromPracticeAttempt,
    results: dict.fromPracticeAttempt,
    dashboard: dict.fromDashboard,
    history: dict.fromHistory,
  };
  const paywallMessage = paywallSource
    ? (paywallMessages[paywallSource] ?? null)
    : null;

  if (sessionStatus === "loading" || isLoadingSubscription) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{dict.loading}</p>
        </div>
      </div>
    );
  }

  const isPremium = subscription?.isPremium ?? false;
  const formattedPeriodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(
        lang === "pt" ? "pt-BR" : "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : "—";

  return (
    <div className="container mx-auto pt-4 pb-8 px-4 max-w-6xl">
      <header className="text-center mb-6 space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold">{dict.title}</h1>
        <p className="text-muted-foreground text-lg">{dict.fromDashboard}</p>
      </header>

      {isPremium && (
        <Card className="mb-4 border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-yellow-500 shrink-0" />
              <div>
                <p className="font-semibold">{dict.alreadyPremiumTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {dict.alreadyPremiumBody.replace(
                    "{{date}}",
                    formattedPeriodEnd,
                  )}
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/${lang}${Routes.StudentDashboard}`}>
                {dict.goToDashboard}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-5">
        <PremiumPricingCard
          checkout={checkout}
          features={premiumFeatures}
          className="lg:col-span-3"
        />

        <Card className="flex flex-col lg:col-span-2">
          <CardContent className="flex flex-1 flex-col gap-4 pt-6">
            <h2 className="text-xl font-bold">{free.name}</h2>
            <ul className="flex-1 space-y-2">
              {free.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" size="lg" variant="outline" asChild>
              <Link href={`/${lang}${Routes.PracticeExams}`}>{free.cta}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
