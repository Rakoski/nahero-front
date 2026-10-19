"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface PremiumPerksProps {
  from?: string;
  className?: string;
}

export function PremiumPerks({ from, className }: PremiumPerksProps) {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.shared.premiumPerks;
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { data: subscription, isLoading } = useSubscriptionStatus({
    enabled: isAuthenticated,
  });

  if (status === "loading" || isLoading || subscription?.isPremium) return null;

  const query = from ? `?from=${encodeURIComponent(from)}` : "";

  return (
    <section
      className={cn(
        "rounded-xl border border-yellow-500/40 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-4 w-4 text-yellow-400" aria-hidden="true" />
            {dict.title}
          </h2>
          <p className="text-sm text-muted-foreground">{dict.free_note}</p>
          <ul className="grid gap-x-8 gap-y-1.5 pt-2 text-sm sm:grid-cols-2">
            {dict.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <p className="text-sm">
            <span className="text-muted-foreground">{dict.price_prefix} </span>
            <span className="font-semibold">
              {dictionary.premium.plans.yearly.equivalentPrice}
            </span>
          </p>
          <Button
            asChild
            className="bg-yellow-600 text-white hover:bg-yellow-700"
          >
            <Link href={`/${lang}${Routes.Premium}${query}`}>
              {dict.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
