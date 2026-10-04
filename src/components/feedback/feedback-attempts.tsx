import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FeedbackAttemptSummary } from "@/services/feedback/get-page";

export type FeedbackAttemptsDict = {
  attemptsTitle: string;
  attemptScore: string;
  passed: string;
  failed: string;
  viewResults: string;
};

interface FeedbackAttemptsProps {
  attempts: FeedbackAttemptSummary[];
  lang: string;
  dict: FeedbackAttemptsDict;
  className?: string;
}

export function FeedbackAttempts({ attempts, lang, dict, className }: FeedbackAttemptsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{dict.attemptsTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {attempts.map((attempt) => (
            <li
              key={attempt.attemptId}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold tabular-nums">
                  {dict.attemptScore
                    .replace("{{score}}", String(attempt.score))
                    .replace("{{total}}", String(attempt.total))}
                </span>
                <Badge variant={attempt.passed ? "default" : "destructive"}>
                  {attempt.passed ? dict.passed : dict.failed}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="text-sm text-muted-foreground">
                  {attempt.endTime ? new Date(attempt.endTime).toLocaleDateString(lang) : ""}
                </span>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/${lang}/student/practice/${attempt.attemptId}/attempt/results`}>
                    {dict.viewResults}
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
