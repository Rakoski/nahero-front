"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { ArrowLeft, Check, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InlineError, PageError } from "@/components/shared";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { usePracticeExamWizard, WIZARD_STEPS, type WizardStep } from "./practice-exam-wizard-provider";
import { ExamStep } from "./exam-step";
import { PracticeExamStep } from "./practice-exam-step";
import { DomainsStep } from "./domains-step";
import { QuestionsStep } from "./questions-step";
import { ReviewStep } from "./review-step";

const STEP_CONTENT: Record<WizardStep, () => ReactNode> = {
  exam: () => <ExamStep />,
  practiceExam: () => <PracticeExamStep />,
  domains: () => <DomainsStep />,
  questions: () => <QuestionsStep />,
  review: () => <ReviewStep />,
};

export function PracticeExamWizard() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.instructor.wizard;
  const { step, practiceExamId, practiceExam, practiceExamQuery, isCompleted, isUnlocked, goTo } =
    usePracticeExamWizard();

  const backLink = (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link href={`/${lang}${Routes.TeacherDashboard}`}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {dict.back}
      </Link>
    </Button>
  );

  if (practiceExamId !== undefined && practiceExamQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">{dict.loading}</p>
        </div>
      </div>
    );
  }

  if (practiceExamId !== undefined && !practiceExam) {
    const notFound = practiceExamQuery.error instanceof AxiosError && practiceExamQuery.error.response?.status === 404;

    return (
      <div className="container mx-auto space-y-4 px-4 py-8">
        {backLink}
        {notFound ? (
          <p className="rounded-lg border p-6 text-center text-muted-foreground">{dict.notFound}</p>
        ) : (
          <>
            <InlineError error={practiceExamQuery.error} />
            <PageError
              title={dictionary.error.title}
              description={dict.loadError}
              retryLabel={dictionary.error.btn_retry}
              onRetry={() => practiceExamQuery.refetch()}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="space-y-2">
        {backLink}
        <h1 className="text-3xl font-bold break-words">{practiceExam ? practiceExam.title : dict.newTitle}</h1>
        {practiceExam && <p className="text-muted-foreground">{dict.editTitle}</p>}
      </div>

      <Tabs value={step} onValueChange={(value) => goTo(value as WizardStep)}>
        <div className="-mx-4 overflow-x-auto px-4">
          <TabsList className="h-auto w-max">
            {WIZARD_STEPS.map((wizardStep, index) => {
              const unlocked = isUnlocked(wizardStep);

              return (
                <TabsTrigger key={wizardStep} value={wizardStep} disabled={!unlocked} className="gap-1.5 px-3 py-1.5">
                  {isCompleted(wizardStep) ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : unlocked ? (
                    <span className="text-xs text-muted-foreground">{index + 1}</span>
                  ) : (
                    <Lock className="h-3.5 w-3.5" />
                  )}
                  {dict.steps[wizardStep]}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {WIZARD_STEPS.map((wizardStep) => (
          <TabsContent key={wizardStep} value={wizardStep} className="pt-4">
            {wizardStep === step && STEP_CONTENT[wizardStep]()}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
