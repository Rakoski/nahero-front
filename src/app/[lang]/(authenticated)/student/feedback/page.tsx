"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageError, PremiumBanner } from "@/components/shared";
import { Routes } from "@/routes/routes";
import { useLocale } from "@/providers/locale-provider";
import { useFeedbackPage } from "@/hooks/useFeedbackPage";
import { DomainBreakdown } from "@/components/results/domain-breakdown";
import { StudyPlanCard } from "@/components/results/study-plan-card";
import { FeedbackAttempts } from "@/components/feedback/feedback-attempts";
import { PracticeQuestionCard } from "@/components/feedback/practice-question-card";

const LOCKED_PREVIEW_ATTEMPTS = [
  { attemptId: 3, endTime: "2026-01-12T10:00:00", score: 48, total: 65, passed: false },
  { attemptId: 2, endTime: "2026-01-08T10:00:00", score: 44, total: 65, passed: false },
  { attemptId: 1, endTime: "2026-01-03T10:00:00", score: 39, total: 65, passed: false },
];

const LOCKED_PREVIEW_DOMAINS = [
  { domain: "Security and Compliance", correct: 9, total: 20 },
  { domain: "Billing, Pricing, and Support", correct: 6, total: 10 },
  { domain: "Cloud Technology and Services", correct: 21, total: 30 },
  { domain: "Cloud Concepts", correct: 14, total: 17 },
];

function FeedbackPageContent() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.feedbackPage;
  const router = useRouter();
  const searchParams = useSearchParams();
  const examSlug = searchParams.get("exam");
  const { data: page, isLoading, isError, isPaywalled, refetch } = useFeedbackPage(examSlug);

  const selectExam = (slug: string) => {
    router.replace(
      `/${lang}${Routes.Feedback}?exam=${encodeURIComponent(slug)}`,
    );
  };

  if (isPaywalled) {
    return (
      <div className="container mx-auto space-y-6 px-4 py-8">
        <PremiumBanner
          dict={dictionary.shared.premiumBanner.feedback}
          from="feedback"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none select-none space-y-6 blur-sm"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <FeedbackAttempts attempts={LOCKED_PREVIEW_ATTEMPTS} lang={lang} dict={dict} />
            <DomainBreakdown
              domains={LOCKED_PREVIEW_DOMAINS}
              weakestDomain={LOCKED_PREVIEW_DOMAINS[0].domain}
              dict={{ ...dictionary.examResults.domains, title: dict.gapsTitle }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">{dict.loading}</p>
        </div>
      </div>
    );
  }

  if (isError || !page) {
    return (
      <PageError
        title={dictionary.error.title}
        description={dict.loadError}
        retryLabel={dictionary.error.btn_retry}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {page.exams.length === 0 ? (
        <div className="space-y-4 rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">{dict.empty}</p>
          <Button asChild>
            <Link href={`/${lang}${Routes.PracticeExams}`}>
              {dict.emptyCta}
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {page.exams.length > 1 && page.practiceExam && (
            <div className="space-y-2">
              <span className="text-sm font-medium">{dict.examLabel}</span>
              <Select value={page.practiceExam.slug} onValueChange={selectExam}>
                <SelectTrigger className="w-full sm:w-96 mt-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {page.exams.map((exam) => (
                    <SelectItem key={exam.slug} value={exam.slug}>
                      {exam.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {page.exams.length === 1 && page.practiceExam && (
            <p className="font-medium">{page.practiceExam.title}</p>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {page.attempts && (
              <FeedbackAttempts
                attempts={page.attempts}
                lang={lang}
                dict={dict}
              />
            )}

            {page.domains && (
              <DomainBreakdown
                domains={page.domains}
                weakestDomain={page.weakestDomain ?? null}
                dict={{
                  ...dictionary.examResults.domains,
                  title: dict.gapsTitle,
                }}
              />
            )}
          </div>

          {page.latestAttemptId && (
            <StudyPlanCard
              attemptId={page.latestAttemptId}
              dict={dictionary.examResults.studyPlan}
            />
          )}

          {page.weakestDomain && (
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">
                  {dict.practiceTitle.replace(
                    "{{domain}}",
                    page.weakestDomain,
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {dict.practiceSubtitle}
                </p>
              </div>
              {page.practiceQuestions &&
              page.practiceQuestions.length > 0 ? (
                page.practiceQuestions.map((question, index) => (
                  <PracticeQuestionCard
                    key={question.questionId}
                    question={question}
                    number={index + 1}
                    dict={dict}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  {dict.practiceEmpty}
                </p>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={null}>
      <FeedbackPageContent />
    </Suspense>
  );
}
