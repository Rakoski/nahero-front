"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { atom, useAtom } from "jotai";
import { practiceExamsService } from "@/services/practice-exams";
import { QUERIES } from "../../../../constants/queries";
import { PRACTICE_EXAMS_PAGE_SIZE } from "@/constants/practice-exams";
import type { PracticeExamsPageableResponse } from "@/lib/dtos";

export const searchPracticeExamAtom = atom("");
export const categoryPracticeExamAtom = atom<string>("all");
export const difficultyPracticeExamAtom = atom<number>(0);
export const sizeAtom = atom<number>(PRACTICE_EXAMS_PAGE_SIZE);

export const usePracticeExams = (
  initialPage?: PracticeExamsPageableResponse | null,
) => {
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

  // The server-rendered page only matches the untouched catalogue query.
  const isInitialQuery =
    !debouncedSearchTerm &&
    category === "all" &&
    difficultyLevel === 0 &&
    size === PRACTICE_EXAMS_PAGE_SIZE;

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
    initialData:
      initialPage && isInitialQuery
        ? { pages: [initialPage], pageParams: [0] }
        : undefined,
    staleTime: 5 * 60 * 1000,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });

  const practiceExams = data?.pages.flatMap((page) => page.content) ?? [];

  return {
    practiceExams,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    totalElements: data?.pages[0]?.totalElements ?? 0,
    totalPages: data?.pages[0]?.totalPages ?? 0,
  };
};
