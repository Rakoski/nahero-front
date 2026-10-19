"use client";

import { useEffect } from "react";
import {
  infiniteQueryOptions,
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { getQuestionBankFilters } from "@/services/question-bank/get-filters";
import { listQuestionBank, type QuestionBankFilter, type QuestionBankStatus } from "@/services/question-bank/list";
import { getQuestionBankQuestion } from "@/services/question-bank/get-question";
import { answerQuestionBankQuestion } from "@/services/question-bank/answer-question";
import type {
  AnswerPracticeQuestionRequest,
  AnswerPracticeQuestionResponse,
} from "@/services/feedback/answer-practice-question";
import { isPaymentRequiredError } from "@/utils/paywall-utils";
import { isServerError } from "@/utils/error-utils";

export const retryServerErrors = (failureCount: number, error: unknown) =>
  isServerError(error) && failureCount < 2;

export function useQuestionBankFilters() {
  const query = useQuery({
    queryKey: [QUERIES.QUESTION_BANK.FILTERS],
    queryFn: getQuestionBankFilters,
    retry: retryServerErrors,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return { ...query, isPaywalled: isPaymentRequiredError(query.error) };
}

const STATUSES: (QuestionBankStatus | undefined)[] = [undefined, "RESOLVED", "UNRESOLVED"];

const questionBankOptions = (filter: QuestionBankFilter) =>
  infiniteQueryOptions({
    queryKey: [QUERIES.QUESTION_BANK.LIST, filter],
    queryFn: ({ pageParam }) => listQuestionBank({ ...filter, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    retry: retryServerErrors,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

export function useQuestionBank(filter: QuestionBankFilter, enabled = true) {
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({ ...questionBankOptions(filter), placeholderData: keepPreviousData, enabled });
  const isReady = enabled && query.isSuccess && !query.isPlaceholderData;

  useEffect(() => {
    if (!isReady) return;
    for (const status of STATUSES) {
      if (status !== filter.status) void queryClient.prefetchInfiniteQuery(questionBankOptions({ ...filter, status }));
    }
  }, [isReady, filter, queryClient]);

  return { ...query, isPaywalled: isPaymentRequiredError(query.error) };
}

export function useQuestionBankQuestion(questionId: number | null) {
  return useQuery({
    queryKey: [QUERIES.QUESTION_BANK.GET_QUESTION, questionId],
    queryFn: () => getQuestionBankQuestion(questionId as number),
    enabled: questionId !== null,
    retry: retryServerErrors,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

export function useInvalidateStudyProgress() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [QUERIES.QUESTION_BANK.LIST] }),
      queryClient.invalidateQueries({ queryKey: [QUERIES.QUESTION_LISTS.LIST_MINE] }),
      queryClient.invalidateQueries({ queryKey: [QUERIES.QUESTION_LISTS.GET] }),
    ]);
}

export function useAnswerQuestionBankQuestion() {
  const invalidate = useInvalidateStudyProgress();

  return useMutation<AnswerPracticeQuestionResponse, Error, AnswerPracticeQuestionRequest>({
    mutationFn: answerQuestionBankQuestion,
    onSuccess: () => invalidate(),
  });
}
