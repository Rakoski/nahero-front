"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Target, AlertCircle } from "lucide-react";
import { Routes } from "@/routes/routes";
import { HistoryFilters } from "@/components/history/history-filters";
import { useHistory } from "./useHistory";

type HistoryDict = {
  title: string;
  subtitle: string;
  loading: string;
  error: {
    title: string;
    description: string;
  };
  empty: {
    title: string;
    description: string;
    action: string;
  };
  card: {
    score: string;
    timeSpent: string;
    timeLimit: string;
    passingScore: string;
    seeResults: string;
    retry: string;
  };
  timeFormat: {
    minutes: string;
    hours: string;
  };
  filters: {
    filter_exam: string;
    filter_date_from: string;
    filter_date_to: string;
    filter_min_score: string;
    clear_filters: string;
    all_exams: string;
  };
};

interface Props {
  params: Promise<{ lang: "en" | "pt" }>;
}

export default function HistoryPage({ params }: Props) {
  const router = useRouter();
  const [dict, setDict] = useState<HistoryDict | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");

  const {
    history,
    isLoading,
    error,
    filters,
    practiceExams,
    handleClearFilters,
    hasActiveFilters,
  } = useHistory();

  useEffect(() => {
    params.then(async (p) => {
      setLang(p.lang);
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.history);
    });
  }, [params]);

  const formatTime = (minutes: number | null): string => {
    if (!dict) return minutes !== null ? `${minutes} min` : "N/A";
    if (minutes === null) return "N/A";

    if (minutes < 60) {
      return dict.timeFormat.minutes.replace("{{time}}", minutes.toString());
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return dict.timeFormat.hours
      .replace("{{hours}}", hours.toString())
      .replace("{{minutes}}", mins.toString());
  };

  const handleSeeResults = (attemptId: number) => {
    router.push(`/${lang}/student/practice/${attemptId}/attempt/results`);
  };

  const handleRetry = (practiceExamTitle: string) => {
    router.push(`/${lang}${Routes.PracticeExams}`);
  };

  if (!dict) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show full-page spinner on initial load
  if (isLoading && (!history || history.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{dict.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 mx-auto py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <h2 className="text-xl font-semibold">{dict.error.title}</h2>
              <p className="text-muted-foreground">{dict.error.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{dict.title}</h1>
          <p className="text-muted-foreground">{dict.subtitle}</p>
        </div>

        <HistoryFilters
          practiceExamId={filters.practiceExamId}
          onPracticeExamIdChange={(value) =>
            filters.setPracticeExamId(value ? Number(value) : undefined)
          }
          startDate={filters.startDate}
          onStartDateChange={filters.setStartDate}
          endDate={filters.endDate}
          onEndDateChange={filters.setEndDate}
          minScore={filters.minScore}
          onMinScoreChange={(value) =>
            filters.setMinScore(value ? Number(value) : undefined)
          }
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          practiceExams={practiceExams.options}
          isLoadingExams={practiceExams.isLoading}
          onExamSearchChange={practiceExams.setSearchQuery}
          dict={dict.filters}
        />

        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <Trophy className="w-16 h-16 text-muted-foreground" />
              <h2 className="text-2xl font-semibold">{dict.empty.title}</h2>
              <p className="text-muted-foreground max-w-md">
                {dict.empty.description}
              </p>
              <Button
                onClick={() => router.push(`/${lang}${Routes.PracticeExams}`)}
                className="mt-4"
              >
                {dict.empty.action}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{dict.title}</h1>
          <p className="text-muted-foreground">{dict.subtitle}</p>
        </div>

        <HistoryFilters
          practiceExamId={filters.practiceExamId}
          onPracticeExamIdChange={(value) =>
            filters.setPracticeExamId(value ? Number(value) : undefined)
          }
          startDate={filters.startDate}
          onStartDateChange={filters.setStartDate}
          endDate={filters.endDate}
          onEndDateChange={filters.setEndDate}
          minScore={filters.minScore}
          onMinScoreChange={(value) =>
            filters.setMinScore(value ? Number(value) : undefined)
          }
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          practiceExams={practiceExams.options}
          isLoadingExams={practiceExams.isLoading}
          onExamSearchChange={practiceExams.setSearchQuery}
          dict={dict.filters}
        />

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
            isLoading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {history?.map((attempt) => {
            const passed = attempt.score >= attempt.passingScore;
            const percentageScore = Math.round(
              (attempt.score / 100) * 100, // Assuming score is already a percentage
            );

            return (
              <Card
                key={attempt.attemptId}
                className="flex flex-col hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {attempt.practiceExamTitle}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Badge variant={passed ? "default" : "destructive"}>
                      {percentageScore}%
                    </Badge>
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      {dict.card.score}:
                    </span>
                    <span className="font-semibold">{attempt.score}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {dict.card.timeSpent}:
                    </span>
                    <span className="font-semibold">
                      {formatTime(attempt.timeSpentInMinutes)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {dict.card.passingScore}:
                    </span>
                    <span className="font-semibold">
                      {attempt.passingScore}%
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    onClick={() => handleSeeResults(attempt.attemptId)}
                    className="flex-1"
                    variant="default"
                  >
                    {dict.card.seeResults}
                  </Button>
                  <Button
                    onClick={() => handleRetry(attempt.practiceExamTitle)}
                    className="flex-1"
                    variant="outline"
                  >
                    {dict.card.retry}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
