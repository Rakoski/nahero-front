"use client";

import { useMutation } from "@tanstack/react-query";
import {
  answerPracticeQuestion,
  AnswerPracticeQuestionRequest,
  AnswerPracticeQuestionResponse,
} from "@/services/feedback/answer-practice-question";

export function useAnswerPracticeQuestion() {
  return useMutation<
    AnswerPracticeQuestionResponse,
    Error,
    AnswerPracticeQuestionRequest
  >({
    mutationFn: answerPracticeQuestion,
  });
}
