"use client";

import {
  type InfiniteData,
  type InfiniteQueryObserverResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { listMyQuestionLists } from "@/services/question-lists/list-mine";
import {
  getQuestionList,
  type GetQuestionListResponse,
  type QuestionListItem,
} from "@/services/question-lists/get";
import {
  createQuestionList,
  CreateQuestionListRequest,
  CreateQuestionListResponse,
} from "@/services/question-lists/create";
import { deleteQuestionList } from "@/services/question-lists/delete";
import {
  addQuestionListQuestions,
  AddQuestionListQuestionsRequest,
  AddQuestionListQuestionsResponse,
} from "@/services/question-lists/add-questions";
import { removeQuestionListQuestion } from "@/services/question-lists/remove-question";
import {
  answerQuestionListQuestion,
  AnswerQuestionListQuestionRequest,
} from "@/services/question-lists/answer-question";
import type { AnswerPracticeQuestionResponse } from "@/services/feedback/answer-practice-question";
import { isPaymentRequiredError } from "@/utils/paywall-utils";
import { retryServerErrors, useInvalidateStudyProgress } from "@/hooks/useQuestionBank";

export function useMyQuestionLists() {
  const query = useQuery({
    queryKey: [QUERIES.QUESTION_LISTS.LIST_MINE],
    queryFn: listMyQuestionLists,
    retry: retryServerErrors,
    refetchOnWindowFocus: false,
  });

  return { ...query, isPaywalled: isPaymentRequiredError(query.error) };
}

export function useQuestionList(listId: number | null) {
  const query = useInfiniteQuery({
    queryKey: [QUERIES.QUESTION_LISTS.GET, listId],
    queryFn: ({ pageParam }) => getQuestionList(listId as number, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: listId !== null,
    retry: retryServerErrors,
    refetchOnWindowFocus: false,
  });

  const loadAll = async (): Promise<QuestionListItem[]> => {
    let result: InfiniteQueryObserverResult<InfiniteData<GetQuestionListResponse>, unknown> = query;
    while (result.hasNextPage && !result.isError) {
      result = await query.fetchNextPage({ cancelRefetch: false });
    }
    if (result.isError) throw result.error;
    return result.data?.pages.flatMap((page) => page.items) ?? [];
  };

  return { ...query, loadAll, isPaywalled: isPaymentRequiredError(query.error) };
}

function useInvalidateLists() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [QUERIES.QUESTION_LISTS.LIST_MINE] }),
      queryClient.invalidateQueries({ queryKey: [QUERIES.QUESTION_LISTS.GET] }),
    ]);
}

export function useCreateQuestionList() {
  const invalidate = useInvalidateLists();

  return useMutation<CreateQuestionListResponse, Error, CreateQuestionListRequest>({
    mutationFn: createQuestionList,
    onSuccess: () => invalidate(),
  });
}

export function useDeleteQuestionList() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteQuestionList,
    onSuccess: (_, listId) => {
      queryClient.removeQueries({ queryKey: [QUERIES.QUESTION_LISTS.GET, listId] });
      return queryClient.invalidateQueries({ queryKey: [QUERIES.QUESTION_LISTS.LIST_MINE] });
    },
  });
}

export function useAddQuestionListQuestions() {
  const invalidate = useInvalidateLists();

  return useMutation<AddQuestionListQuestionsResponse, Error, AddQuestionListQuestionsRequest>({
    mutationFn: addQuestionListQuestions,
    onSuccess: () => invalidate(),
  });
}

export function useRemoveQuestionListQuestions() {
  const invalidate = useInvalidateLists();

  return useMutation<void, Error, { listId: number; questionIds: number[] }>({
    mutationFn: async ({ listId, questionIds }) => {
      await Promise.all(questionIds.map((questionId) => removeQuestionListQuestion({ listId, questionId })));
    },
    onSettled: () => invalidate(),
  });
}

export function useAnswerQuestionListQuestion() {
  const invalidate = useInvalidateStudyProgress();

  return useMutation<AnswerPracticeQuestionResponse, Error, AnswerQuestionListQuestionRequest>({
    mutationFn: answerQuestionListQuestion,
    onSuccess: () => invalidate(),
  });
}
