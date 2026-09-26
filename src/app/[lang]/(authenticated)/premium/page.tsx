"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useCreateCheckoutSession } from "@/hooks/useCreateCheckoutSession";
import type { PlanInterval } from "@/services/payment/create-checkout-session";
import { useLocale } from "@/providers/locale-provider";

export default function PremiumPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.premium;
  const { free, monthly, yearly, premiumFeatures } = dict.plans;
  const searchParams = useSearchParams();

  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscriptionStatus();
  const { mutate: startCheckout, isPending: isStartingCheckout, variables } =
    useCreateCheckoutSession();

  const fromPaywall = searchParams.get("from") === "practice-attempt";

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
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <header className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-bold">{dict.title}</h1>
        <p className="text-muted-foreground text-lg">{dict.subtitle}</p>
      </header>

      {isPremium && (
        <Card className="mb-8 border-yellow-500/40 bg-yellow-500/5">
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

      {fromPaywall && !isPremium && (
        <Card className="mb-8 border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="pt-6">
            <p className="text-center text-sm">{dict.fromPracticeAttempt}</p>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <PlanCard
          name={free.name}
          currency={free.currency}
          amount={free.amount}
          cadence={free.cadence}
          description={free.description}
          features={free.features}
          action={
            <Button className="w-full" size="lg" variant="outline" asChild>
              <Link href={`/${lang}${Routes.PracticeExams}`}>{free.cta}</Link>
            </Button>
          }
        />

        <PlanCard
          name={monthly.name}
          currency={monthly.currency}
          amount={monthly.amount}
          cadence={monthly.cadence}
          badge={monthly.badge}
          description={monthly.description}
          features={premiumFeatures}
          action={renderSubscribeButton("MONTHLY", monthly.cta)}
          footnote={monthly.footnote}
          emphasized
        />

        <PlanCard
          name={yearly.name}
          currency={yearly.currency}
          amount={yearly.amount}
          cadence={yearly.cadence}
          description={yearly.description}
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
          action={renderSubscribeButton("YEARLY", yearly.cta)}
          footnote={yearly.footnote}
        />
      </section>
    </div>
  );
}

interface PlanCardProps {
  name: string;
  currency: string;
  amount: string;
  cadence: string;
  description: string;
  highlight?: ReactNode;
  highlightClassName?: string;
  features: readonly string[];
  action: ReactNode;
  badge?: string;
  footnote?: string;
  emphasized?: boolean;
}

function PlanCard({
  name,
  currency,
  amount,
  cadence,
  description,
  highlight,
  highlightClassName,
  features,
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
      <CardContent className="flex flex-1 flex-col gap-6 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">{name}</h2>
            {badge && (
              <Badge
                variant="outline"
                className="border-yellow-500/40 text-yellow-400"
              >
                {badge}
              </Badge>
            )}
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="text-right shrink-0 leading-none">
            <p className="text-2xl font-bold">{currency}</p>
            <p className="text-4xl font-bold">{amount}</p>
            <p className="text-sm text-muted-foreground mt-1">{cadence}</p>
          </div>
        </div>

        {highlight && (
          <div
            className={cn(
              "rounded-lg border border-border bg-muted/40 p-4",
              highlightClassName,
            )}
          >
            {highlight}
          </div>
        )}

        <ul className="space-y-3 flex-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          {action}
          {footnote && (
            <p className="text-xs text-center text-muted-foreground">
              {footnote}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
