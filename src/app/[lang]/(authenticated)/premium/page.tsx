"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Routes } from "@/routes/routes";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useCreateCheckoutSession } from "@/hooks/useCreateCheckoutSession";
import type { PlanInterval } from "@/services/payment/create-checkout-session";

type PremiumDict = {
  title: string;
  subtitle: string;
  loading: string;
  fromPracticeAttempt: string;
  alreadyPremiumTitle: string;
  alreadyPremiumBody: string;
  goToDashboard: string;
  plans: {
    monthly: {
      name: string;
      price: string;
      cadence: string;
      description: string;
      cta: string;
    };
    yearly: {
      name: string;
      price: string;
      cadence: string;
      description: string;
      cta: string;
      badge: string;
      savings: string;
    };
  };
  features: {
    title: string;
    items: readonly string[];
  };
  starting: string;
};

interface Props {
  params: Promise<{ lang: "en" | "pt" }>;
}

export default function PremiumPage({ params }: Props) {
  const searchParams = useSearchParams();
  const [dict, setDict] = useState<PremiumDict | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");

  const { data: subscription, isLoading: isLoadingSubscription } =
    useSubscriptionStatus();
  const { mutate: startCheckout, isPending: isStartingCheckout, variables } =
    useCreateCheckoutSession();

  useEffect(() => {
    params.then(async (p) => {
      setLang(p.lang);
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.premium as unknown as PremiumDict);
    });
  }, [params]);

  const fromPaywall = searchParams.get("from") === "practice-attempt";

  if (!dict || isLoadingSubscription) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{dict?.loading ?? "Loading…"}</p>
        </div>
      </div>
    );
  }

  if (subscription?.isPremium) {
    const formattedDate = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd).toLocaleDateString(
          lang === "pt" ? "pt-BR" : "en-US",
          { year: "numeric", month: "long", day: "numeric" },
        )
      : "—";

    return (
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {dict.alreadyPremiumTitle}
            </CardTitle>
            <CardDescription>
              {dict.alreadyPremiumBody.replace("{{date}}", formattedDate)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href={`/${lang}${Routes.StudentDashboard}`}>
                {dict.goToDashboard}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubscribe = (plan: PlanInterval) => {
    startCheckout({ plan });
  };

  const pendingPlan = isStartingCheckout ? variables?.plan : null;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <header className="text-center mb-8 space-y-2">
        <h1 className="text-4xl font-bold">{dict.title}</h1>
        <p className="text-muted-foreground text-lg">{dict.subtitle}</p>
      </header>

      {fromPaywall && (
        <Card className="mb-8 border-primary/40 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-center text-sm">{dict.fromPracticeAttempt}</p>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <PlanCard
          name={dict.plans.monthly.name}
          price={dict.plans.monthly.price}
          cadence={dict.plans.monthly.cadence}
          description={dict.plans.monthly.description}
          cta={dict.plans.monthly.cta}
          starting={dict.starting}
          onSubscribe={() => handleSubscribe("MONTHLY")}
          isPending={pendingPlan === "MONTHLY"}
          disabled={isStartingCheckout}
        />
        <PlanCard
          name={dict.plans.yearly.name}
          price={dict.plans.yearly.price}
          cadence={dict.plans.yearly.cadence}
          description={dict.plans.yearly.description}
          cta={dict.plans.yearly.cta}
          starting={dict.starting}
          badge={dict.plans.yearly.badge}
          savings={dict.plans.yearly.savings}
          onSubscribe={() => handleSubscribe("YEARLY")}
          isPending={pendingPlan === "YEARLY"}
          disabled={isStartingCheckout}
          highlighted
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{dict.features.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {dict.features.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

interface PlanCardProps {
  name: string;
  price: string;
  cadence: string;
  description: string;
  cta: string;
  starting: string;
  badge?: string;
  savings?: string;
  onSubscribe: () => void;
  isPending: boolean;
  disabled: boolean;
  highlighted?: boolean;
}

function PlanCard({
  name,
  price,
  cadence,
  description,
  cta,
  starting,
  badge,
  savings,
  onSubscribe,
  isPending,
  disabled,
  highlighted,
}: PlanCardProps) {
  return (
    <Card className={highlighted ? "border-primary shadow-lg" : undefined}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{name}</CardTitle>
          {badge && <Badge>{badge}</Badge>}
        </div>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">{cadence}</span>
        </div>
        {savings && (
          <p className="text-sm text-primary font-medium mt-1">{savings}</p>
        )}
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          size="lg"
          onClick={onSubscribe}
          disabled={disabled}
          variant={highlighted ? "default" : "outline"}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? starting : cta}
        </Button>
      </CardContent>
    </Card>
  );
}
