"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Routes } from "@/routes/routes";

export interface InProgressAttemptBannerProps {
  lang: "en" | "pt";
  attemptId: number;
  practiceExamTitle: string;
  answeredCount: number;
  totalQuestions: number;
  dict: {
    heading: string;
    description: string;
    free_try_note: string;
    resume: string;
  };
}

/**
 * Tells the student they left an attempt running and that switching exams is free —
 * the free try is only spent when an attempt is actually finished.
 */
export function InProgressAttemptBanner({
  lang,
  attemptId,
  practiceExamTitle,
  answeredCount,
  totalQuestions,
  dict,
}: InProgressAttemptBannerProps) {
  return (
    <Card className="border-primary/40 bg-primary/5 py-4">
      <CardContent className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center">
        <div className="rounded-md bg-primary/15 p-2 text-primary self-start">
          <Play className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-medium">{dict.heading}</p>
          <p className="text-sm text-muted-foreground">
            {dict.description
              .replace("{{title}}", practiceExamTitle)
              .replace("{{answered}}", String(answeredCount))
              .replace("{{total}}", String(totalQuestions))}
          </p>
          <p className="text-xs text-muted-foreground">{dict.free_try_note}</p>
        </div>

        <Button asChild className="shrink-0">
          <Link href={`/${lang}${Routes.Practice}/${attemptId}/attempt`}>
            {dict.resume}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
