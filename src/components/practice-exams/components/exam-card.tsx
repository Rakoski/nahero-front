"use client";

import Link from "next/link";
import { Clock, Target, BookOpen, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { type Exam } from "@/services/practice-exams/use-exams";
import { useLocale } from "@/providers/locale-provider";
import {
  getDifficultyLabel,
  formatTimeLimit,
  getDifficultyColors,
} from "../../../app/[lang]/(unauthenticated)/practice-exams/utils";

export interface ExamCardProps {
  exam: Exam;
  /** Set when the student left an attempt running on this practice exam. */
  inProgressAttemptId?: number;
}

export function ExamCard({ exam, inProgressAttemptId }: ExamCardProps) {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.practiceExams;
  const difficultyValue = exam.difficulty_level || exam.difficulty;
  const difficultyLabel = getDifficultyLabel(
    difficultyValue,
    dict.difficulty_levels,
  );

  const detailHref = `/${lang}${Routes.PracticeExams}/${exam.slug}`;
  const resumeHref = `/${lang}${Routes.Practice}/${inProgressAttemptId}/attempt`;

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">
              <Link href={detailHref} className="hover:underline">
                {exam.title}
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-1">
              {exam.exam?.title || "Practice Exam"}
            </CardDescription>
          </div>
          <div className="ml-2 flex shrink-0 flex-col items-end gap-1">
            <Badge className={cn(getDifficultyColors(difficultyValue))}>
              {difficultyLabel}
            </Badge>
            {inProgressAttemptId && (
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary"
              >
                {dict.in_progress.badge}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {exam.description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{dict.card.time_limit}:</span>
            </div>
            <span className="font-medium text-yellow-400">
              {formatTimeLimit(exam.time_limit)}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{dict.card.minimum_score}:</span>
            </div>
            <span className="font-medium text-yellow-400">
              {exam.passing_score}%
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{dict.card.questions}:</span>
            </div>
            <span className="font-medium text-yellow-400">
              {exam.question_count}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end mt-auto border-t pt-4">
        {inProgressAttemptId ? (
          <Button asChild className="w-full">
            <Link href={resumeHref}>
              <Play className="mr-2 h-4 w-4" />
              {dict.in_progress.resume}
            </Link>
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={detailHref}>{dict.card.start_exam}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
