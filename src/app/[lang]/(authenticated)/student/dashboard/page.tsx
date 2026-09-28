"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ByExamList,
  EffortCard,
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
import type { DailyActivity } from "@/services/student-practice-attempts/get-dashboard-summary";
import { useLocale } from "@/providers/locale-provider";

const LOCKED_PREVIEW_ACTIVE_DAYS = new Set([0, 1, 2, 3, 5, 8, 9, 13, 14, 20]);

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
  const { data: session } = useSession();

  const { data, isLoading, isError, isPaywalled, refetch } =
    useStudentDashboardSummary();

  const header = (
    <header className="space-y-1">
      <h1 className="text-3xl font-bold">{dict.title}</h1>
      <p className="text-muted-foreground">
        {dict.welcome.replace("{{name}}", session?.user?.name ?? "")}
      </p>
    </header>
  );

  if (isPaywalled) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        {header}

        <PremiumBanner
          dict={dictionary.shared.premiumBanner.dashboard}
          from="dashboard"
        />

        <div
          aria-hidden="true"
          className="space-y-4 blur-sm select-none pointer-events-none"
        >
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StreakCard
              className="lg:col-span-2"
              streakDays={4}
              activity={buildLockedPreviewActivity()}
              lang={lang}
              dict={dict.streak}
            />
            <PerformanceCard
              averageScore={72}
              bestScore={88}
              passRate={0.67}
              dict={dict.performance}
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <EffortCard
              totalAttempts={9}
              completedAttempts={6}
              totalStudyMinutes={430}
              dict={dict.effort}
            />
            <Card className="lg:col-span-2">
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
      {header}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StreakCard
          className="lg:col-span-2"
          streakDays={data.currentStreakDays}
          activity={data.activityLast30Days}
          lang={lang}
          dict={dict.streak}
        />
        <PerformanceCard
          averageScore={data.averageScore}
          bestScore={data.bestScore}
          passRate={data.passRate}
          dict={dict.performance}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <EffortCard
          totalAttempts={data.totalAttempts}
          completedAttempts={data.completedAttempts}
          totalStudyMinutes={data.totalStudyMinutes}
          dict={dict.effort}
        />
        <div className="lg:col-span-2">
          <ScoreOverTimeChart
            data={data.scoreOverTime}
            dict={dict.charts.score_over_time}
          />
        </div>
      </section>

      <ByExamList data={data.byPracticeExam} dict={dict.charts.by_exam} />
    </div>
  );
}
