"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { DifficultyLevels } from "@/constants/difficulty-levels";
import { FadeIn } from "@/components/ui/fade-in";
import { Routes } from "@/routes/routes";
import { ExamCard } from "../../../../components/practice-exams/components/exam-card";
import { ExamFilters as ExamFiltersComponent } from "../../../../components/practice-exams/components/exam-filters";
import { SkeletonCard } from "../../../../components/practice-exams/components/skeleton-card";
import { EmptyState } from "../../../../components/practice-exams/components/empty-state";
import { getDictionary } from "@/dictionaries";
import {
  usePracticeExams,
  searchPracticeExamAtom,
  categoryPracticeExamAtom,
  difficultyPracticeExamAtom,
} from "./usePracticeExams";
import type { PracticeExamDTO } from "@/lib/dtos";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type PracticeExamsDict = {
  title: string;
  subtitle: string;
  search_placeholder: string;
  search_button: string;
  clear_filters: string;
  filter_difficulty: string;
  filter_category: string;
  all_levels: string;
  all_categories: string;
  difficulty_levels: {
    beginner: string;
    intermediate: string;
    advanced: string;
    expert: string;
  };
  categories: {
    aws: string;
    azure: string;
    google: string;
  };
  card: {
    start_exam: string;
    time_limit: string;
    minimum_score: string;
    questions: string;
    category: string;
  };
  dialog: {
    title: string;
    description: string;
    difficulty_level: string;
    time_limit: string;
    questions_count: string;
    passing_score: string;
    category: string;
    cancel: string;
    start: string;
    starting: string;
  };
  empty_state: {
    title: string;
    description_filtered: string;
    description_empty: string;
    clear_button: string;
  };
  error_state: {
    title: string;
  };
  pagination?: {
    loading_more: string;
    load_more: string;
    showing_all: string;
  };
};

interface Props {
  params: Promise<{ lang: "en" | "pt" }>;
}

function mapPracticeExamToExam(dto: PracticeExamDTO) {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    difficulty: dto.exam.difficultyLevel as DifficultyLevels,
    slug: dto.title.toLowerCase().replace(/\s+/g, "-"),
    question_count: 0,
    time_limit: dto.timeLimit,
    passing_score: dto.passingScore,
    difficulty_level: dto.exam.difficultyLevel as DifficultyLevels,
    exam: {
      title: dto.exam.title,
      category: dto.exam.title,
    },
  };
}

export default function PracticeExamsPage({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [dict, setDict] = useState<PracticeExamsDict | null>(null);
  const [lang, setLang] = useState<"en" | "pt">("en");
  const [searchInput, setSearchInput] = useAtom(searchPracticeExamAtom);
  const [category, setCategory] = useAtom(categoryPracticeExamAtom);
  const [difficulty, setDifficulty] = useAtom(difficultyPracticeExamAtom);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then(async (p) => {
      setLang(p.lang);
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.practiceExams);
    });
  }, [params]);

  const {
    practiceExams,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalElements,
    startExam,
    isStartingExam,
  } = usePracticeExams();

  const practiceExamsMapped = practiceExams.map(mapPracticeExamToExam);

  const handleStartExam = useCallback(
    async (practiceExamId: number) => {
      // Check if user is authenticated
      if (status === "unauthenticated") {
        // Redirect to login with callback URL
        const callbackUrl = `/${lang}${Routes.PracticeExams}?startExam=${practiceExamId}`;
        router.push(
          `/${lang}${Routes.Login}?callbackUrl=${encodeURIComponent(
            callbackUrl
          )}`
        );
        return;
      }

      // User is authenticated, start the exam
      const attemptId = await startExam(practiceExamId);

      if (attemptId) {
        const targetUrl = `/${lang}${Routes.Practice}/${attemptId}/attempt`;
        router.push(targetUrl);
      }
    },
    [status, lang, router, startExam]
  );

  // Handle post-login exam start
  useEffect(() => {
    const startExamId = searchParams.get("startExam");
    if (startExamId && session && status === "authenticated") {
      const examId = parseInt(startExamId);
      if (!isNaN(examId)) {
        handleStartExam(examId);
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete("startExam");
        router.replace(url.pathname + url.search);
      }
    }
  }, [searchParams, session, status, handleStartExam, router]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const option = { threshold: 0.5 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => observer.unobserve(element);
  }, [handleObserver]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value === "all" ? 0 : parseInt(value));
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const clearFilters = () => {
    setSearchInput("");
    setCategory("all");
    setDifficulty(0);
  };

  const hasActiveFilters = Boolean(
    searchInput || difficulty > 0 || category !== "all"
  );

  if (!dict) return null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <FadeIn>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{dict.title}</h1>
          <p className="text-muted-foreground text-lg">{dict.subtitle}</p>
        </div>
      </FadeIn>

      <ExamFiltersComponent
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={() => {}}
        onKeyPress={handleKeyPress}
        difficulty={difficulty || undefined}
        onDifficultyChange={handleDifficultyChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        dict={dict}
      />

      {isLoading && practiceExamsMapped.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {!isLoading && practiceExamsMapped.length === 0 && (
        <EmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          dict={dict.empty_state}
        />
      )}

      {practiceExamsMapped.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceExamsMapped.map((practiceExam) => (
              <ExamCard
                key={practiceExam.id}
                exam={practiceExam}
                onStartExam={handleStartExam}
                isLoading={isStartingExam}
                dict={dict}
              />
            ))}
          </div>

          <div ref={observerTarget} className="flex justify-center py-8">
            {isFetchingNextPage && (
              <Button disabled variant="ghost" size="lg">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {dict.pagination?.loading_more || "Loading more..."}
              </Button>
            )}
            {!isFetchingNextPage && hasNextPage && (
              <Button
                onClick={() => fetchNextPage()}
                variant="outline"
                size="lg"
              >
                {dict.pagination?.load_more || "Load More"}
              </Button>
            )}
            {!hasNextPage && practiceExamsMapped.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {dict.pagination?.showing_all?.replace(
                  "{{count}}",
                  totalElements.toString()
                ) || `Showing all ${totalElements} practice practiceExams`}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
