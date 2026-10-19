"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { getQuestionBankQuestion } from "@/services/question-bank/get-question";
import type { AnswerPracticeQuestionResponse } from "@/services/feedback/answer-practice-question";
import { useAnswerQuestionBankQuestion, useQuestionBankQuestion } from "@/hooks/useQuestionBank";
import { useAnswerQuestionListQuestion } from "@/hooks/useQuestionLists";

export type PracticeResults = Record<number, AnswerPracticeQuestionResponse>;

export function usePracticeSession(questionIds: number[], listId: number | null) {
  const queryClient = useQueryClient();
  const bankAnswer = useAnswerQuestionBankQuestion();
  const listAnswer = useAnswerQuestionListQuestion();
  const activeAnswer = listId === null ? bankAnswer : listAnswer;

  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState<Record<number, number[]>>({});
  const [results, setResults] = useState<PracticeResults>({});
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const questionId = questionIds[index] ?? null;
  const question = useQuestionBankQuestion(questionId);
  const nextId = questionIds[index + 1];

  useEffect(() => {
    if (nextId === undefined) return;
    void queryClient.prefetchQuery({
      queryKey: [QUERIES.QUESTION_BANK.GET_QUESTION, nextId],
      queryFn: () => getQuestionBankQuestion(nextId),
      staleTime: Infinity,
    });
  }, [nextId, queryClient]);

  const selected = questionId === null ? [] : (selections[questionId] ?? []);
  const result = questionId === null ? undefined : results[questionId];
  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter((entry) => entry.correct).length;

  const toggle = (alternativeId: number, multiple: boolean) => {
    if (questionId === null || result) return;
    const next = multiple
      ? selected.includes(alternativeId)
        ? selected.filter((id) => id !== alternativeId)
        : [...selected, alternativeId]
      : [alternativeId];
    setSelections((current) => ({ ...current, [questionId]: next }));
  };

  const answer = () => {
    if (questionId === null || result || selected.length === 0 || pendingId !== null) return;
    const answeredId = questionId;
    const callbacks = {
      onSuccess: (response: AnswerPracticeQuestionResponse) =>
        setResults((current) => ({ ...current, [answeredId]: response })),
      onSettled: () => setPendingId(null),
    };
    setPendingId(answeredId);
    if (listId === null) bankAnswer.mutate({ questionId: answeredId, alternativeIds: selected }, callbacks);
    else listAnswer.mutate({ questionId: answeredId, alternativeIds: selected, listId }, callbacks);
  };

  const goTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= questionIds.length) return;
    activeAnswer.reset();
    setIndex(nextIndex);
  };

  const restart = () => {
    activeAnswer.reset();
    setSelections({});
    setResults({});
    setIndex(0);
    setFinished(false);
  };

  return {
    index,
    question,
    selected,
    result,
    results,
    answeredCount,
    correctCount,
    isAnswering: pendingId !== null && pendingId === questionId,
    answerError: activeAnswer.error,
    finished,
    toggle,
    answer,
    goTo,
    finish: () => setFinished(true),
    restart,
  };
}
