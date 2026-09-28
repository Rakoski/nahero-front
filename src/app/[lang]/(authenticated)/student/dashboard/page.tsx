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
import { useStudentDashboardSummary } from "@/hooks/useStudentDashboardSummary";
import { useLocale } from "@/providers/locale-provider";

export default function StudentDashboardPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.studentDashboard;
  const { data: session } = useSession();

  const { data, isLoading, isError, isPaywalled } =
    useStudentDashboardSummary();

  if (isLoading || isPaywalled) {
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
      <div className="container mx-auto py-12 px-4">
        <p className="text-destructive">Failed to load dashboard.</p>
      </div>
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
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">{dict.title}</h1>
        <p className="text-muted-foreground">
          {dict.welcome.replace("{{name}}", session?.user?.name ?? "")}
        </p>
      </header>

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
