"use client";

import { format, parseISO } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DailyActivity } from "@/services/student-practice-attempts/get-dashboard-summary";

export interface StreakCardProps {
  streakDays: number;
  activity: DailyActivity[];
  lang: "en" | "pt";
  dict: {
    label_one: string;
    label_other: string;
    today_done: string;
    keep_going: string;
    start: string;
    last_7_days: string;
    last_30_days: string;
    active_days: string;
    best_streak: string;
    tooltip: string;
  };
  className?: string;
}

function intensityClass(count: number): string {
  if (count === 0) return "bg-muted";
  if (count === 1) return "bg-orange-500/40";
  if (count === 2) return "bg-orange-500/70";
  return "bg-orange-500";
}

function longestRun(activity: DailyActivity[]): number {
  let best = 0;
  let current = 0;
  for (const day of activity) {
    current = day.attempts > 0 ? current + 1 : 0;
    best = Math.max(best, current);
  }
  return best;
}

export function StreakCard({
  streakDays,
  activity,
  lang,
  dict,
  className,
}: StreakCardProps) {
  const locale = lang === "pt" ? ptBR : enUS;
  const today = activity[activity.length - 1];
  const practicedToday = (today?.attempts ?? 0) > 0;
  const lastWeek = activity.slice(-7);
  const activeDays = activity.filter((day) => day.attempts > 0).length;
  const isActive = streakDays > 0;

  const message = practicedToday
    ? dict.today_done
    : isActive
      ? dict.keep_going
      : dict.start;

  const tooltipFor = (day: DailyActivity) =>
    dict.tooltip
      .replace("{{count}}", day.attempts.toString())
      .replace("{{date}}", format(parseISO(day.date), "PP", { locale }));

  return (
    <Card
      className={cn(
        "overflow-hidden border-orange-500/30 bg-linear-to-br from-orange-500/15 via-card to-card",
        className,
      )}
    >
      <CardContent className="grid gap-6 pt-6 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex items-center gap-4">
          <Flame
            className={cn(
              "h-20 w-20 shrink-0",
              isActive
                ? "fill-orange-500 text-orange-400"
                : "fill-muted text-muted-foreground",
            )}
          />
          <div>
            <p
              className={cn(
                "text-6xl font-extrabold leading-none",
                isActive ? "text-orange-400" : "text-muted-foreground",
              )}
            >
              {streakDays}
            </p>
            <p className="mt-1 text-lg font-semibold">
              {streakDays === 1 ? dict.label_one : dict.label_other}
            </p>
            <p className="mt-1 max-w-56 text-sm text-muted-foreground">
              {message}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {dict.last_7_days}
            </p>
            <div className="flex justify-between gap-2">
              {lastWeek.map((day, index) => {
                const date = parseISO(day.date);
                const active = day.attempts > 0;
                const isToday = index === lastWeek.length - 1;
                return (
                  <div
                    key={day.date}
                    className="flex flex-col items-center gap-1"
                    title={tooltipFor(day)}
                  >
                    <span
                      className={cn(
                        "text-xs uppercase text-muted-foreground",
                        isToday && "font-bold text-foreground",
                      )}
                    >
                      {format(date, "EEEEE", { locale })}
                    </span>
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full",
                        active ? "bg-orange-500" : "bg-muted",
                        isToday && "ring-2 ring-orange-400 ring-offset-2 ring-offset-card",
                      )}
                    >
                      {active && <Flame className="h-5 w-5 fill-white text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {dict.last_30_days}
              </p>
              <p className="text-xs text-muted-foreground">
                {dict.active_days.replace("{{count}}", activeDays.toString())}
                {" · "}
                {dict.best_streak.replace(
                  "{{count}}",
                  longestRun(activity).toString(),
                )}
              </p>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {activity.map((day) => (
                <div
                  key={day.date}
                  title={tooltipFor(day)}
                  className={cn(
                    "aspect-square rounded-sm",
                    intensityClass(day.attempts),
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
