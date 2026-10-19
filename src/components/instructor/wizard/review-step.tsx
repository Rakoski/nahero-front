"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineError } from "@/components/shared";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useUpdatePracticeExamStatus } from "@/hooks/useInstructor";
import { usePracticeExamWizard } from "./practice-exam-wizard-provider";

export function ReviewStep() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.instructor.wizard.review;
  const languages = dictionary.instructor.wizard.questions.languages;
  const { practiceExam } = usePracticeExamWizard();
  const updateStatus = useUpdatePracticeExamStatus();

  if (!practiceExam) return null;

  const target = practiceExam.numberOfQuestions ?? 0;
  const largestLanguage = Math.max(0, ...Object.values(practiceExam.questionCountByLanguage));
  const enough = largestLanguage >= target;

  const toggle = () =>
    updateStatus.mutate(
      { practiceExamId: practiceExam.id, active: !practiceExam.isActive },
      { onSuccess: () => toast.success(practiceExam.isActive ? dict.unpublishedToast : dict.publishedToast) },
    );

  const details = [
    { label: dict.exam, value: practiceExam.exam?.title ?? "—" },
    { label: dict.practiceExam, value: practiceExam.title },
    { label: dict.passingScore, value: `${practiceExam.passingScore}%` },
    {
      label: dict.timeLimit,
      value: practiceExam.timeLimit ? dict.minutes.replace("{{count}}", String(practiceExam.timeLimit)) : "—",
    },
    { label: dict.numberOfQuestions, value: practiceExam.numberOfQuestions ?? "—" },
    { label: dict.domains, value: practiceExam.domains.length },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid gap-3 sm:grid-cols-2">
          {details.map((item) => (
            <div key={item.label} className="rounded-lg border p-3">
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd className="font-medium break-words">{item.value}</dd>
            </div>
          ))}
          <div className="rounded-lg border p-3 sm:col-span-2">
            <dt className="text-xs text-muted-foreground">{dict.questions}</dt>
            <dd className="flex flex-wrap gap-2 pt-1">
              {Object.entries(practiceExam.questionCountByLanguage).map(([language, count]) => (
                <Badge key={language} variant="outline">
                  {dict.byLanguage
                    .replace("{{language}}", languages[language as keyof typeof languages] ?? language)
                    .replace("{{count}}", String(count))}
                </Badge>
              ))}
            </dd>
          </div>
        </dl>

        {!enough && !practiceExam.isActive && (
          <p className="rounded-lg border border-yellow-600/40 bg-yellow-500/10 p-3 text-sm">
            {dict.notEnough.replaceAll("{{target}}", String(target))}
          </p>
        )}

        <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{dict.status}</span>
            <Badge variant={practiceExam.isActive ? "default" : "secondary"}>
              {practiceExam.isActive ? dict.published : dict.draft}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {practiceExam.isActive && (
              <Button asChild variant="outline">
                <Link href={`/${lang}${Routes.PracticeExams}/${practiceExam.slug}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {dict.viewPublic}
                </Link>
              </Button>
            )}
            <Button
              variant={practiceExam.isActive ? "outline" : "default"}
              disabled={updateStatus.isPending || (!practiceExam.isActive && !enough)}
              onClick={toggle}
            >
              {updateStatus.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {practiceExam.isActive ? dict.unpublish : dict.publish}
            </Button>
          </div>
        </div>

        <InlineError error={updateStatus.error} />

        <div className="flex justify-end border-t pt-4">
          <Button asChild variant="ghost">
            <Link href={`/${lang}${Routes.TeacherDashboard}`}>{dict.done}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
