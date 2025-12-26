"use client";

import { Clock, Target, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { type Exam } from "@/services/exams/use-exams";
import {
  getDifficultyLabel,
  formatTimeLimit,
  getDifficultyColors,
} from "../utils";

export interface ExamCardProps {
  exam: Exam;
  onStartExam: (examId: number) => void;
  isLoading: boolean;
  dict: {
    card: {
      start_exam: string;
      time_limit: string;
      minimum_score: string;
      questions: string;
      platform: string;
    };
    dialog: {
      title: string;
      description: string;
      difficulty_level: string;
      time_limit: string;
      questions_count: string;
      passing_score: string;
      platform: string;
      cancel: string;
      start: string;
      starting: string;
    };
    difficulty_levels: {
      foundation: string;
      associate: string;
      professional: string;
      specialty: string;
      beginner: string;
      intermediate: string;
      advanced: string;
    };
  };
}

export function ExamCard({
  exam,
  onStartExam,
  isLoading,
  dict,
}: ExamCardProps) {
  const difficultyLabel = exam.difficulty_level
    ? getDifficultyLabel(exam.difficulty_level, dict.difficulty_levels)
    : dict.difficulty_levels[
        exam.difficulty.toLowerCase() as keyof typeof dict.difficulty_levels
      ];

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{exam.title}</CardTitle>
            <CardDescription className="line-clamp-1">
              {exam.exam?.title || "Practice Exam"}
            </CardDescription>
          </div>
          <Badge
            className={cn(
              "ml-2 shrink-0",
              getDifficultyColors(exam.difficulty)
            )}
          >
            {difficultyLabel}
          </Badge>
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
            <span className="font-medium text-foreground">
              {formatTimeLimit(exam.time_limit)}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{dict.card.minimum_score}:</span>
            </div>
            <span className="font-medium text-foreground">
              {exam.passing_score}%
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{dict.card.questions}:</span>
            </div>
            <span className="font-medium text-foreground">
              {exam.question_count}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end mt-auto border-t pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">{dict.card.start_exam}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dict.dialog.title}</DialogTitle>
              <DialogDescription>{dict.dialog.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-lg">{exam.title}</h4>
                {exam.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {exam.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {dict.dialog.difficulty_level}
                  </p>
                  <p className="font-medium">{difficultyLabel}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {dict.dialog.time_limit}
                  </p>
                  <p className="font-medium">
                    {formatTimeLimit(exam.time_limit)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {dict.dialog.questions_count}
                  </p>
                  <p className="font-medium">{exam.question_count}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {dict.dialog.passing_score}
                  </p>
                  <p className="font-medium">{exam.passing_score}%</p>
                </div>
              </div>

              {exam.exam?.platform && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {dict.dialog.platform}
                  </p>
                  <p className="font-medium">{exam.exam.platform}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{dict.dialog.cancel}</Button>
              </DialogClose>
              <Button onClick={() => onStartExam(exam.id)} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? dict.dialog.starting : dict.dialog.start}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
