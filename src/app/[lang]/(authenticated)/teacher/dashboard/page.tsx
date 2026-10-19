"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Loader2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageError } from "@/components/shared";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useInstructorExams, useInstructorPracticeExams } from "@/hooks/useInstructor";

export default function InstructorDashboardPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.instructor.dashboard;
  const practiceExams = useInstructorPracticeExams();
  const exams = useInstructorExams();
  const createHref = `/${lang}${Routes.TeacherCreate}`;

  if (practiceExams.isLoading || exams.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">{dict.loading}</p>
        </div>
      </div>
    );
  }

  if (!practiceExams.data || !exams.data) {
    return (
      <PageError
        title={dictionary.error.title}
        description={dict.loadError}
        retryLabel={dictionary.error.btn_retry}
        onRetry={() => Promise.all([practiceExams.refetch(), exams.refetch()])}
      />
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{dict.title}</h1>
          <p className="text-muted-foreground">{dict.subtitle}</p>
        </div>
        <Button asChild>
          <Link href={createHref}>
            <Plus className="mr-2 h-4 w-4" />
            {dict.newPracticeExam}
          </Link>
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{dict.practiceExamsTitle}</h2>
        {practiceExams.data.length === 0 ? (
          <div className="space-y-4 rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">{dict.emptyPracticeExams}</p>
            <Button asChild>
              <Link href={createHref}>{dict.emptyCta}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {practiceExams.data.map((practiceExam) => {
              const target = practiceExam.numberOfQuestions ?? 0;

              return (
                <Card key={practiceExam.id} className="flex flex-col">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 text-lg">{practiceExam.title}</CardTitle>
                      <Badge variant={practiceExam.isActive ? "default" : "secondary"} className="shrink-0">
                        {practiceExam.isActive ? dict.published : dict.draft}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {practiceExam.examTitle} · {format(new Date(practiceExam.createdAt), "dd/MM/yyyy")}
                    </p>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4">
                    {target > 0 && (
                      <div className="space-y-2">
                        <Progress value={Math.min(100, (practiceExam.questionCount / target) * 100)} />
                        <p className="text-sm text-muted-foreground">
                          {dict.questionProgress
                            .replace("{{count}}", String(practiceExam.questionCount))
                            .replace("{{target}}", String(target))}
                        </p>
                      </div>
                    )}
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`${createHref}?practiceExamId=${practiceExam.id}`}>{dict.continue}</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{dict.examsTitle}</h2>
        {exams.data.length === 0 ? (
          <p className="rounded-lg border p-6 text-center text-muted-foreground">{dict.emptyExams}</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {exams.data.map((exam) => (
              <li key={exam.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium break-words">{exam.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {[exam.category, dict.practiceExamCount.replace("{{count}}", String(exam.practiceExamCount))]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`${createHref}?examId=${exam.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    {dict.addPracticeExam}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
