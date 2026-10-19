"use client";

import { useAnswerQuestionBankQuestion } from "@/hooks/useQuestionBank";
import { useAnswerQuestionListQuestion } from "@/hooks/useQuestionLists";
import type { AnswerPracticeQuestionRequest } from "@/services/feedback/answer-practice-question";

export function useAnswerStudyQuestion(listId: number | null, onAnswered?: (correct: boolean) => void) {
  const bankAnswer = useAnswerQuestionBankQuestion();
  const listAnswer = useAnswerQuestionListQuestion();
  const active = listId === null ? bankAnswer : listAnswer;
  const onSuccess = ({ correct }: { correct: boolean }) => onAnswered?.(correct);

  return {
    mutation: {
      mutate: (request: AnswerPracticeQuestionRequest) =>
        listId === null
          ? bankAnswer.mutate(request, { onSuccess })
          : listAnswer.mutate({ ...request, listId }, { onSuccess }),
      data: active.data,
      isPending: active.isPending,
    },
    error: active.error,
  };
}
