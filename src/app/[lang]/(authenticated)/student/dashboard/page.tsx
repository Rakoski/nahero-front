"use client";

import { useEffect, useState } from "react";
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

type StudentDashboardDict = {
  title: string;
  welcome: string;
  loading: string;
  empty: {
    title: string;
    description: string;
    cta: string;
  };
  resume: {
    heading: string;
    description: string;
    cta: string;
  };
  retry: {
    heading: string;
    description: string;
    cta: string;
  };
  kpi: {
    total_attempts: string;
    pass_rate: string;
    average_score: string;
    best_score: string;
    total_time: string;
    streak: string;
    days: string;
    no_data: string;
  };
  charts: {
    score_over_time: {
      title: string;
      description: string;
      score_label: string;
      passing_label: string;
      empty: string;
    };
    status_breakdown: {
      title: string;
      description: string;
      empty: string;
      labels: {
        completed: string;
        timed_out: string;
        abandoned: string;
        in_progress: string;
      };
    };
    by_exam: {
      title: string;
      description: string;
      attempts_label: string;
      best: string;
      last: string;
      empty: string;
    };
    activity: {
      title: string;
      description: string;
      tooltip: string;
    };
  };
};

interface Props {
  params: Promise<{ lang: "en" | "pt" }>;
}

function formatHours(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export default function StudentDashboardPage({ params }: Props) {
  const { data: session } = useSession();
  const [dict, setDict] = useState<StudentDashboardDict | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");

  const { data, isLoading, isError } = useStudentDashboardSummary();

  useEffect(() => {
    params.then(async (p) => {
      setLang(p.lang);
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.studentDashboard as unknown as StudentDashboardDict);
    });
  }, [params]);

  if (!dict || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{dict?.loading ?? "Loading…"}</p>
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
