"use client";

import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";

export type PremiumBannerDict = {
  title: string;
  description: string;
  cta: string;
};

interface PremiumBannerProps {
  dict: PremiumBannerDict;
  /** Tags the checkout funnel so /premium can tailor its headline. */
  from?: string;
  className?: string;
}

export function PremiumBanner({ dict, from, className }: PremiumBannerProps) {
  const { lang } = useLocale();
  const query = from ? `?from=${encodeURIComponent(from)}` : "";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-yellow-500/40 bg-gradient-to-r from-yellow-500/15 via-yellow-500/5 to-transparent p-6 sm:p-8",
        className,
      )}
    >
      <Sparkles
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-yellow-500/10"
      />

      <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400">
            <Lock className="h-5 w-5" />
          </span>
          <div className="space-y-1">
            <h3 className="text-xl font-bold sm:text-2xl">{dict.title}</h3>
            <p className="text-sm text-muted-foreground sm:text-base">
              {dict.description}
            </p>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className="w-full flex-shrink-0 bg-yellow-600 text-white hover:bg-yellow-700 sm:w-auto"
        >
          <Link href={`/${lang}${Routes.Premium}${query}`}>{dict.cta}</Link>
        </Button>
      </div>
    </div>
  );
}
