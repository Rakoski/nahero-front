"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Routes } from "@/routes/routes";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

type WidgetDict = {
  premium: string;
  premium_badge: string;
  free_tries_badge: string;
};

interface Props {
  lang: string;
  dict: WidgetDict;
}

export function SubscriptionHeaderWidget({ lang, dict }: Props) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const { data: subscription } = useSubscriptionStatus({
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !subscription) return null;

  if (subscription.isPremium) {
    return (
      <Link
        href={`/${lang}${Routes.Subscription}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400 hover:bg-yellow-500/20 transition-colors"
      >
        <Sparkles className="h-3 w-3" />
        {dict.premium_badge}
      </Link>
    );
  }

  const freeTriesLeft = subscription.freeTriesLeft ?? 0;

  return (
    <Link
      href={`/${lang}${Routes.Premium}`}
      className="inline-flex items-center gap-2 rounded-full bg-yellow-600 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-700 transition-colors"
    >
      <span>{dict.premium}</span>
      {freeTriesLeft > 0 && (
        <Badge
          variant="secondary"
          className="h-4 px-1.5 text-[10px] leading-none"
        >
          {dict.free_tries_badge.replace(
            "{{count}}",
            freeTriesLeft.toString(),
          )}
        </Badge>
      )}
    </Link>
  );
}
