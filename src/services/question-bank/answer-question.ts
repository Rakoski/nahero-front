import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";
import type {
  AnswerPracticeQuestionRequest,
  AnswerPracticeQuestionResponse,
} from "@/services/feedback/answer-practice-question";

export async function answerQuestionBankQuestion({
  questionId,
  alternativeIds,
}: AnswerPracticeQuestionRequest): Promise<AnswerPracticeQuestionResponse> {
  try {
    const response = await api.post<AnswerPracticeQuestionResponse>(
      NAHERO_API.QUESTION_BANK.ANSWER_QUESTION(questionId),
      { alternativeIds },
    );

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
