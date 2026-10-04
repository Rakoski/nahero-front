"use client";

import Link from "next/link";
import {
  QuestionsCard,
  PerformanceCard,
  ScoreOverTimeChart,
  StreakCard,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageError, PremiumBanner } from "@/components/shared";
import { useStudentDashboardSummary } from "@/hooks/useStudentDashboardSummary";
import type {
  DailyActivity,
  QuestionActivity,
} from "@/services/student-practice-attempts/get-dashboard-summary";
import { useLocale } from "@/providers/locale-provider";

const LOCKED_PREVIEW_ACTIVE_DAYS = new Set([0, 1, 2, 3, 5, 8, 9, 13, 14, 20]);

const LOCKED_PREVIEW_QUESTIONS: QuestionActivity = {
  since: "2026-01-03T10:00:00",
  windows: [
    { days: 7, answered: 130, correct: 92 },
    { days: 30, answered: 390, correct: 281 },
    { days: 90, answered: 715, correct: 498 },
    { days: null, answered: 715, correct: 498 },
  ],
};

function buildLockedPreviewActivity(): DailyActivity[] {
  const today = new Date();
  return Array.from({ length: 30 }, (_, index) => {
    const daysAgo = 29 - index;
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    return {
      date: date.toISOString().slice(0, 10),
      attempts: LOCKED_PREVIEW_ACTIVE_DAYS.has(daysAgo) ? (daysAgo % 3) + 1 : 0,
    };
  });
}

export default function StudentDashboardPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.studentDashboard;

  const { data, isLoading, isError, isPaywalled, refetch } =
    useStudentDashboardSummary();

  if (isPaywalled) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <PremiumBanner
          dict={dictionary.shared.premiumBanner.dashboard}
          from="dashboard"
        />

        <div
          aria-hidden="true"
          className="space-y-4 blur-sm select-none pointer-events-none"
        >
          <section className="mx-auto grid w-full auto-rows-fr gap-4 lg:w-2/3">
            <StreakCard
              className="h-full"
              streakDays={4}
              activity={buildLockedPreviewActivity()}
              lang={lang}
              dict={dict.streak}
            />
            <PerformanceCard
              className="h-full"
              averageScore={72}
              bestScore={88}
              passRate={0.67}
              dict={dict.performance}
            />
            <QuestionsCard
              className="h-full"
              activity={LOCKED_PREVIEW_QUESTIONS}
              lang={lang}
              dict={dict.questions}
            />
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{dict.charts.score_over_time.title}</CardTitle>
                <CardDescription>
                  {dict.charts.score_over_time.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-4/5 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-32 w-full rounded bg-muted" />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{dict.loading}</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <PageError
        title={dictionary.error.title}
        description={dict.load_error}
        retryLabel={dictionary.error.btn_retry}
        onRetry={() => refetch()}
      />
    );
  }

  const noActivity = data.totalAttempts === 0;

  if (noActivity) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>{dict.empty.title}</CardTitle>
            <CardDescription>{dict.empty.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/${lang}/practice-exams`}>{dict.empty.cta}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <section className="mx-auto grid w-full auto-rows-fr gap-4 lg:w-2/3">
        <StreakCard
          className="h-full"
          streakDays={data.currentStreakDays}
          activity={data.activityLast30Days}
          lang={lang}
          dict={dict.streak}
        />
        <PerformanceCard
          className="h-full"
          averageScore={data.averageScore}
          bestScore={data.bestScore}
          passRate={data.passRate}
          dict={dict.performance}
        />
        <QuestionsCard
          className="h-full"
          activity={data.questionActivity}
          lang={lang}
          dict={dict.questions}
        />
        <ScoreOverTimeChart
          className="h-full"
          data={data.scoreOverTime}
          dict={dict.charts.score_over_time}
        />
      </section>

    </div>
  );
}
