"use client";

import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DailyActivity } from "@/services/student-practice-attempts/get-dashboard-summary";

export interface ActivityHeatmapProps {
  data: DailyActivity[];
  dict: {
    title: string;
    description: string;
    tooltip: string;
  };
}

function intensityClass(count: number): string {
  if (count === 0) return "bg-muted";
  if (count === 1) return "bg-primary/30";
  if (count === 2) return "bg-primary/60";
  return "bg-primary";
}

export function ActivityHeatmap({ data, dict }: ActivityHeatmapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 flex-wrap">
          {data.map((day) => {
            const date = parseISO(day.date);
            const tooltip = dict.tooltip
              .replace("{{count}}", day.attempts.toString())
              .replace("{{date}}", format(date, "MMM d"));
            return (
              <div
                key={day.date}
                title={tooltip}
                className={cn(
                  "h-6 w-6 rounded-sm",
                  intensityClass(day.attempts),
                )}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
