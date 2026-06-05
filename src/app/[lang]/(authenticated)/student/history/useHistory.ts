"use client";

import { useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { studentPracticeAttemptsService } from "@/services/student-practice-attempts";
import { practiceExamsService } from "@/services/practice-exams";
import { QUERIES } from "@/constants/queries";
import type {
  GetHistoryResponse,
  GetHistoryFilters,
} from "@/services/student-practice-attempts/get-history";

export function useHistory() {
  const [filters, setFilters] = useState<GetHistoryFilters>({});
  const [practiceExamId, setPracticeExamId] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minScore, setMinScore] = useState<number | undefined>();
  const [examSearchQuery, setExamSearchQuery] = useState("");

  const handleApplyFilters = () => {
    const newFilters: GetHistoryFilters = {};

    if (practiceExamId) {
      newFilters.practiceExamId = practiceExamId;
    }

    if (startDate) {
      newFilters.startDate = startDate;
    }

    if (endDate) {
      newFilters.endDate = endDate;
    }

    if (minScore !== undefined && minScore > 0) {
      newFilters.score = minScore;
    }

    setFilters(newFilters);
  };

  const {
    data: history,
    isLoading,
    error,
  } = useQuery<GetHistoryResponse[]>({
    queryKey: [QUERIES.STUDENT_PRACTICE_ATTEMPTS.GET_HISTORY, filters],
    queryFn: () =>
      studentPracticeAttemptsService.getStudentPracticeAttemptHistory(filters),
    retry: 1,
  });

  const {
    data: practiceExamsData,
    isLoading: isLoadingExams,
    fetchNextPage: fetchNextExamsPage,
    hasNextPage: hasNextExamsPage,
  } = useInfiniteQuery({
    queryKey: [QUERIES.PRACTICE_EXAMS.LIST, examSearchQuery],
    queryFn: ({ pageParam = 0 }) =>
      practiceExamsService.listPracticeExams({
        page: pageParam,
        size: 20,
        search: examSearchQuery || undefined,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
    initialPageParam: 0,
  });

  const practiceExamsOptions =
    practiceExamsData?.pages.flatMap((page) =>
      page.content.map((exam) => ({
        value: exam.id.toString(),
        label: exam.title,
      })),
    ) || [];

  const handleClearFilters = () => {
    setPracticeExamId(undefined);
    setStartDate("");
    setEndDate("");
    setMinScore(undefined);
    setFilters({});
  };

  const hasActiveFilters =
    !!practiceExamId || !!startDate || !!endDate || !!minScore;

  return {
    history,
    isLoading,
    error,
    filters: {
      practiceExamId,
      setPracticeExamId,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      minScore,
      setMinScore,
    },
    practiceExams: {
      options: practiceExamsOptions,
      isLoading: isLoadingExams,
      searchQuery: examSearchQuery,
      setSearchQuery: setExamSearchQuery,
      fetchNextPage: fetchNextExamsPage,
      hasNextPage: hasNextExamsPage,
    },
    handleClearFilters,
    handleApplyFilters,
    hasActiveFilters,
  };
}
