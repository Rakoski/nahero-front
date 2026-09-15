"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Award,
  CheckCircle2,
  Flame,
  ListChecks,
  Timer,
  TrendingUp,
} from "lucide-react";
import {
  ActivityHeatmap,
  ByExamList,
  KpiCard,
  ResumeBanner,
  ScoreOverTimeChart,
  StatusBreakdownChart,
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

function formatHours(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export default function StudentDashboardPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.studentDashboard;
  const { data: session } = useSession();

  const { data, isLoading, isError } = useStudentDashboardSummary();

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

  const formatPercent = (value: number | null) =>
    value == null ? dict.kpi.no_data : `${Math.round(value * 100)}%`;
  const formatScorePercent = (value: number | null) =>
    value == null ? dict.kpi.no_data : `${value}%`;

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">{dict.title}</h1>
        <p className="text-muted-foreground">
          {dict.welcome.replace("{{name}}", session?.user?.name ?? "")}
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          icon={ListChecks}
          label={dict.kpi.total_attempts}
          value={data.totalAttempts.toString()}
        />
        <KpiCard
          icon={CheckCircle2}
          label={dict.kpi.pass_rate}
          value={formatPercent(data.passRate)}
        />
        <KpiCard
          icon={TrendingUp}
          label={dict.kpi.average_score}
          value={
            data.averageScore != null
              ? `${Math.round(data.averageScore)}%`
              : dict.kpi.no_data
          }
        />
        <KpiCard
          icon={Award}
          label={dict.kpi.best_score}
          value={formatScorePercent(data.bestScore)}
        />
        <KpiCard
          icon={Timer}
          label={dict.kpi.total_time}
          value={formatHours(data.totalStudyMinutes)}
        />
        <KpiCard
          icon={Flame}
          label={dict.kpi.streak}
          value={dict.kpi.days.replace(
            "{{count}}",
            data.currentStreakDays.toString(),
          )}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScoreOverTimeChart
          data={data.scoreOverTime}
          dict={dict.charts.score_over_time}
        />
        <StatusBreakdownChart
          data={data.attemptsByStatus}
          dict={dict.charts.status_breakdown}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ByExamList data={data.byPracticeExam} dict={dict.charts.by_exam} />
        <ActivityHeatmap
          data={data.activityLast30Days}
          dict={dict.charts.activity}
        />
      </section>
    </div>
  );
}
