"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PracticeExamPerformance } from "@/services/student-practice-attempts/get-dashboard-summary";

export interface ByExamListProps {
  data: PracticeExamPerformance[];
  dict: {
    title: string;
    description: string;
    attempts_label: string;
    best: string;
    last: string;
    empty: string;
  };
}

export function ByExamList({ data, dict }: ByExamListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-12 text-center">
            {dict.empty}
          </p>
        ) : (
          <ul className="space-y-4">
            {data.map((row) => (
              <li key={row.practiceExamId} className="space-y-2">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium truncate">{row.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {dict.attempts_label.replace(
                      "{{count}}",
                      row.attempts.toString(),
                    )}
                  </span>
                </div>
                <Progress value={Math.round(row.passRate * 100)} />
                <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                  <span>
                    {dict.best}:{" "}
                    {row.bestScore != null ? `${row.bestScore}%` : "—"}
                  </span>
                  <span>{Math.round(row.passRate * 100)}%</span>
                  <span>
                    {dict.last}:{" "}
                    {row.lastScore != null ? `${row.lastScore}%` : "—"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
