"use client";

import Link from "next/link";
import { Play, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {
  InProgressAttempt,
  RecentAttempt,
} from "@/services/student-practice-attempts/get-dashboard-summary";

export interface ResumeBannerProps {
  lang: "en" | "pt";
  inProgress: InProgressAttempt | null;
  lastFailed: RecentAttempt | null;
  resumeDict: {
    heading: string;
    description: string;
    cta: string;
  };
  retryDict: {
    heading: string;
    description: string;
    cta: string;
  };
}

export function ResumeBanner({
  lang,
  inProgress,
  lastFailed,
  resumeDict,
  retryDict,
}: ResumeBannerProps) {
  if (inProgress) {
    return (
      <Card className="border-primary/40 bg-primary/5 py-4">
        <CardContent className="flex items-center gap-4 px-4">
          <div className="rounded-md bg-primary/15 p-2 text-primary">
            <Play className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{resumeDict.heading}</p>
            <p className="text-sm text-muted-foreground truncate">
              {resumeDict.description.replace(
                "{{title}}",
                inProgress.practiceExamTitle ?? "",
              )}
            </p>
          </div>
          <Button asChild>
            <Link
              href={`/${lang}/student/practice/${inProgress.attemptId}/attempt`}
            >
              {resumeDict.cta}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (lastFailed) {
    return (
      <Card className="py-4">
        <CardContent className="flex items-center gap-4 px-4">
          <div className="rounded-md bg-muted p-2 text-muted-foreground">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{retryDict.heading}</p>
            <p className="text-sm text-muted-foreground truncate">
              {retryDict.description
                .replace("{{title}}", lastFailed.practiceExamTitle ?? "")
                .replace(
                  "{{score}}",
                  lastFailed.score != null ? `${lastFailed.score}%` : "—",
                )}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/${lang}/practice-exams`}>{retryDict.cta}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
