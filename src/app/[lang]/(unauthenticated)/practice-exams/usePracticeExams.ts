"use client";

import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { atom, useAtom } from "jotai";
import { practiceExamsService } from "@/services/practice-exams";
import { QUERIES } from "../../../../constants/queries";
import type { PracticeExamsPageableResponse } from "@/lib/dtos";
import { studentPracticeAttemptsService } from "../../../../services/student-practice-attempts";
import { handleError } from "../../../../utils/error-utils";

export const searchPracticeExamAtom = atom("");
export const categoryPracticeExamAtom = atom<string>("all");
export const difficultyPracticeExamAtom = atom<number>(0);
export const sizeAtom = atom<number>(6);

export const usePracticeExams = () => {
  const [search] = useAtom(searchPracticeExamAtom);
  const [category] = useAtom(categoryPracticeExamAtom);
  const [difficultyLevel] = useAtom(difficultyPracticeExamAtom);
  const [size] = useAtom(sizeAtom);
  const debouncedSearchTerm = useDebounce(search, 500);

  const filters = {
    search: debouncedSearchTerm || undefined,
    category: category !== "all" ? category : undefined,
    difficultyLevel: difficultyLevel > 0 ? difficultyLevel : undefined,
    size,
  };

  const fetchPracticeExams = async ({
    pageParam,
  }: {
    pageParam: number;
  }): Promise<PracticeExamsPageableResponse> => {
    const response = await practiceExamsService.listPracticeExams({
      ...filters,
      page: pageParam,
    });
    return response;
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryFn: fetchPracticeExams,
    queryKey: [
      QUERIES.PRACTICE_EXAMS.LIST,
      debouncedSearchTerm,
      category,
      difficultyLevel,
      size,
    ],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });

  const practiceExams = data?.pages.flatMap((page) => page.content) ?? [];

  const { mutateAsync: startExam, isPending: isStartingExam } = useMutation({
    mutationFn: async (practiceExamId: number) => {
      return await studentPracticeAttemptsService.createStudentPracticeAttempt(
        practiceExamId
      );
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    practiceExams,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    totalElements: data?.pages[0]?.totalElements ?? 0,
    totalPages: data?.pages[0]?.totalPages ?? 0,
    startExam,
    isStartingExam,
  };
};
