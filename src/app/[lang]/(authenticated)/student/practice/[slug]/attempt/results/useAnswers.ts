import { useInfiniteQuery } from "@tanstack/react-query";
import { listAnswersByAttempt } from "@/services/answers/list";
import type { AnswerFilters } from "@/services/answers";

export const useAnswers = (
  attemptId: number,
  filters?: AnswerFilters,
  pageSize: number = 10
) => {
  return useInfiniteQuery({
    queryKey: ["answers", attemptId, filters],
    queryFn: ({ pageParam = 0 }) =>
      listAnswersByAttempt(attemptId, pageParam, pageSize, filters),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
    initialPageParam: 0,
    enabled: !!attemptId,
  });
};
