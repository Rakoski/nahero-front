"use client";

import Link from "next/link";
import { Loader2, Lock, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/locale-provider";
import { useAttemptFeedback } from "@/hooks/useAttemptFeedback";
import type { StudyPlan } from "@/services/student-practice-attempts/get-feedback";

export type StudyPlanCardDict = {
  title: string;
  generating: string;
  notReady: string;
  failed: string;
  retry: string;
  priorities: string;
  plan: string;
  weakest: string;
  lockedDescription: string;
  lockedCta: string;
};

interface StudyPlanCardProps {
  attemptId: number;
  dict: StudyPlanCardDict;
  className?: string;
}

const PLACEHOLDER_WIDTHS = ["w-full", "w-11/12", "w-4/5", "w-full", "w-2/3"];

export function StudyPlanCard({ attemptId, dict, className }: StudyPlanCardProps) {
  const { lang } = useLocale();
  const { data, isLoading, isGenerating, hasGivenUp, retry } =
    useAttemptFeedback(attemptId, !Number.isNaN(attemptId));

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">{dict.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {data?.locked ? (
          <div className="space-y-4">
            {data.weakestDomain && (
              <p className="text-sm font-medium">
                {dict.weakest.replace("{{domain}}", data.weakestDomain)}
              </p>
            )}
            <div className="relative overflow-hidden rounded-lg border p-4">
              <div
                aria-hidden="true"
                className="pointer-events-none select-none space-y-3 blur-sm"
              >
                {PLACEHOLDER_WIDTHS.map((width, index) => (
                  <div key={index} className={`h-3 rounded bg-muted-foreground/30 ${width}`} />
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 p-4 text-center">
                <Lock className="h-5 w-5 text-yellow-500" />
                <p className="text-sm text-muted-foreground">{dict.lockedDescription}</p>
                <Button
                  asChild
                  className="w-full bg-yellow-600 text-white hover:bg-yellow-700 sm:w-auto"
                >
                  <Link href={`/${lang}${Routes.Premium}?from=study-plan`}>
                    {dict.lockedCta}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : data?.status === "ready" && data.content ? (
          <StudyPlanContent plan={data.content} dict={dict} />
        ) : data?.status === "failed" ? (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{dict.failed}</p>
            <Button variant="outline" onClick={retry} className="w-full sm:w-auto">
              {dict.retry}
            </Button>
          </div>
        ) : hasGivenUp ? (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{dict.notReady}</p>
            <Button variant="outline" onClick={retry} className="w-full sm:w-auto">
              {dict.retry}
            </Button>
          </div>
        ) : (isLoading || isGenerating) ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {dict.generating}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

const splitTopics = (topics: string) =>
  topics
    .split(",")
    .map((topic) => topic.trim())
    .filter(Boolean);

function StudyPlanContent({ plan, dict }: { plan: StudyPlan; dict: StudyPlanCardDict }) {
  return (
    <div className="space-y-8">
      <div className="flex gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4 sm:p-5">
        <Target className="mt-1 h-5 w-5 shrink-0 text-primary" />
        <p className="text-lg font-medium leading-relaxed">{plan.summary}</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">{dict.priorities}</h3>
        <ol className="grid gap-4 md:grid-cols-2">
          {plan.priorities.map((priority, index) => {
            const isTop = index === 0;

            return (
              <li
                key={`${priority.domain}-${index}`}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border border-l-4 p-4 sm:p-5",
                  isTop ? "border-l-red-500 bg-red-500/5" : "border-l-primary/60",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      isTop ? "bg-red-500 text-white" : "bg-muted text-foreground",
                    )}
                  >
                    {index + 1}
                  </span>
                  <h4 className="text-lg font-semibold leading-snug">{priority.domain}</h4>
                </div>
                <p className="text-base leading-relaxed">{priority.why}</p>
                <ul className="flex flex-wrap gap-2">
                  {splitTopics(priority.whatToStudy).map((topic) => (
                    <li key={topic}>
                      <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                        {topic}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">{dict.plan}</h3>
        <ol className="space-y-3">
          {plan.plan.map((topic, index) => (
            <li key={index} className="flex items-start gap-4 rounded-lg border p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </span>
              <p className="pt-1 text-base leading-relaxed">{topic}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
