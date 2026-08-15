"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Routes } from "@/routes/routes";
import { QUERIES } from "@/constants/queries";
import type { GetResultResponse } from "@/services/student-practice-attempts/get-result";
import { studentPracticeAttemptsService } from "@/services/student-practice-attempts";
import { CheckCircle2, XCircle, Clock, Award } from "lucide-react";
import type { AnswerFilters } from "@/services/answers";
import { useAnswers } from "./useAnswers";
import { AnswersList } from "../../../../../../../../components/answers/answersList";
import { resolveLocale } from "@/lib/locale";

type ExamResultsDict = {
  title: string;
  subtitle: string;
  loading: string;
  status: {
    passed: string;
    failed: string;
  };
  statusLabels: {
    completed: string;
    timed_out: string;
    in_progress: string;
  };
  stats: {
    score: string;
    correct: string;
    incorrect: string;
    total: string;
    timeSpent: string;
    passingScore: string;
    attemptStatus: string;
    answered: string;
    startTime: string;
    endTime: string;
    limit: string;
  };
  details: string;
  percentages: {
    correct: string;
    incorrect: string;
  };
  actions: {
    retry: string;
    backToExams: string;
    viewDetails: string;
  };
  timeFormat: {
    minutes: string;
    hours: string;
  };
  answers: {
    title: string;
    showAll: string;
    showCorrect: string;
    showIncorrect: string;
    searchPlaceholder: string;
    loading: string;
    questionNumber: string;
    correct: string;
    incorrect: string;
    questionAlt: string;
    alternativeAlt: string;
    explanation: string;
  };
};

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export default function ExamResultsPage({ params }: Props) {
  const router = useRouter();
  const [dict, setDict] = useState<ExamResultsDict | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");
  const [showAnswers, setShowAnswers] = useState(false);
  const [filters, setFilters] = useState<AnswerFilters>({});
  const answersRef = useRef<HTMLDivElement>(null);

  const {
    data: answersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingAnswers,
  } = useAnswers(attemptId || 0, filters, 10);

  // Fetch results from API
  const {
    data: results,
    isLoading: isLoadingResults,
    error: resultsError,
  } = useQuery<GetResultResponse>({
    queryKey: [QUERIES.STUDENT_PRACTICE_ATTEMPTS.GET_RESULT, attemptId],
    queryFn: () =>
      studentPracticeAttemptsService.getStudentPracticeAttemptResult(
        attemptId!,
      ),
    enabled: !!attemptId,
    retry: 1,
  });

  useEffect(() => {
    params.then(async (p) => {
      setAttemptId(parseInt(p.slug));
      setLang(resolveLocale(p.lang));
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(resolveLocale(p.lang));
      setDict(dictionary.examResults);
    });
  }, [params]);

  useEffect(() => {
    if (resultsError) {
      console.error("Failed to fetch results:", resultsError);
      router.push(`/${lang}${Routes.PracticeExams}`);
    }
  }, [resultsError, router, lang]);

  // Infinite scroll observer
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(currentTarget);

    return () => {
      observer.unobserve(currentTarget);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleViewDetails = useCallback(() => {
    setShowAnswers(true);
    setTimeout(() => {
      answersRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  if (!dict || !results || isLoadingResults) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {dict?.loading || "Loading results..."}
          </p>
        </div>
      </div>
    );
  }

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return dict.timeFormat.minutes.replace("{{time}}", minutes.toString());
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return dict.timeFormat.hours
      .replace("{{hours}}", hours.toString())
      .replace("{{minutes}}", mins.toString());
  };

  const percentageScore = Math.round(
    (results.score / results.numberOfQuestions) * 100,
  );
  const isPassed = results.passed;

  const getStatusLabel = (status: string): string => {
    const statusKey = status.toLowerCase() as keyof typeof dict.statusLabels;
    return dict.statusLabels[statusKey] || status;
  };

  const allAnswers = answersData?.pages.flatMap((page) => page.content) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{dict.title}</h1>
          <p className="text-muted-foreground">{dict.subtitle}</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              {isPassed ? (
                <>
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                  <h2 className="text-2xl font-bold text-green-500">
                    {dict.status.passed}
                  </h2>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 text-red-500" />
                  <h2 className="text-2xl font-bold text-red-500">
                    {dict.status.failed}
                  </h2>
                </>
              )}
              <div className="flex items-center gap-2">
                <span className="text-5xl font-bold">{percentageScore}%</span>
              </div>
              <Progress
                value={percentageScore}
                className="w-full max-w-md h-3"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <CardTitle>{dict.stats.score}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {results.score} / {results.numberOfQuestions}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {dict.stats.passingScore}: {results.passingPercentageScore}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <CardTitle>{dict.stats.timeSpent}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {formatTime(results.timeSpentInMinutes)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {dict.stats.limit}: {formatTime(results.timeLimit)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <CardTitle>{dict.stats.correct}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {results.correctAnswers}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round((results.correctAnswers / results.answers) * 100)}%{" "}
                {dict.percentages.correct}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <CardTitle>{dict.stats.incorrect}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">
                {results.incorrectAnswers}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round((results.incorrectAnswers / results.answers) * 100)}
                % {dict.percentages.incorrect}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{dict.details}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {dict.stats.attemptStatus}:
              </span>
              <Badge
                variant={isPassed ? "default" : "destructive"}
                className="text-base px-3 py-1"
              >
                {getStatusLabel(results.attemptStatus)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{dict.stats.total}:</span>
              <span className="font-semibold">{results.numberOfQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {dict.stats.answered}:
              </span>
              <span className="font-semibold">{results.answers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {dict.stats.startTime}:
              </span>
              <span className="font-semibold">
                {new Date(results.startTime).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {dict.stats.endTime}:
              </span>
              <span className="font-semibold">
                {new Date(results.endTime).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <div ref={answersRef} className="mt-8">
          <AnswersList
            answers={allAnswers}
            filters={filters}
            onFiltersChange={setFilters}
            isLoading={isLoadingAnswers}
            dict={dict.answers}
          />

          <div
            ref={observerTarget}
            className="h-10 flex items-center justify-center"
          >
            {isFetchingNextPage && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
