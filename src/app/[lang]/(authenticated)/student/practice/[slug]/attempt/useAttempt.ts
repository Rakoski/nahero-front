"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { questionsService } from "@/services/questions";
import { alternativesService } from "@/services/alternatives";
import { studentPracticeAttemptsService } from "@/services/student-practice-attempts";
import { QUERIES } from "@/constants/queries";
import { IN_PROGRESS_ATTEMPT_KEY } from "@/hooks/useInProgressAttempt";
import type {
  PageResponse,
  ListQuestionsByStudentResponse,
  ListAlternativeByQuestionResponse,
  AnswerRequest,
} from "@/lib/dtos";
import type { FinishStudentPracticeAttemptRequestPayload } from "@/services/student-practice-attempts/finish";
import type { AttemptStateResponse } from "@/services/student-practice-attempts/get-state";

interface UseAttemptProps {
  attemptId: string | number;
  pageSize?: number;
}

const AUTO_SAVE_DEBOUNCE_MS = 400;

export const useAttempt = ({ attemptId, pageSize = 10 }: UseAttemptProps) => {
  const [pageOverride, setPageOverride] = useState<number | null>(null);
  const [answerEdits, setAnswerEdits] = useState<Map<string, string[]> | null>(
    null,
  );
  const queryClient = useQueryClient();

  const {
    data: attemptState,
    isLoading: isLoadingState,
    error: stateError,
  } = useQuery<AttemptStateResponse>({
    queryKey: [QUERIES.STUDENT_PRACTICE_ATTEMPTS.GET_STATE, attemptId],
    queryFn: () =>
      studentPracticeAttemptsService.getStudentPracticeAttemptState(attemptId),
    enabled: !!attemptId,
    // The attempt state seeds the timer and the saved answers; refetching it would
    // overwrite what the student is doing right now.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isHydrated = !!attemptState;

  // Answers picked before the student left are the starting point for this session;
  // anything they touch afterwards lives in `answerEdits`.
  const savedAnswers = useMemo(
    () =>
      new Map(
        (attemptState?.answers ?? []).map((answer) => [
          String(answer.questionId),
          answer.alternativeIds.map(String),
        ]),
      ),
    [attemptState],
  );

  const answers = answerEdits ?? savedAnswers;

  const restoredPage = attemptState
    ? Math.floor((attemptState.lastQuestionIndex ?? 0) / pageSize)
    : 0;

  const currentPage = pageOverride ?? restoredPage;

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
    enabled: !!attemptId && isHydrated,
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
        }),
      );

      return alternativesMap;
    },
    enabled: questionIds.length > 0,
  });

  const { mutate: saveProgress } = useMutation({
    mutationFn: studentPracticeAttemptsService.saveStudentPracticeAttemptProgress,
  });

  const pendingSaves = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(
    () => () => {
      pendingSaves.current.forEach(clearTimeout);
      pendingSaves.current.clear();
    },
    [],
  );

  const queueAnswerSave = useCallback(
    (questionId: string, alternativeIds: string[]) => {
      const pending = pendingSaves.current.get(questionId);
      if (pending) clearTimeout(pending);

      pendingSaves.current.set(
        questionId,
        setTimeout(() => {
          pendingSaves.current.delete(questionId);
          saveProgress({
            attemptId,
            questionId: Number(questionId),
            alternativeIds: alternativeIds.map(Number),
          });
        }, AUTO_SAVE_DEBOUNCE_MS),
      );
    },
    [attemptId, saveProgress],
  );

  const savePosition = useCallback(
    (questionIndex: number) => {
      saveProgress({ attemptId, lastQuestionIndex: questionIndex });
    },
    [attemptId, saveProgress],
  );

  const toggleAnswer = useCallback(
    (questionId: string, alternativeId: string, isSingleChoice: boolean) => {
      setAnswerEdits((edits) => {
        const prev = edits ?? savedAnswers;
        const current = prev.get(questionId) ?? [];
        const next = isSingleChoice
          ? [alternativeId]
          : current.includes(alternativeId)
            ? current.filter((id) => id !== alternativeId)
            : [...current, alternativeId];

        const newAnswers = new Map(prev);
        newAnswers.set(questionId, next);

        queueAnswerSave(questionId, next);

        return newAnswers;
      });
    },
    [queueAnswerSave, savedAnswers],
  );

  const answeredCount = useMemo(
    () => Array.from(answers.values()).filter((ids) => ids.length > 0).length,
    [answers],
  );

  const answersPayload = useCallback(
    (): AnswerRequest[] =>
      Array.from(answers.entries()).map(([questionId, alternativeIds]) => ({
        questionId,
        alternativeIds,
      })),
    [answers],
  );

  const cancelPendingSaves = useCallback(() => {
    pendingSaves.current.forEach(clearTimeout);
    pendingSaves.current.clear();
  }, []);

  const invalidateAttemptQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [QUERIES.QUESTIONS.LIST_STUDENT, attemptId],
    });
    queryClient.invalidateQueries({ queryKey: IN_PROGRESS_ATTEMPT_KEY });
  }, [queryClient, attemptId]);

  const {
    mutateAsync: finishExam,
    isPending: isFinishingExam,
    isSuccess: isExamFinished,
  } = useMutation<void, Error, void>({
    mutationFn: async () => {
      cancelPendingSaves();

      const payload: FinishStudentPracticeAttemptRequestPayload = {
        attemptId,
        answers: answersPayload(),
      };

      await studentPracticeAttemptsService.finishStudentPracticeAttempt(
        payload,
      );
    },
    onSuccess: invalidateAttemptQueries,
  });

  const { mutateAsync: abandonExam, isPending: isAbandoningExam } = useMutation<
    void,
    Error,
    void
  >({
    mutationFn: async () => {
      cancelPendingSaves();
      await studentPracticeAttemptsService.abandonStudentPracticeAttempt(
        attemptId,
      );
    },
    onSuccess: invalidateAttemptQueries,
  });

  const { mutateAsync: timeOutExam, isPending: isTimingOutExam } = useMutation<
    void,
    Error,
    void
  >({
    mutationFn: async () => {
      cancelPendingSaves();

      await studentPracticeAttemptsService.timeOutStudentPracticeAttempt({
        attemptId,
        answers: answersPayload(),
      });
    },
    onSuccess: invalidateAttemptQueries,
  });

  const goToNextPage = () => {
    if (questionsData && !questionsData.last) {
      setPageOverride(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setPageOverride(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (questionsData && page >= 0 && page < questionsData.totalPages) {
      setPageOverride(page);
    }
  };

  return {
    questions: questionsData?.content ?? [],
    questionsData,
    isLoadingQuestions: isLoadingQuestions || isLoadingState || !isHydrated,
    questionsError: questionsError ?? stateError,
    refetchQuestions,

    attemptState,
    savePosition,

    alternatives: alternativesQueries.data ?? {},
    isLoadingAlternatives: alternativesQueries.isLoading,
    alternativesError: alternativesQueries.error,

    answers,
    answersCount: answeredCount,
    toggleAnswer,

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

    abandonExam,
    isAbandoningExam,

    timeOutExam,
    isTimingOutExam,
  };
};
