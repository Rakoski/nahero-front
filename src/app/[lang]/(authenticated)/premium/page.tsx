"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Construction, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useCreateCheckoutSession } from "@/hooks/useCreateCheckoutSession";
import type { PlanInterval } from "@/services/payment/create-checkout-session";
import { useLocale } from "@/providers/locale-provider";
import { InlineError } from "@/components/shared";

export default function PremiumPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.premium;
  const { free, monthly, yearly, premiumFeatures, upcomingFeature } =
    dict.plans;
  const searchParams = useSearchParams();

  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscriptionStatus();
  const {
    mutate: startCheckout,
    isPending: isStartingCheckout,
    variables,
    error: checkoutError,
  } = useCreateCheckoutSession();

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

  if (isLoadingSubscription) {
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

  const pendingPlan = isStartingCheckout ? variables?.plan : null;

  const renderSubscribeButton = (plan: PlanInterval, label: string) =>
    isPremium ? (
      <Button className="w-full" size="lg" variant="outline" asChild>
        <Link href={`/${lang}${Routes.Subscription}`}>
          {dict.manageSubscription}
        </Link>
      </Button>
    ) : (
      <Button
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
        size="lg"
        onClick={() => startCheckout({ plan })}
        disabled={isStartingCheckout}
      >
        {pendingPlan === plan && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {pendingPlan === plan ? dict.starting : label}
      </Button>
    );

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

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <PlanCard
          name={free.name}
          features={free.features}
          action={
            <Button className="w-full" size="lg" variant="outline" asChild>
              <Link href={`/${lang}${Routes.PracticeExams}`}>{free.cta}</Link>
            </Button>
          }
        />

        <PlanCard
          name={monthly.name}
          price={monthly}
          badge={monthly.badge}
          features={premiumFeatures}
          upcomingFeature={upcomingFeature}
          action={renderSubscribeButton("MONTHLY", monthly.cta)}
          footnote={monthly.footnote}
          emphasized
        />

        <PlanCard
          name={yearly.name}
          price={yearly}
          highlight={
            <>
              <p className="font-semibold">{yearly.highlightTitle}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {yearly.equivalentLabel}{" "}
                <span className="font-semibold text-foreground">
                  {yearly.equivalentPrice}
                </span>{" "}
                · {yearly.yearlySavings}
              </p>
            </>
          }
          highlightClassName="border-yellow-500/40 bg-yellow-500/5"
          features={premiumFeatures}
          upcomingFeature={upcomingFeature}
          action={renderSubscribeButton("YEARLY", yearly.cta)}
          footnote={yearly.footnote}
        />
      </section>

      <InlineError error={checkoutError} className="mt-6" />
    </div>
  );
}

interface PlanCardProps {
  name: string;
  price?: { currency: string; amount: string; cadence: string };
  highlight?: ReactNode;
  highlightClassName?: string;
  features: readonly string[];
  upcomingFeature?: { label: string; tag: string };
  action: ReactNode;
  badge?: string;
  footnote?: string;
  emphasized?: boolean;
}

function PlanCard({
  name,
  price,
  highlight,
  highlightClassName,
  features,
  upcomingFeature,
  action,
  badge,
  footnote,
  emphasized,
}: PlanCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col",
        emphasized && "border-yellow-500 shadow-lg shadow-yellow-500/10",
      )}
    >
      <CardContent className="flex flex-1 flex-col gap-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold">{name}</h2>
          {price && (
            <div className="text-right shrink-0 leading-none">
              <p className="text-4xl font-bold">
                <span className="mr-1 align-top text-xl">{price.currency}</span>
                {price.amount}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {price.cadence}
              </p>
            </div>
          )}
        </div>

        {highlight && (
          <div
            className={cn(
              "rounded-lg border border-border bg-muted/40 p-3",
              highlightClassName,
            )}
          >
            {highlight}
          </div>
        )}

        <ul className="space-y-2 flex-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
          {upcomingFeature && (
            <li className="flex items-start gap-3 text-muted-foreground">
              <Construction className="h-5 w-5 shrink-0 mt-0.5" />
              <span>
                {upcomingFeature.label}{" "}
                <span className="ml-1 inline-block rounded-full border border-yellow-500/40 px-2 py-0.5 text-xs font-medium text-yellow-400">
                  {upcomingFeature.tag}
                </span>
              </span>
            </li>
          )}
        </ul>

        <div className="space-y-2">
          {action}
          {footnote && (
            <p className="truncate text-xs text-center text-muted-foreground">
              {footnote}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
