import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import type {
  AnswerPracticeQuestionRequest,
  AnswerPracticeQuestionResponse,
} from "@/services/feedback/answer-practice-question";

export interface AnswerQuestionListQuestionRequest extends AnswerPracticeQuestionRequest {
  listId: number;
}

export async function answerQuestionListQuestion({
  listId,
  questionId,
  alternativeIds,
}: AnswerQuestionListQuestionRequest): Promise<AnswerPracticeQuestionResponse> {
  try {
    const response = await api.post<AnswerPracticeQuestionResponse>(
      NAHERO_API.QUESTION_LISTS.ANSWER_QUESTION(listId, questionId),
      { alternativeIds },
    );

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
