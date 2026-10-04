"use client";

import { useState } from "react";
import { CircleCheck, ListChecks, type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuestionActivity } from "@/services/student-practice-attempts/get-dashboard-summary";

export interface QuestionsCardProps {
  activity: QuestionActivity;
  lang: string;
  dict: {
    title: string;
    period_days: string;
    period_all: string;
    in_last_days: string;
    since: string;
    since_empty: string;
    answered: string;
    correct: string;
  };
  className?: string;
}

interface StatProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}

function Stat({ icon: Icon, label, value, hint }: StatProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
      <div className="rounded-md bg-yellow-500/10 p-2 text-yellow-500">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-2xl font-bold leading-tight">
          {value}
          {hint && <span className="ml-2 text-sm font-medium text-muted-foreground">{hint}</span>}
        </span>
      </div>
    </div>
  );
}

const DEFAULT_DAYS = 30;

export function QuestionsCard({ activity, lang, dict, className }: QuestionsCardProps) {
  const [selectedDays, setSelectedDays] = useState<number | null>(DEFAULT_DAYS);
  const current =
    activity.windows.find((candidate) => candidate.days === selectedDays) ?? activity.windows[0];

  const period =
    current.days === null
      ? activity.since
        ? dict.since.replace("{{date}}", new Date(activity.since).toLocaleDateString(lang))
        : dict.since_empty
      : dict.in_last_days.replace("{{days}}", String(current.days));
  const correctRate = current.answered > 0 ? Math.round((current.correct / current.answered) * 100) : null;

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="space-y-3">
        <CardTitle>{dict.title}</CardTitle>
        <div className="flex flex-wrap gap-1" role="tablist">
          {activity.windows.map((candidate) => (
            <button
              key={candidate.days ?? "all"}
              type="button"
              role="tab"
              aria-selected={candidate.days === current.days}
              onClick={() => setSelectedDays(candidate.days)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                candidate.days === current.days
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {candidate.days === null
                ? dict.period_all
                : dict.period_days.replace("{{days}}", String(candidate.days))}
            </button>
          ))}
        </div>
        <CardDescription>{period}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center gap-3">
        <Stat icon={ListChecks} label={dict.answered} value={current.answered.toString()} />
        <Stat
          icon={CircleCheck}
          label={dict.correct}
          value={current.correct.toString()}
          hint={correctRate === null ? undefined : `${correctRate}%`}
        />
      </CardContent>
    </Card>
  );
}
