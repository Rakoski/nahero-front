"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { questionsService } from "@/services/questions";
import { alternativesService } from "@/services/alternatives";
import { studentPracticeAttemptsService } from "@/services/student-practice-attempts";
import { QUERIES } from "@/constants/queries";
import type {
  PageResponse,
  ListQuestionsByStudentResponse,
  ListAlternativeByQuestionResponse,
  AnswerRequest,
} from "@/lib/dtos";
import type {
  FinishStudentPracticeAttemptResponse,
  FinishStudentPracticeAttemptRequestPayload,
} from "@/services/student-practice-attempts/finish";

interface UseAttemptProps {
  attemptId: string | number;
  pageSize?: number;
}

export const useAttempt = ({ attemptId, pageSize = 10 }: UseAttemptProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string[]>>(new Map());
  const queryClient = useQueryClient();

  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuery<PageResponse<ListQuestionsByStudentResponse>>({
    queryKey: [
      QUERIES.QUESTIONS.LIST_STUDENT,
      attemptId,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      questionsService.listQuestionsByStudent({
        attemptId,
        page: currentPage,
        size: pageSize,
      }),
    enabled: !!attemptId,
  });

  // Fetch alternatives for each question on the current page
  const questionIds = questionsData?.content.map((q) => q.id) ?? [];

  const alternativesQueries = useQuery<
    Record<string, ListAlternativeByQuestionResponse[]>
  >({
    queryKey: [QUERIES.ALTERNATIVES.LIST_BY_QUESTION, questionIds],
    queryFn: async () => {
      const alternativesMap: Record<
        string,
        ListAlternativeByQuestionResponse[]
      > = {};

      // Fetch alternatives for all questions in parallel
      await Promise.all(
        questionIds.map(async (questionId) => {
          const alternatives =
            await alternativesService.listAlternativesByQuestion({
              questionId,
            });
          alternativesMap[questionId] = alternatives;
        })
      );

      return alternativesMap;
    },
    enabled: questionIds.length > 0,
  });

  const updateAnswer = useCallback(
    (questionId: string, alternativeIds: string[]) => {
      setAnswers((prev) => {
        const newAnswers = new Map(prev);
        newAnswers.set(questionId, alternativeIds);
        return newAnswers;
      });
    },
    []
  );

  const {
    mutateAsync: finishExam,
    isPending: isFinishingExam,
    isSuccess: isExamFinished,
    data: finishExamResult,
  } = useMutation<FinishStudentPracticeAttemptResponse | null, Error, void>({
    mutationFn: async () => {
      // Convert answers Map to AnswerRequest array
      const answersArray: AnswerRequest[] = Array.from(answers.entries()).map(
        ([questionId, alternativeIds]) => ({
          questionId,
          alternativeIds,
        })
      );

      const payload: FinishStudentPracticeAttemptRequestPayload = {
        attemptId,
        answers: answersArray,
      };

      return await studentPracticeAttemptsService.finishStudentPracticeAttempt(
        payload
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERIES.QUESTIONS.LIST_STUDENT, attemptId],
      });
    },
  });

  const goToNextPage = () => {
    if (questionsData && !questionsData.last) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (questionsData && page >= 0 && page < questionsData.totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    questions: questionsData?.content ?? [],
    questionsData,
    isLoadingQuestions,
    questionsError,
    refetchQuestions,

    alternatives: alternativesQueries.data ?? {},
    isLoadingAlternatives: alternativesQueries.isLoading,
    alternativesError: alternativesQueries.error,

    answers,
    answersCount: answers.size,
    updateAnswer,

    currentPage,
    totalPages: questionsData?.totalPages ?? 0,
    totalElements: questionsData?.totalElements ?? 0,
    isFirstPage: questionsData?.first ?? true,
    isLastPage: questionsData?.last ?? true,
    goToNextPage,
    goToPreviousPage,
    goToPage,

    finishExam,
    isFinishingExam,
    isExamFinished,
    finishExamResult,
  };
};
