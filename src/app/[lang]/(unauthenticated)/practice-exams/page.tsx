"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/ui/fade-in";
import { useExams, type ExamFilters } from "@/services/exams/use-exams";
import { Routes } from "@/routes/routes";
import { ExamCard } from "./components/exam-card";
import { ExamFilters as ExamFiltersComponent } from "./components/exam-filters";
import { SkeletonCard } from "./components/skeleton-card";
import { EmptyState } from "./components/empty-state";

type PracticeExamsDict = {
  title: string;
  subtitle: string;
  search_placeholder: string;
  search_button: string;
  clear_filters: string;
  filter_difficulty: string;
  filter_platform: string;
  all_levels: string;
  all_platforms: string;
  difficulty_levels: {
    beginner: string;
    intermediate: string;
    advanced: string;
    foundation: string;
    associate: string;
    professional: string;
    specialty: string;
  };
  platforms: {
    aws: string;
    azure: string;
    google: string;
  };
  card: {
    start_exam: string;
    time_limit: string;
    minimum_score: string;
    questions: string;
    platform: string;
  };
  dialog: {
    title: string;
    description: string;
    difficulty_level: string;
    time_limit: string;
    questions_count: string;
    passing_score: string;
    platform: string;
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
};

interface Props {
  params: Promise<{ lang: "en" | "pt" }>;
}

export default function PracticeExamsPage({ params }: Props) {
  const router = useRouter();
  const [dict, setDict] = useState<PracticeExamsDict | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<ExamFilters>({});
  const [isStartingExam, setIsStartingExam] = useState(false);

  useEffect(() => {
    params.then(async (p) => {
      const { getDictionary } = await import("@/dictionaries");
      const dictionary = await getDictionary(p.lang);
      setDict(dictionary.practiceExams);
    });
  }, [params]);

  const { data: exams, isLoading, error } = useExams(filters);

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim() || undefined,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDifficultyChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      difficulty:
        value === "all"
          ? undefined
          : (value as "Beginner" | "Intermediate" | "Advanced"),
    }));
  };

  const handlePlatformChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      platform: value === "all" ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({});
  };

  const handleStartExam = async (examId: number) => {
    try {
      setIsStartingExam(true);
      // TODO: Call API to create exam attempt
      // const response = await api.post(`/practice-exams/${examId}/attempt`);
      // const attemptId = response.data.id;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to exam attempt page
      router.push(`${Routes.PracticeExams}/${examId}/attempt`);
    } catch (error) {
      console.error("Failed to start exam:", error);
      // TODO: Show error toast
    } finally {
      setIsStartingExam(false);
    }
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.difficulty || filters.platform
  );

  if (!dict) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <FadeIn>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{dict.title}</h1>
          <p className="text-muted-foreground text-lg">{dict.subtitle}</p>
        </div>
      </FadeIn>

      {/* Filter Bar */}
      <FadeIn delay={0.1}>
        <ExamFiltersComponent
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
          difficulty={filters.difficulty}
          onDifficultyChange={handleDifficultyChange}
          platform={filters.platform}
          onPlatformChange={handlePlatformChange}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          dict={dict}
        />
      </FadeIn>

      {/* Error State */}
      {error && (
        <FadeIn delay={0.2}>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-destructive font-medium">
              {dict.error_state.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
          </div>
        </FadeIn>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* Exams Grid */}
      {!isLoading && !error && exams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, index) => (
            <FadeIn key={exam.id} delay={0.05 * index}>
              <ExamCard
                exam={exam}
                onStartExam={handleStartExam}
                isLoading={isStartingExam}
                dict={dict}
              />
            </FadeIn>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && exams.length === 0 && (
        <FadeIn delay={0.2}>
          <EmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            dict={dict.empty_state}
          />
        </FadeIn>
      )}
    </div>
  );
}
