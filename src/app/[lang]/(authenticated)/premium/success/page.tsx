"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
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
import { resolveLocale } from "@/lib/locale";

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 15000;

type SuccessDict = {
  polling_title: string;
  polling_subtitle: string;
  success_title: string;
  success_subtitle: string;
  timeout_title: string;
  timeout_subtitle: string;
  cta_dashboard: string;
  cta_exams: string;
  cta_retry: string;
};

interface Props {
  params: Promise<{ lang: string }>;
}

export default function PremiumSuccessPage({ params }: Props) {
  const [dict, setDict] = useState<SuccessDict | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");
  const [timedOut, setTimedOut] = useState(false);

  const { data: subscription } = useSubscriptionStatus({
    refetchInterval: (query) =>
      query.state.data?.isPremium ? false : POLL_INTERVAL_MS,
  });

  useEffect(() => {
    params.then(async (p) => {
      setLang(resolveLocale(p.lang));
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(resolveLocale(p.lang));
      setDict(dictionary.premium.success as unknown as SuccessDict);
    });
  }, [params]);

  useEffect(() => {
    if (subscription?.isPremium) return;
    const timer = setTimeout(() => setTimedOut(true), POLL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [subscription?.isPremium]);

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const isPremium = !!subscription?.isPremium;
  const isTimeout = !isPremium && timedOut;

  return (
    <div className="container mx-auto py-16 px-4 max-w-xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            {isPremium ? (
              <Sparkles className="w-14 h-14 text-primary" />
            ) : isTimeout ? (
              <CheckCircle2 className="w-14 h-14 text-yellow-500" />
            ) : (
              <Loader2 className="w-14 h-14 text-primary animate-spin" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isPremium
              ? dict.success_title
              : isTimeout
                ? dict.timeout_title
                : dict.polling_title}
          </CardTitle>
          <CardDescription>
            {isPremium
              ? dict.success_subtitle
              : isTimeout
                ? dict.timeout_subtitle
                : dict.polling_subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 items-center">
          {isPremium ? (
            <>
              <Button asChild size="lg" className="w-full max-w-xs">
                <Link href={`/${lang}${Routes.StudentDashboard}`}>
                  {dict.cta_dashboard}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full max-w-xs">
                <Link href={`/${lang}${Routes.PracticeExams}`}>
                  {dict.cta_exams}
                </Link>
              </Button>
            </>
          ) : isTimeout ? (
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="w-full max-w-xs"
            >
              {dict.cta_retry}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
