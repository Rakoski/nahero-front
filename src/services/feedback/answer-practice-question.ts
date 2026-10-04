import { NAHERO_API } from "@/constants/nahero-api";
import { api } from "@/lib/api-manager";
import { handleError } from "@/utils/error-utils";

export interface AnswerPracticeQuestionRequest {
  questionId: number;
  alternativeIds: number[];
}

export interface AnswerPracticeQuestionResponse {
  correct: boolean;
  correctAlternativeIds: number[];
  explanation: string | null;
}

export async function answerPracticeQuestion({
  questionId,
  alternativeIds,
}: AnswerPracticeQuestionRequest): Promise<AnswerPracticeQuestionResponse> {
  try {
    const response = await api.post<AnswerPracticeQuestionResponse>(
      NAHERO_API.FEEDBACK.ANSWER_PRACTICE_QUESTION(questionId),
      { alternativeIds },
    );

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
