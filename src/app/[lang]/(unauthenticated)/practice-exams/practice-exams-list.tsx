"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAtom } from "jotai";
import { DifficultyLevels } from "@/constants/difficulty-levels";
import { FadeIn } from "@/components/ui/fade-in";
import { ExamCard } from "../../../../components/practice-exams/components/exam-card";
import { ExamFilters as ExamFiltersComponent } from "../../../../components/practice-exams/components/exam-filters";
import { SkeletonCard } from "../../../../components/practice-exams/components/skeleton-card";
import { EmptyState } from "../../../../components/practice-exams/components/empty-state";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  usePracticeExams,
  searchPracticeExamAtom,
  categoryPracticeExamAtom,
  difficultyPracticeExamAtom,
} from "./usePracticeExams";
import type { PracticeExamDTO } from "@/lib/dtos";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";

function mapPracticeExamToExam(dto: PracticeExamDTO) {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    difficulty: dto.exam.difficultyLevel as DifficultyLevels,
    slug: dto.slug,
    question_count: dto.numberOfQuestions ?? 0,
    time_limit: dto.timeLimit,
    passing_score: dto.passingScore,
    difficulty_level: dto.exam.difficultyLevel as DifficultyLevels,
    exam: {
      title: dto.exam.title,
      category: dto.exam.title,
    },
  };
}

export default function PracticeExamsPage() {
  const { lang, dict: dictionary } = useLocale();
  const dict = dictionary.practiceExams;
  const [searchInput, setSearchInput] = useAtom(searchPracticeExamAtom);
  const [category, setCategory] = useAtom(categoryPracticeExamAtom);
  const [difficulty, setDifficulty] = useAtom(difficultyPracticeExamAtom);

  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    practiceExams,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalElements,
  } = usePracticeExams();

  const practiceExamsMapped = practiceExams.map(mapPracticeExamToExam);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
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
    searchInput || difficulty > 0 || category !== "all",
  );

  return (
    <div className="container mx-auto px-4 py-4 space-y-8">
      <Breadcrumbs
        lang={lang}
        items={[{ label: dict.title }]}
        dict={dictionary.breadcrumbs}
      />
      <FadeIn>
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">{dict.title}</h1>
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
              <ExamCard key={practiceExam.id} exam={practiceExam} />
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
                  totalElements.toString(),
                ) || `Showing all ${totalElements} practice practiceExams`}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
